# DevisIA MVP

Générateur de devis IA pour artisans du bâtiment. L'artisan décrit son chantier en langage naturel, Claude génère un devis structuré en quelques secondes.

---

## Stack technique

- **Frontend** : HTML + Tailwind CSS via CDN
- **IA** : Claude API (claude-haiku-4-5) via Netlify Function
- **Auth + BDD** : Supabase (anon key côté client, RLS pour la sécurité)
- **PDF** : html2pdf.js via CDN
- **Déploiement** : Netlify

---

## Variables d'environnement

### Netlify (secrets — à configurer dans Site settings > Environment variables)

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Clef API Anthropic (Claude) |

### index.html et historique.html (publiques — à remplacer dans le code)

| Constante | Description |
|---|---|
| `SUPABASE_URL` | URL de ton projet Supabase |
| `SUPABASE_ANON_KEY` | Clef anon Supabase (publique par design) |

---

## Déploiement sur Netlify

1. Créer un nouveau site Netlify depuis le repo GitHub
2. **Base directory** : `livrables/agents-ia/DevisIA_MVP/app`
3. **Publish directory** : `.`
4. Ajouter `ANTHROPIC_API_KEY` dans les variables d'environnement Netlify
5. Déployer

---

## Configuration Supabase

### 1. Créer un projet sur supabase.com

### 2. Exécuter ce SQL dans l'éditeur SQL Supabase

```sql
-- Table profils (1 par utilisateur)
CREATE TABLE profils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT, nom TEXT, raison_sociale TEXT,
  siret TEXT, telephone TEXT, email_pro TEXT,
  conditions TEXT, logo_base64 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profils ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateur voit son profil" ON profils
  FOR ALL USING (auth.uid() = user_id);

-- Table devis (1 par devis généré)
CREATE TABLE devis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  numero TEXT, titre TEXT,
  client_nom TEXT, client_ville TEXT,
  description TEXT, tva INTEGER,
  lignes JSONB, total_ht NUMERIC, total_ttc NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateur voit ses devis" ON devis
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Récupérer les clefs

Dans Supabase : **Settings > API**
- `Project URL` → remplacer `VOTRE_SUPABASE_URL` dans index.html et historique.html
- `anon public` → remplacer `VOTRE_SUPABASE_ANON_KEY`

---

## Développement local

Le formulaire et l'affichage du devis fonctionnent en ouvrant `index.html` directement dans le navigateur (mode essai sans compte).

L'appel à l'API Claude nécessite un déploiement Netlify actif (la Netlify Function ne tourne pas en local sans Netlify CLI).
