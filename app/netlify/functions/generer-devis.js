const ALLOWED_ORIGINS = [
  'https://devisia.netlify.app',
  'https://cheery-crisp-edf241.netlify.app',
  'http://localhost',
  'file://'
];

function getCorsHeaders(origin) {
  const allowed = !origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed ? (origin || '*') : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const corsHeaders = getCorsHeaders(origin);

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Configuration serveur manquante. Contactez l\'administrateur.' })
    };
  }

  // --- Validation des inputs ---
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Corps de la requête invalide.' }) };
  }

  const { description, tva } = body;

  if (!description || typeof description !== 'string') {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'La description du chantier est requise.' }) };
  }
  if (description.trim().length < 20) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'La description est trop courte (minimum 20 caractères).' }) };
  }
  if (description.length > 2000) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'La description est trop longue (maximum 2000 caractères).' }) };
  }
  if (!tva || ![10, 20].includes(Number(tva))) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Taux de TVA invalide (10 ou 20 acceptés).' }) };
  }

  // --- Appel Claude API ---
  const prompt = `Tu es un expert en devis du bâtiment français. Un artisan décrit un chantier en langage naturel. Génère un devis structuré réaliste, organisé par lots.

Description du chantier : "${description.trim()}"
TVA applicable : ${tva}%

Instructions :
- Crée entre 2 et 4 lots cohérents avec la nature du chantier (ex : "Lot 1 - Dépose et préparation", "Lot 2 - Fournitures", "Lot 3 - Main d'œuvre")
- Chaque lot contient entre 2 et 4 lignes de détail
- Prix unitaires cohérents avec le marché BTP français 2026
- Désignations précises et professionnelles
- Unités possibles : forfait, m², ml, h, u, m³

Retourne UNIQUEMENT ce JSON valide, sans texte ni bloc markdown :
{
  "titre": "Devis [résumé du chantier en 4-6 mots]",
  "lots": [
    {
      "nom": "Lot 1 - Dépose et préparation",
      "lignes": [
        {
          "designation": "Description précise",
          "quantite": 1,
          "unite": "forfait",
          "prix_unitaire_ht": 150.00
        }
      ]
    }
  ]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erreur Claude API:', response.status, errText);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Le service IA est temporairement indisponible. Réessayez dans quelques instants.' })
      };
    }

    const data = await response.json();
    let jsonText = data.content?.[0]?.text?.trim();

    if (!jsonText) {
      throw new Error('Réponse Claude vide');
    }

    // Nettoyer les blocs markdown si présents
    const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) jsonText = match[1].trim();

    let devis;
    try {
      devis = JSON.parse(jsonText);
    } catch {
      console.error('JSON invalide reçu de Claude:', jsonText);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'La réponse de l\'IA était invalide. Réessayez en reformulant votre description.' })
      };
    }

    // Valider la structure du JSON retourné
    if (
      !devis.titre ||
      !Array.isArray(devis.lots) ||
      devis.lots.length === 0 ||
      !devis.lots.every(lot => lot.nom && Array.isArray(lot.lignes) && lot.lignes.length > 0)
    ) {
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Le devis généré est incomplet. Réessayez en détaillant davantage votre chantier.' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(devis)
    };

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Une erreur inattendue s\'est produite. Réessayez dans quelques secondes.' })
    };
  }
};
