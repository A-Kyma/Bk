<template>
      <div v-if="datatable.getCount()===0">
        <div class="text-center">
          <p>no data to display</p>
        </div>
      </div>
      <div v-else>
        <div v-if="scrollable()">
          <div v-if="viewScrollButton()">
            <div class="text-center">
              <div class="btn btn-primary">
                <a @click="seeMore()">See More</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <b-pagination @input="(page) => paginate(page)"
                        :v-model="datatable.page"
                        :total-rows="datatable.getCount()"
                        :per-page="perPage"
          ></b-pagination>
        </div>
      </div>
</template>

<script>
import I18n from "../../../../lib/classes/i18n";

export default {
  name: "BkPagination",
  props: {
    datatable: Object,
    perPage: Number,
    scroll: Number,
  },
  data(){
    return {
    }
  },
  methods: {
    scrollable(){
      return this.$props.scroll
    },
    viewScrollButton(){
      return (this.datatable.getCount() !== this.datatable.getCountLocal())? true :  false;
    },
    seeMore(){
      let page = this.datatable.page
      this.datatable.setPage(page + 1)
    },
    paginate(page){
      this.datatable.setPage(page)
    }
  }
}
</script>

<style scoped>

</style>