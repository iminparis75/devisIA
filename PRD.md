# PRD — DevisIA MVP

> Product Requirements Document
> Rédigé le 2026-05-24 | Statut : Draft v1

---

## 1. Contexte et objectif

### Problème

Les artisans du bâtiment en TPE (solo ou 2-3 personnes) perdent 30 à 60 minutes par devis. Ils travaillent souvent depuis leur téléphone, entre deux chantiers, et ne sont pas à l'aise avec les outils digitaux. Résultat : des devis tardifs, peu professionnels, ou pas envoyés du tout — ce qui leur fait perdre des chantiers.

### Solution

DevisIA est un outil web qui permet à un artisan de décrire son chantier en langage naturel (comme un message vocal retranscrit ou un SMS), et qui génère automatiquement un devis structuré et professionnel, prêt à télécharger ou partager.

### Double objectif

- **ESCP** : livrable concret pour le projet fil rouge (rapport + démo soutenance, deadline 20 sept. 2026)
- **Vitrine professionnelle** : preuve de compétence Product Builder pour la recherche d'emploi et les missions freelance

---

## 2. Utilisateur cible

**Profil principal :** Artisan solo du bâtiment, peu à l'aise avec le digital

| Attribut | Détail |
|----------|--------|
| Métier | Plombier, électricien, peintre, maçon, menuisier, carreleur |
| Structure | Indépendant ou micro-entreprise |
| Niveau digital | Smartphone quotidien, mais peu d'apps métier. Évite ce qui est complexe. |
| Contexte d'usage | Entre deux chantiers, souvent depuis le téléphone |
| Frustration principale | "Je perds trop de temps sur la paperasse" |
| Besoin clé | Rapide, simple, résultat professionnel sans effort |

---

## 3. Périmètre du MVP

### Ce qui est DANS le MVP

- Saisie du chantier en texte libre (langage naturel)
- Structuration automatique par l'IA (Claude API)
- Génération d'un devis affiché dans le navigateur
- Téléchargement du devis en PDF
- Profil artisan basique : nom, prénom, SIRET, email, téléphone, logo (optionnel)
- Mode essai sans compte (profil saisi à chaque fois, non sauvegardé)
- Mode compte : profil sauvegardé, historique des devis

### Ce qui est HORS MVP (versions futures)

- Envoi automatique du devis par email au client
- Signature électronique
- Relance automatique des devis non signés
- Intégration comptable (Pennylane, Freebe, etc.)
- Application mobile native
- Multi-utilisateurs / équipe
- Personnalisation avancée (couleurs, CGV sur mesure)

---

## 4. Parcours utilisateur principal

### Mode essai (sans compte)

```
1. L'artisan arrive sur la page d'accueil
2. Il clique sur "Créer un devis"
3. Il saisit ses infos de base (nom, email, SIRET) — non sauvegardées
4. Il décrit le chantier en texte libre dans un champ unique
   Ex : "Refaire la salle de bain au complet, 8m², dépose de l'ancien carrelage,
         pose de carrelage neuf sol et murs, remplacement de la douche et du lavabo,
         client Mme Dupont à Vincennes, travaux en juin"
5. Il clique sur "Générer le devis"
6. L'IA analyse le texte et génère un devis structuré (lignes, quantités, prix estimés, TVA)
7. Le devis s'affiche dans le navigateur (aperçu web)
8. L'artisan peut modifier les lignes manuellement si besoin
9. Il télécharge le PDF
```

### Mode compte (avec inscription)

```
Même parcours, mais :
- Le profil artisan est pré-rempli automatiquement
- Le devis est sauvegardé dans l'historique
- L'artisan peut retrouver et retélécharger ses anciens devis
```

---

## 5. Fonctionnalités détaillées

### F1 — Saisie texte libre
- Un seul champ textarea grand format
- Placeholder d'exemple pour guider l'artisan
- Pas de champs obligatoires multiples (trop intimidant)
- Longueur min : 20 caractères avant activation du bouton "Générer"

### F2 — Génération IA (Claude API)
- Appel à l'API Claude (claude-haiku-4-5 pour la rapidité et le coût)
- Prompt système : rôle d'expert devis BTP, extraction des informations clés, génération de lignes de devis avec quantités et prix unitaires estimés
- Sortie JSON structurée : liste de lignes (désignation, quantité, unité, prix unitaire HT, TVA)
- Calcul automatique : total HT, TVA (10% travaux rénovation / 20% standard), total TTC

