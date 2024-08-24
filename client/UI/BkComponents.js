import { defineAsyncComponent } from 'vue'

const BkComponents = {
  async install(app,options) {
    // import BkLabel from "./tags/forms/BkLabel.vue"
    //const BkLabel = defineAsyncComponent(() => import("./tags/forms/BkLabel.vue"))
    const BkLabel = await import("./tags/forms/BkLabel.vue")
    app.component("BkLabel", BkLabel)
  }
}

export default BkComponents;