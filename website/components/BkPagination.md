# BkPagination

## Props

<!-- @vuese:BkPagination:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|datatable|Datatable object|`Object`|`true`|-|
|perPage|number of record per page|`Number`|`true`|-|
|scroll|When set to true, no page number but just a button below to load more data|`Boolean`|`false`|-|
|updateRoute|When set to true, will update the page number in the Route|`Boolean`|`false`|-|
|count|Total number of records even those not yet loaded|`Number`|`true`|-|

<!-- @vuese:BkPagination:props:end -->


## Methods

<!-- @vuese:BkPagination:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|seeMore|set a new page in case of scroll|-|
|paginate|set a new page in case of pagination|-|

<!-- @vuese:BkPagination:methods:end -->


