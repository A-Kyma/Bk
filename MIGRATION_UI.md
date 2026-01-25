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


Tableau de migration BoostrapVue vers Quasar
# Tableau de Migration — BootstrapVue → Quasar

## Composants de Base

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BButton` | `QBtn` | `variant` → `color`, `size`, `disabled`, `loading` | Remplacer `<b-button>` par `<q-btn>` |
| `BIcon` | `QIcon` | `icon`, `size`, `color` | Utiliser Material Icons ou Font Awesome |
| `BBadge` | `QBadge` | `variant` → `color`, `floating`, `rounded` | Peut être utilisé avec `QBtn` ou `QChip` |
| `BSpinner` | `QSpinner` | `type` → `type`, `size`, `color` | Support des animations natives |

---

## Navigation & Layout

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BNavbar` | `QHeader` ou `QToolbar` | `sticky-top` → `sticky`, `dark` → `dark` | `QHeader` pour layout app-level |
| `BNavbarNav` | `QTabs` ou `div` flex | — | Dépend du layout (horizontal vs vertical) |
| `BNavItem` | `QBtn` ou `QItem` | `active`, `to`, `href` | Utiliser `QBtn` pour menu ou `QItem` pour liste |
| `BNavItemDropdown` | `QBtn` + `QMenu` | `right` → `anchor="top right"` | Combiner QBtn + QMenu pour dropdown |
| `BDropdown` | `QMenu` | `right`, `split`, `toggle` | Menu déroulant natif |
| `BDropdownItem` | `QItem` | `active`, `clickable`, `href` | Item dans QMenu ou QList |
| `BDropdownDivider` | `QSeparator` | — | Divider dans QMenu |
| `BBreadcrumb` | `QBreadcrumbs` | `items` (array) | Format : `[{label, icon, to}]` |
| `BBreadcrumbItem` | `QBreadcrumbsEl` | `active`, `to`, `href` | Enfant de QBreadcrumbs |

---

## Grille & Espacement

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BRow` | `div class="row"` ou flex | — | Quasar utilise flexbox par défaut |
| `BCol` | `div class="col-*"` ou `class="q-col-*"` | `cols`, `md`, `lg`, `xl`, `sm` | Classes `q-col-12`, `q-col-md-6`, etc. |
| `BContainer` | `div class="q-px-md"` | — | Utiliser padding/margin utilities |

---

## Formulaires

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BForm` | `<form>` natif | — | Quasar n'a pas de wrapper spécifique |
| `BFormInput` | `QInput` | `type`, `placeholder`, `dense`, `outlined` | Support `v-model`, validation |
| `BFormTextarea` | `QInput` type="textarea" | `type="textarea"`, `rows`, `autogrow` | Autogrow disponible |
| `BFormSelect` | `QSelect` | `options`, `multiple`, `clearable`, `searchable` | Format : `[{label, value}]` |
| `BFormCheckbox` | `QCheckbox` | `checked`, `label`, `disable` | Validation intégrée |
| `BFormRadio` | `QRadio` | `val`, `label`, `disable` | Utiliser avec `QOptionGroup` pour groupes |
| `BFormGroup` | `div` ou `<fieldset>` | `label` → label manuel | Pas d'équivalent exact |
| `BFormInvalidFeedback` | `QLinearProgress` + validation | — | Afficher erreurs avec `error` + `error-message` |
| `BInputGroup` | `div` flex ou `QInput` avec slots | `prepend`, `append` | Utiliser slots `before`, `after` |
| `BInputGroupText` | `div` ou `QIcon` | — | Mettre en slot QInput |

---

## Contenu & Cartes

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BCard` | `QCard` | `flat`, `bordered`, `shadow` | Conteneur principal |
| `BCardBody` | `QCardSection` | — | Section corps de la carte |
| `BCardHeader` | `QCardSection` + classe | — | Utiliser QCardSection avec classe custom |
| `BCardFooter` | `QCardSection` | — | Section footer |
| `BCardImg` | `<img>` dans QCard | — | Image native |
| `BAlert` | `QBanner` | `variant` → `color`, `dismissible` | Banneau d'alerte/info |
| `BAlertHeading` | `<strong>` | — | Titre simple |

---

## Tableau & Données

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BTable` | `QTable` | `items`, `columns`, `dense`, `flat`, `bordered` | Composant très puissant |
| `BTableSimple` | `<table>` natif | — | Pas d'équivalent, utiliser HTML brut |
| `BTbody` | `<tbody>` natif | — | HTML natif |
| `BThead` | `<thead>` natif | — | HTML natif |
| `BTr` | `<tr>` natif | — | HTML natif |
| `BTd` | `<td>` natif | — | HTML natif |
| `BTh` | `<th>` natif | — | HTML natif |
| `BPagination` | Pagination intégrée QTable ou `QPagination` | `v-model`, `max-pages`, `direction-links` | Pagination native |

