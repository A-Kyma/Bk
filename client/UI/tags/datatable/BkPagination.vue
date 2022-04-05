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

export default {
  name: "BkPagination",
  props: {
    datatable: Object,
    perPage: Number,
    scroll: Boolean,
    updateRoute: Boolean,
    count: Number
  },
  data(){
    return {
    }
  },
  computed: {
    total() {
      if (!isNaN(this.count)) return this.count
      return this.datatable.getCount()
    }
  },
  meteor: {
    viewScrollButton() {
      return (this.datatable.getCount() > this.datatable.getCountLocal())? true :  false
    },
  },
  methods: {
    seeMore(){
      let page = this.datatable.page
      this.datatable.setPage(page + 1)
    },
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