# Utilisation du package `akyma:bk`

Ce document décrit comment utiliser ce repository comme un package Meteor dans un autre projet (localement) et comment le publier si besoin.

## 1) Utilisation locale (développement)

Option A — Copier dans `packages/` du projet :

1. Dans le projet cible : `git clone https://github.com/A-Kyma/Bk packages/bk` (ou `git submodule add ... packages/bk`).
2. Dans le projet cible : `meteor` (ou `meteor npm install` si besoin pour dépendances du projet).
3. Dans le code du projet cible, importer les exports ESM fournis par le package :

```js
import { Bk, BkComponents } from 'meteor/akyma:bk';
// ou importer un symbol spécifique
import { Datatable } from 'meteor/akyma:bk';
```

Meteor détecte automatiquement les packages présents dans le dossier `packages/`.

Option B — Lier en sous-module Git :

- `git submodule add https://github.com/A-Kyma/Bk packages/bk`
- Puis `git submodule update --init --recursive`.

## 2) Publier sur Atmosphere

1. S'assurer que `package.js` contient les champs `name`, `version`, `summary` et `git` correctement renseignés.
2. Bump la version dans `package.js` (ex. `version: '3.0.1'`).
3. Se connecter à Meteor : `meteor login`.
4. Publier : `meteor publish`.

Après publication, un projet peut faire : `meteor add akyma:bk` et importer les symboles via `import { ... } from 'meteor/akyma:bk';`.

## 3) Remarques importantes

- `package.json` n'est **pas nécessaire** pour que le package soit utilisable par un autre projet Meteor ; il peut néanmoins être conservé pour des scripts de développement (Vite, tests, etc.).
- Pour la compatibilité avec Meteor 3.x, le package expose des modules ESM via `api.mainModule(...)` et les fichiers d'entrée exportent explicitement (`export { ... }`).
- Si vous souhaitez exposer des variables globales legacy, utilisez `api.export('MyGlobal')` dans `package.js` en plus des exports ESM.

## 4) Exemple d'utilisation

```js
// Dans le projet qui consomme le package
import { Bk, Datatable } from 'meteor/akyma:bk';
// Utilisation
console.log(Bk.version);
```

---

Pour que je fasse :
- Je peux ajouter un petit test d'import (fichier `test/import-example.js`) pour vérifier l'import ESM si tu veux.
- Je peux aussi inclure un court paragraphe dans `README.md` si tu préfères centraliser la doc.
