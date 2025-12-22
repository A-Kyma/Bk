# Checklist migration UI — composants BootstrapVue utilisés

Ce fichier liste les composants BootstrapVue repérés dans le code et propose une stratégie de remplacement.

## Composants détectés (exemples fréquents)
- b-button
- b-form-input, b-form-select, b-form-textarea, b-form-file
- b-form-group, b-form-invalid-feedback
- b-input-group, b-input-group-append, b-input-group-text
- b-table, b-table-simple
- b-collapse
- b-card, b-card-body, b-card-text, b-card-header
- b-modal
- b-icon, b-icon-<name>
- b-badge
- b-pagination
- b-overlay
- b-avatar, b-avatar-group
- b-progress, b-progress-bar
- b-alert
- b-dropdown, b-dropdown-item
- b-form-checkbox, b-form-radio, b-form-tags, b-form-rating

## Stratégie recommandée
1. **Prioriser** : identifier les composants critiques (tables, forms, modals, pagination) qui impactent beaucoup d’écrans.
2. **Tester BootstrapVueNext** : installer `bootstrap-vue-3` (ou `bootstrap-vue-next`) et voir quels composants sont pris en charge automatiquement.
3. **Remplacer / adapter** : pour les composants non pris en charge, soit :
   - utiliser le composant équivalent d’une nouvelle librairie (Quasar),
   - ré-implémenter l’UI avec classes Bootstrap + petits composants Vue custom.
4. **Valider visuellement** : écrire des tests d’intégration ou faire des audits manuels sur les vues migrées.

## Fichiers / pages prioritaires (exemples)
- Datatable (`client/UI/tags/datatable/*`) — beaucoup d’UI dépendante (table, pagination, filtres)
- Forms / Inputs (`client/UI/tags/inputs/*`, `BkInnerInput.vue`) — majorité des champs
- Files / Upload (`client/UI/tags/files/*`) — modals, upload, progress
- Charts (`client/UI/tags/charts/*`) — dépend de `vue-chartjs`

---

Je peux maintenant :
- relancer l'installation des paquets depuis l'environnement si tu veux que j'essaie encore, ou
- te transmettre la commande exacte à exécuter localement pour installer les dépendances et lancer `npx vite build --debug`.

Qu'est-ce que tu préfères ?