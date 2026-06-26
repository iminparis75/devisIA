# PROGRESS.md

> État technique du projet DevisIA, à jour à la fin de chaque session de code.
> Lu systématiquement par l'agent `devisIA-builder` en début de session.
> Mis à jour via la commande `/transmission` (drako) à la fin d'une session de code.

---

## Objectif du projet

Générateur de devis IA pour artisans du bâtiment (projet fil rouge ESCP, double objectif : livrable ESCP deadline 20 septembre 2026 + vitrine Product Builder). Détail complet dans `devisIA/PRD.md` et l'agent `devisIA-builder`.

## État actuel du code

- Sprint 1 (socle MVP) : terminé et déployé. Génération IA, aperçu, export PDF, profil artisan, historique des devis.
- Sprint 2 (édition inline + lots/vue client, F7) : terminé et déployé. Lignes éditables, recalcul temps réel, regroupement par lots avec toggle vue détaillée/vue client.
- Sprint 3 (duplication/versioning de devis) : pas démarré. Décision technique actée : migration Supabase non destructive sur la table `devis` (colonnes `parent_id`, `version INTEGER DEFAULT 1`).
- Sprints 4 à 8 (saisie vocale + ajout IA, polish mobile, rapport ESCP, déploiement final, soutenance) : pas détaillés en epics/user stories, seulement les titres et décisions techniques déjà actées (Web Speech API pour le vocal).

## Fichiers en cours de modification

`index.html`, `netlify/functions/generer-devis.js`, `.env.example` : ajout d'une protection anti-bot (Cloudflare Turnstile) sur le formulaire de génération, pas encore testé ni déployé.

## Ce qui a changé depuis le début

- Sprint 1 : refactorisation de `afficherDevis()` avec inputs éditables, protection XSS (`escapeAttr`), rendu PDF propre (classe `pdf-mode`).
- Sprint 2 : nouveau schéma JSON `lots[]` dans `generer-devis.js` (max_tokens porté à 2048), toggle global et par lot, export PDF qui respecte l'état d'affichage.
- Renumérotation des sprints pour démarrer à 1 (au lieu de 0), backlog construit en epics/user stories pour les Sprints 1 et 2.
- Protection Cloudflare Turnstile ajoutée sur le formulaire de génération (widget géré "Managed" dans `index.html`, vérification du token côté serveur dans `generer-devis.js` avant l'appel à Claude). Objectif : empêcher un bot de spammer l'endpoint payant. Site key en dur dans le HTML (publique par design), secret key configurée sur Netlify (`TURNSTILE_SECRET_KEY`, contexte production uniquement pour l'instant).

## Ce qui a été testé et n'a pas marché

- Clé API Anthropic en local : erreur 401 lors du test en local avec `netlify dev`. Cause identifiée : Avast bloque PowerShell + `.env` mal chargé. Pas résolu en local, contournement adopté : tester directement sur Netlify en production après déploiement.

## Ce qu'il comptait faire ensuite

- Tester le flux Turnstile une fois déployé (génération d'un devis en conditions réelles, vérifier que le widget ne bloque pas la démo ESCP).
- Démarrer le Sprint 3 (duplication/versioning de devis) : appliquer la migration Supabase (`parent_id`, `version`), puis construire le bouton de duplication et la logique de versioning sur l'app.
