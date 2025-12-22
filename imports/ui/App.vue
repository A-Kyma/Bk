<template>
  <div>
    <h1>Bk Demo</h1>
    <bk-pagination :datatable="demoDatatable" :perPage="10" :count="50"/>
    <bk-modal id="demo-modal" title="Demo">
      <template #default>
        <p>Hello from modal</p>
      </template>
    </bk-modal>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      demoDatatable: {
        page: 1,
        getCount: () => 50,
        setPage(p) { this.page = p }
      }
    }
  }
}
</script>