### F3 — Aperçu web du devis
- Mise en page propre et professionnelle dans le navigateur
- En-tête : infos artisan + infos client (nom, adresse si fournis)
- Tableau des prestations : désignation / quantité / unité / prix unitaire / montant HT
- Bas de page : sous-total HT, TVA, total TTC, conditions de paiement
- Mention légale : numéro de devis (généré automatiquement), date, validité (30 jours par défaut)
- Modification inline possible avant téléchargement

### F4 — Export PDF
- Génération PDF côté client (bibliothèque jsPDF ou html2pdf.js)
- Mise en page identique à l'aperçu web
- Nom de fichier automatique : `Devis_[NomClient]_[Date].pdf`

### F5 — Profil artisan
- Champs : prénom, nom, raison sociale, SIRET, adresse, email, téléphone
- Logo : upload image (optionnel, affiché en en-tête du devis)
- Conditions de paiement personnalisables (texte libre)
- En mode essai : saisi à chaque nouvelle session
- En mode compte : sauvegardé, pré-rempli automatiquement

### F6 — Compte utilisateur (simplifié)
- Inscription : email + mot de passe
- Connexion simple
- Historique des devis : liste avec date, client, montant, bouton re-télécharger
- Pas de gestion d'équipe, pas d'abonnement payant pour le MVP

---

## 6. Stack technique recommandée

### Recommandation pour ce profil et ces objectifs

| Composant | Choix | Pourquoi |
|-----------|-------|----------|
| Interface | HTML + Tailwind CSS | Déjà maîtrisé, rapide, déployable sur Netlify |
| IA | Claude API (claude-haiku-4-5) | Rapide, peu coûteux, qualité suffisante pour le MVP |
| Appel API sécurisé | Netlify Functions (serverless) | Pas de backend à gérer, la clef API reste côté serveur |
| PDF | html2pdf.js (CDN) | Simple à intégrer, transforme le HTML en PDF sans serveur |
| Auth + base de données | Supabase (tier gratuit) | Auth clé en main, base de données PostgreSQL, SDK JS simple |
| Déploiement | Netlify (déjà configuré) | CD automatique depuis GitHub |

### Architecture simplifiée

```
Navigateur (HTML/JS/Tailwind)
    ↓ saisie texte
Netlify Function (Node.js)
    ↓ appel API
Claude API (Haiku)
    ↓ retour JSON structuré
Navigateur
    ↓ affichage aperçu devis
html2pdf.js
    ↓
PDF téléchargé localement

(Pour le compte)
Supabase Auth → login/signup
Supabase DB → sauvegarde profil + historique devis
```

### Pourquoi pas du no-code pur ?
Make + Airtable serait plus rapide à assembler, mais moins impressionnant en démo jury, moins contrôlable pour la mise en page du devis, et moins formateur pour les compétences Product Builder visées. La stack recommandée reste accessible avec ton niveau actuel et Claude Code pour t'accompagner.

---

## 7. Critères de succès du MVP

| Critère | Seuil minimum |
|---------|---------------|
| Temps pour générer un devis | Moins de 3 minutes de A à Z |
| Qualité du devis généré | Lignes cohérentes avec la description, prix dans les ordres de grandeur du marché BTP |
| PDF téléchargeable | Oui, mise en page propre |
| Fonctionne sur mobile | Oui (responsive) |
| Démo live possible devant jury | Oui, sans bug bloquant |

---

## 8. Planning indicatif

| Étape | Contenu | Durée estimée |
|-------|---------|---------------|
| 1. Interface de saisie | Page de génération (formulaire + bouton) | 1 session |
| 2. Netlify Function + Claude API | Connexion IA, retour JSON | 1-2 sessions |
| 3. Aperçu web du devis | Affichage structuré du résultat | 1 session |
| 4. Export PDF | Intégration html2pdf.js | 1 session |
| 5. Profil artisan | Formulaire + localStorage pour MVP | 1 session |
| 6. Compte Supabase | Auth + sauvegarde historique | 2 sessions |
| 7. Tests + finitions | Mobile, edge cases, polish | 1 session |

**Total estimé : 8 à 10 sessions de travail**
**Deadline ESCP : 20 septembre 2026 — largement faisable**

---

## 9. Questions ouvertes

- Quel taux de TVA appliquer par défaut ? (10% rénovation ou laisser le choix ?)
- Faut-il inclure une signature électronique simple (case à cocher "lu et approuvé") dès le MVP ?
- Le numéro de devis est-il généré automatiquement ou saisi par l'artisan ?
- Quelle politique de prix après le MVP ? (Freemium, abonnement, paiement à l'usage ?)
