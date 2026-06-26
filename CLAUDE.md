# CLAUDE.md

Ce fichier fournit le contexte du projet DevisIA à Claude Code, chargé automatiquement dès qu'on travaille dans ce dossier.

## Avant de commencer

Lis systématiquement `PROGRESS.md` (à la racine de ce projet) en début de session : il contient l'état technique réel du projet (sprint en cours, fichiers en cours de modification, ce qui a été testé et n'a pas marché, prochaine étape). Ce fichier-ci (CLAUDE.md) décrit le projet de façon stable ; PROGRESS.md décrit où on en est concrètement, et change à chaque session de code.

À la fin d'une session de code significative, propose de mettre à jour `PROGRESS.md` en conséquence (ou invite Raphaël à lancer `/transmission` depuis Drako).

## Contexte du projet

**DevisIA** est un générateur de devis IA pour artisans du bâtiment, le projet fil rouge ESCP de Raphaël. L'artisan décrit son chantier en langage naturel, et l'IA génère un devis structuré et professionnel, prêt à télécharger en PDF.

**Double objectif :**
- Livrable ESCP (rapport + démo soutenance, deadline 20 septembre 2026)
- Vitrine Product Builder pour la recherche d'emploi et le freelance

## Stack technique

| Composant | Choix |
|-----------|-------|
| Frontend | HTML + Tailwind CSS |
| IA | Claude API (claude-haiku-4-5) via Netlify Function |
| Auth + BDD | Supabase (PostgreSQL, RLS) |
| PDF | html2pdf.js |
| Déploiement | Netlify (CD depuis GitHub) |

## Structure du projet

```
devisIA/
├── CLAUDE.md                       # Ce fichier
├── PROGRESS.md                     # État technique courant
├── PRD.md                          # Product Requirements Document
├── README.md                       # Stack, variables d'env, setup Supabase
├── landing/                        # Landing page vitrine
│   └── README.md
└── app/                            # MVP (Netlify Functions + HTML/JS)
    └── (fichiers de l'application)
```

## Périmètre MVP

**Dans le MVP :**
- Saisie texte libre du chantier
- Génération IA (JSON structuré : lignes, quantités, prix HT, TVA)
- Aperçu web du devis avec modification inline
- Export PDF (html2pdf.js)
- Profil artisan (mode essai sans compte + mode compte Supabase)
- Historique des devis (mode compte uniquement)

**Hors MVP :** envoi email, signature électronique, relances, intégration comptable, mobile native.

## Base de données Supabase

Deux tables avec RLS :
- `profils` : infos artisan (user_id, prenom, nom, siret, telephone, email_pro, logo_base64...)
- `devis` : historique (user_id, numero, titre, client_nom, lignes JSONB, total_ht, total_ttc...)

## Variables d'environnement

- `ANTHROPIC_API_KEY` → secret Netlify (jamais dans le code)
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` → dans le HTML (publiques par design, protégées par RLS)

## Critères de succès

- Génération d'un devis en moins de 3 minutes de A à Z
- Fonctionne sur mobile (responsive)
- Démo live possible devant jury sans bug bloquant
- PDF avec mise en page propre et professionnelle

## Comment aider sur ce projet

1. **Code** : du code propre, commenté uniquement quand c'est non-obvious, dans la stack définie. Ne propose pas de technologies hors stack sauf si c'est vraiment justifié.
2. **Architecture** : respecte les choix existants (pas de backend supplémentaire, pas de framework JS lourd).
3. **Produit** : quand Raphaël hésite sur une décision produit, donne une analyse avec pour/contre et une recommandation claire.
4. **Deadline** : garde en tête la deadline du 20 septembre 2026 et priorise en conséquence.
5. **Langue** : réponds en français.
6. **Avant de coder** : si une demande est ambiguë, dis-le et présente les interprétations possibles plutôt que de choisir seul en silence. Tu peux proposer des fonctionnalités utiles non demandées, mais explique-les au lieu de les ajouter sans le signaler.
7. **Simplicité d'abord (tâches ciblées)** : sur un bugfix ou un ajout précis, du code minimal qui répond au problème posé, sans gestion d'erreur pour des cas qui ne peuvent pas arriver ni abstraction non demandée. Sur une tâche ouverte (construire une fonctionnalité ou un module entier), la proactivité reste bienvenue, à condition de l'expliquer.
8. **Modifications chirurgicales** : en éditant du code existant, ne refactorise pas des parties non concernées par la demande et ne supprime que le code mort rendu inutile par ton propre changement.
9. **Objectif vérifiable** : transforme une demande vague en objectif testable avec un critère de succès clair, et prévois un point de vérification sur les tâches à plusieurs étapes.
