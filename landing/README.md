# DevisIA — 2026-05

Site vitrine pour un outil de création de devis en ligne destiné aux artisans du bâtiment.

Projet fictif, conçu dans le cadre du projet fil rouge ESCP (agents IA pour artisans du bâtiment).

---

## Contexte produit

**Produit :** DevisIA
**Accroche :** "Votre devis en 3 minutes, envoyé en un clic."
**Cible :** Artisans TPE du bâtiment (plombiers, électriciens, maçons, peintres, menuisiers, carreleurs)
**Problème résolu :** Réduire le temps de création d'un devis de 45 min à 3 min grâce à l'IA

---

## Contenu du site (page unique)

| Section | Contenu |
|---------|---------|
| Hero | Accroche + mockup devis + badge "généré en 2 min 47s" |
| Problème | 3 cartes chiffres avec datavisualisations |
| Comment ça marche | Timeline 3 étapes avec mini-mockups |
| Aperçu interactif | Formulaire connecté à un devis PDF recalculé en temps réel (HT, TVA 20%, TTC) |
| Avantages | 4 blocs + bandeau témoignage 3 stats |
| CTA final | Comparatif "à la main / tableur / DevisIA" |
| Footer | Mentions légales, contact, tagline |

---

## Stack technique

- HTML5 + Tailwind CSS via CDN
- Google Fonts : Inter + JetBrains Mono
- Fichier unique autonome, aucune dépendance build

---

## Design

- Palette : ivoire/encre + accent orange chantier (`#e75a1f`)
- Style : sobre, professionnel, accessible (ton artisan, pas jargon tech)
- Le formulaire calcule HT/TVA/TTC dynamiquement en JS

---

## Statut

- [x] Design généré sur Claude Design (2026-05-24)
- [x] index.html intégré dans le workspace
- [x] Repo GitHub : https://github.com/iminparis75/dragon
- [x] Déployé sur Netlify : https://fancy-centaur-679db9.netlify.app/
