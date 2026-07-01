# Tonica

Tonica est un entraîneur de reconnaissance des degrés d'accords à l'oreille. C'est une application web React entièrement statique, sans backend.

## Développement

```bash
npm install       # installe les dépendances
npm run dev       # lance le serveur de développement
npm test          # exécute les tests (vitest)
npm run build     # build de production dans dist/
npm run preview   # prévisualise le build de production
```

## Déploiement (GitHub Pages)

Le déploiement est automatique : chaque push sur la branche `main` déclenche le workflow GitHub Actions (`.github/workflows/deploy.yml`) qui installe les dépendances, exécute les tests, build l'application et la déploie sur GitHub Pages.

Pour créer et pousser le dépôt la première fois :

```
git init && git add -A && git commit -m "Initial commit: Tonica"
gh auth login          # le token de session est invalide, reconnexion nécessaire
gh repo create tonica --public --source=. --push
```

Dans le repo GitHub → Settings → Pages → Source = « GitHub Actions » si ce n'est pas activé automatiquement. L'app sera dispo sur https://<utilisateur>.github.io/tonica/.

Les chemins d'assets sont relatifs (`base: './'` dans `vite.config.ts`), donc l'application fonctionne quel que soit le nom du dépôt.

## Remarque (iOS)

Sur iOS, le son (Web Audio) peut être coupé par l'interrupteur silencieux du téléphone. Pensez à le désactiver pour entendre les accords.