---

## Dialogs & Modals

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BModal` | `QDialog` | `v-model`, `size` → `dark`, `fullscreen` | Utiliser composable `useDialogPluginComponent` |
| `BModalTitle` | `<div>` dans header | — | Structure custom |
| `BModalBody` | `<div>` dans dialog | — | Structure custom |
| `BModalHeader` | Header implicit | — | Partie du dialog |
| `BModalFooter` | Footer implicit | — | Partie du dialog |

---

## Collapse & Accordéon

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BCollapse` | `QExpansionItem` | `v-model`, `visible`, `icon` | Accordéon/collapse natif |
| `BButton` (toggle collapse) | Intégré à QExpansionItem | — | Pas d'action externe nécessaire |

---

## Tabs

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BTabs` | `QTabs` | `v-model`, `active-bg-color`, `active-text-color` | Onglets modernes |
| `BTab` | `QTab` | `name`, `label`, `icon`, `disable` | Tab individuelle |
| `BTabPane` | `QTabPanels` + `QTabPanel` | `name` | Contenu des onglets |

---

## Listes

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BListGroup` | `QList` | `bordered`, `separator`, `dense` | Conteneur de liste |
| `BListGroupItem` | `QItem` | `active`, `clickable`, `href`, `to` | Élément de liste |

---

## Notifs & Toasts

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BToast` | `useQuasar().notify()` ou composant custom | `position`, `type`, `timeout` | API composable recommandée |
| `BToastContainer` | — | — | Non nécessaire avec Quasar |
| `BTooltip` | `QTooltip` | `content`, `position`, `delay` | Tooltip natif |

---

## Popover & Menus

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BPopover` | `QMenu` | `content`, `trigger`, `placement` → `anchor`, `self` | Menu contextuel |
| `BVModalDirective` | — | — | Utiliser composables |

---

## Utilitaires & Spacing

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| Classes `m-*`, `p-*` | Classes `q-m-*`, `q-p-*` | `m-1` → `q-m-xs` | Mêmes valeurs (xs, sm, md, lg, xl) |
| Classes `text-*` | Classes `text-*` | `text-center`, `text-primary` | Quasar conserve aussi les classes Bootstrap |
| Classes `d-*` | Classes `q-d-*` ou `display` | `d-none` → `hidden` | Utilities Quasar natives |
| Classes `flex` | Classes `q-display-flex` ou flex utilities | — | Flexbox intégré |

---

## Autres Composants

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `BCarousel` | — | — | Utiliser `quasar-carousel` (lib externe) |
| `BProgressBar` | `QLinearProgress` ou `QCircularProgress` | `value`, `color`, `size` | Barre de progression |
| `BJumbotron` | `<div class="q-pa-lg">` | — | Conteneur avec padding |
| `BPageItem` | — | — | Utiliser `QPagination` |
| `BMedia` | — | — | Utiliser flexbox custom |

---

## Directives

| Bootstrap Vue | Quasar | Propriétés équivalentes | Notes |
|---|---|---|---|
| `v-b-modal` | Dialog via composable | — | Utiliser `useDialogPluginComponent` |
| `v-b-tooltip` | `v-ripple` ou `QTooltip` | — | Tooltip avec slot ou directive |
| `v-b-popover` | `QMenu` | — | Menu au lieu de popover |

---

## Migration Checklist pour BkLanguage.vue.js

- [ ] `BNavItemDropdown` → `QBtn` + `QMenu`
- [ ] `BDropdownItem` → `QItem`
- [ ] `BIcon` → `QIcon`
- [ ] `BRow` → `div class="row"` ou flex
- [ ] `BCol` → `div class="col-*"`
- [ ] `BLink` → `QBtn flat` ou `<a>`
- [ ] `BNavbarNav` → `QTabs` ou `QToolbar`
- [ ] Adapter slots et événements (@click, etc.)
- [ ] Tester en responsive mobile
- [ ] Valider icônes et colors