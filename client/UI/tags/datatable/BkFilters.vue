<template>
  <div class="row p-3 bg-secondary filters">
    <div class="col-md-10 offset-md-1 filter-form">
      <form class="justify-content-md-center mt-1 form-inline">
        <div class="search-header">
          <input id="inline-form-input-city" type="text" placeholder="Select a Town" class="mb-1 mr-1 form-control">
          <select id="inline-form-custom-select-status" class="mb-1 mr-1 custom-select">
            <option value="all">Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
          <select id="inline-form-custom-select-buy" class="mb-1 mr-1 custom-select">
            <option value="all">Buy or Rent</option>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
          <select id="inline-form-custom-select-type" class="mb-1 mr-1 custom-select">
            <option value="All">Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Bungalow">Bungalow</option>
          </select>
          <input id="inline-form-input-minprice" type="text" placeholder="Price" class="mb-1 mr-1 resized form-control">
          <input id="inline-form-input-ref" type="text" placeholder="ImmoBe Ref" class="mb-1 mr-1 resized form-control">
        </div>
<!--        <b-button v-b-toggle.sidebar-variant class="mb-1 mr-1">More criteria +</b-button>-->
        <b-button class="btn-search mb-1" href="/search">Search</b-button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "BkFilters"
}
</script>

<style scoped>
  .filters{
    margin-bottom: 10px;
  }
</style>