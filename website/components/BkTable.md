# BkTable

## Props

<!-- @vuese:BkTable:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|fields|-|`Array`|`false`|-|
|exportFields|-|`String`|`false`|-|
|editableFields|-|`String` / `Array`|`false`|-|
|filterFields|-|`Array`|`false`|-|
|subscribeFields|-|`String`|`false`|-|
|modalFields|-|`String` / `Array`|`false`|-|
|modalExclude|-|`String` / `Array`|`false`|-|
|sort|-|`Object`|`false`|-|
|sortBy|-|`String`|`false`|-|
|sortDesc|-|`Boolean`|`false`|-|
|sortValue|-|`Object`|`false`|-|
|perPage|-|`Number`|`false`|-|
|page|-|`Number`|`false`|-|
|filter|-|`Object`|`false`|-|
|initialFilter|default filter used, cannot be changer afterwards|`Object`|`false`|-|
|autoFilterSubmit|initial applied filter, can be changed at any time using table filters|`Boolean`|`false`|-|
|scroll|-|`Boolean`|`false`|-|
|multi|-|`Boolean`|`false`|-|
|full|-|`Boolean`|`false`|-|
|array|-|`Array`|`false`|-|
|model|-|`String` / `Class`|`false`|-|
|draggable|-|`Boolean`|`false`|-|
|card|-|`Boolean`|`false`|-|
|cardWithLabel|-|`Boolean`|`false`|-|
|minTableWidth|-|`Number` / `String`|`false`|-|
|actions|-|`Array`|`false`||
|customActions|-|`String`|`false`|-|
|selector|-|`Object`|`false`|[object Object]|
|subscription|-|`String`|`false`|-|
|updateRoute|-|`Boolean`|`false`|-|
|importFileType|-|`String`|`false`|-|

<!-- @vuese:BkTable:props:end -->


## Events

<!-- @vuese:BkTable:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|remove|-|-|
|inputFilter|-|-|

<!-- @vuese:BkTable:events:end -->


## Slots

<!-- @vuese:BkTable:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|header|-|-|
|customHeader|-|-|
|filterHeader|-|-|
|pagination-top|-|-|
|main|-|-|
|row()|-|-|
|'cell('+cell.key+')'|-|-|
|cell()|-|-|
|afterRow|-|-|
|pagination-bottom|-|-|
|footer|-|-|

<!-- @vuese:BkTable:slots:end -->


