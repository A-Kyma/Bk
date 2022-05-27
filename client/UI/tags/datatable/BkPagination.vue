<template>
      <div v-if="datatable.getCount()===0">
        <div class="text-center">
          <p><t>app.noData</t></p>
        </div>
      </div>
      <div v-else>
        <div v-if="scroll">
          <div v-if="viewScrollButton">
            <div class="text-center">
              <div v-if="datatable.handler.ready()" class="btn btn-primary">
                <a @click="seeMore()">
                  <t key="app.seeMore">app.seeMore</t>
                </a>
              </div>
              <slot v-else name="loading-bottom" v-bind="{datatable, scroll, perPage}">
                <bk-loading/>
              </slot>
            </div>
          </div>
        </div>
        <div v-else>
          <b-pagination
              :key="datatable.page"
              @input="paginate"
              v-model="datatable.page"
              :total-rows="total"
              :per-page="perPage"
          ></b-pagination>
        </div>
      </div>
</template>

<script>
import I18n from "../../../../lib/classes/i18n";
/**
 * This component allows to create a pagination in the datatable
 * used only in the datatable component
 * ex: <bk-pagination :datatable="datatable" :scroll="scroll" :perPage="perPage" :updateRoute="updateRoute" :count="count"/>
 */
export default {
  name: "BkPagination",
  props: {
    // Datatable object
    datatable: {
      type: Object,
      required: true
    },
    // number of record per page
    perPage: {
      type: Number,
      required: true
    },
    // When set to true, no page number but just a button below to load more data
    scroll: {
      type: Boolean
    },
    // When set to true, will update the page number in the Route
    updateRoute: {
      type: Boolean
    },
    // Total number of records even those not yet loaded
    count: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
    }
  },
  computed: {
    // @vuese
    // Compute the total count by calling the datatable getCount function
    total() {
      if (!isNaN(this.count)) return this.count
      return this.datatable.getCount()
    }
  },
  meteor: {
    // @vuese
    // check if the scroll button needs to be showed
    viewScrollButton() {
      return (this.datatable.getCount() > this.datatable.getCountLocal())? true :  false
    },
  },
  methods: {
    // @vuese
    // set a new page in case of scroll
    seeMore(){
      let page = this.datatable.page
      this.datatable.setPage(page + 1)
    },
    // @vuese
    // set a new page in case of pagination
    paginate(page) {
      this.datatable.setPage(page)
      if (this.$props.updateRoute){
        if (parseInt(this.$route?.query?.currentPage) !== page && page !== null){
          this.$router.replace({name: this.$route.name, query: {currentPage: page}})
        }
      }
    }
  }
}
</script>

<style scoped>

</style>