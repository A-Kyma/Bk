# Migration UI — BootstrapVueNext vs Quasar

## Contexte
Le projet utilise actuellement BootstrapVue (Vue 2). Puisque tu veux migrer vers Vue 3, il faut choisir une librairie UI compatible. Deux options envisagées : **BootstrapVueNext / bootstrap-vue-3** (approche conservatrice) ou **Quasar** (migration plus profonde mais plus de fonctionnalités intégrées).

---

## Option A — BootstrapVueNext / bootstrap-vue-3
- **Pro**
  - Migration la moins disruptive : API proche de BootstrapVue (moins de réécriture des templates `<b-*>`).
  - Permet de conserver classes Bootstrap et styles.
  - Coût de migration réduit (corriger quelques breaking changes + remplacer certains composants non couverts).
- **Con**
  - Couverture des composants non complète par rapport à BootstrapVue (vérifier compatibilité pour composants utilisés : table, form components, collapse, etc.).
  - Dépend toujours de Bootstrap CSS (ok si c’est voulu).
- **Effort estimé**
  - Audit des composants `<b-*>` utilisés → 1-2 journées.
  - Remplacement / adapation des composants non couverts → 1-3 jours supplémentaires selon complexité.

---

## Option B — Quasar Framework
- **Pro**
  - Framework UI très complet, composants riches, support mobile, utilitaires, layout system, CLI d’app.
  - Excellente intégration avec Vue 3 et Vite, composants modernes, thèmes.
- **Con**
  - Migration plus coûteuse : conversion des templates (remplacer `<b-*>` par composants Quasar), réécriture de comportements JS, adaptation CSS.
  - Taille du bundle et paradigme différent (layout + router + store) → peut nécessiter refactor plus large.
- **Effort estimé**
  - Audit + définition de la nouvelle architecture UI → 1-2 jours.
  - Migration progressive par composants/pages (prioriser vues critiques) → 1-3 semaines selon surface du projet.

---

## Recommandation (préliminaire)
- Si tu veux minimiser le temps et la surface de changement, choisis **BootstrapVueNext / bootstrap-vue-3** et corrige au cas par cas les composants non pris en charge.
- Si tu préfères moderniser l’ensemble de l’UI, ajouter des fonctionnalités riches et être à l’aise sur le long terme avec un framework complet, prends **Quasar** (mais prévoir plus de temps).

---

## Plan de migration progressif recommandé (si BootstrapVueNext)
1. Installer `bootstrap` + `bootstrap-vue-3` dans le projet (ex: `meteor npm install --save bootstrap bootstrap-vue-3`) et tester le build.
2. Lister tous les composants BootstrapVue utilisés (scripts grep déjà fournis).
3. Tenter la migration des composants automatiques / simples (inputs, form controls).
4. Remplacer manuellement composants non couverts (table, pagination, collapse) et écrire tests visuels.
5. Valider l’expérience, corriger CSS, exécuter tests et build prod.


---

## Test app (dev)

I added a minimal demo entry in `imports/ui/` (`main.js` + `App.vue`) so you can run a Vite dev build against the package during development. Use `npx vite` (or `npm run dev`) in the package root to boot a dev server and validate the `BkPagination` / `BkModal` visual behavior.

If you prefer a small Meteor app that consumes the package, the recommended steps are:

1. `meteor create demo-app && cd demo-app`
2. `git clone https://github.com/A-Kyma/Bk packages/bk` (or copy the repo into the `packages/` folder)
3. `meteor npm install --save bootstrap bootstrap-vue-3 @tiptap/vue-3`
4. In `imports/ui/main.js` of the demo app, call:

```js
import { createApp } from 'vue'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { BkUI } from 'meteor/akyma:bk'

const app = createApp(App)
app.use(BootstrapVue3)
app.use(BkUI)
app.mount('#app')
```

5. Start Meteor: `meteor` and open the app to check the Bk components.

---

I'll run `npm install` and then `npx vite build --debug` to surface remaining build-time issues and iterate fixes.

> Tip: pour l'installation côté consommateur (Vue 3) :
>
> ```js
> import { createApp } from 'vue'
> import { BootstrapVue3 } from 'bootstrap-vue-3'
> import 'bootstrap/dist/css/bootstrap.css'
> import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
>
> const app = createApp(App)
> app.use(BootstrapVue3)
> app.use(BkUI)
> app.mount('#app')
> ```

## TipTap (éditeur rich text)

- Ce package utilisait `@tiptap/vue-2`. Pour Vue 3, installer `@tiptap/vue-3` dans le projet consommateur :

```
meteor npm install --save @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-list-item
```

- `BkTextEditor.vue` utilise désormais `@tiptap/vue-3` (Vue 3). Le composant émet `input` (compat Vue2) et `update:modelValue` (compat Vue3 `v-model`) pour faciliter la transition.

- Prochaine étape : tester l'éditeur dans une app de test et valider l'expérience avec `@tiptap/vue-3`.

## Plan de migration progressif recommandé (si Quasar)
1. Prototyper 1 page critique avec Quasar (layout, composants essentiels).
2. Décider d’une stratégie: refaire l’app complète vs cohabitation micro-frontend.
3. Migrer par modules/pages, conserver API de données (Meteor) intacte.
4. Réécrire composants complexes et écrire tests de régression visuelle.

---

Si tu veux, je peux maintenant :
- Lancer l’installation des dépendances et relancer `vite build` pour afficher les erreurs (option A étape 1). 
- Ou préparer un plan détaillé avec liste des composants à migrer (fichier checklist par composant) et estimation fine (option B). 

Dis-moi quelle action suivante tu préfères et je l’exécute. (Je peux faire les deux.)