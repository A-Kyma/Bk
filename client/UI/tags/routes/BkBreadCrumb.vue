<template>
    <b-breadcrumb>
        <b-breadcrumb-item to="/">
            <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
            <t>route.home.title</t>
        </b-breadcrumb-item>
        <b-breadcrumb-item v-for="item in RouteArray" active>
            <t>{{ item }}</t>
        </b-breadcrumb-item>
    </b-breadcrumb>
</template>
<script>

    export default {
        name: "BkBreadCrumb",
        computed: {
            RouteArray() {
                if (this.$route.matched.length > 0){
                    let routeStr = this.$route.matched[0].path.substring(1);
                    let param = this.$route.params
                    let title = this.$route.meta.title
                    if (routeStr !== ""){
                        let routeArr = routeStr.split("/");
                        if (routeArr.length > 0){
                            for (let i = 0; i < routeArr.length; i++) {
                                if (routeArr[i].indexOf(":") > -1){
                                    if(routeArr[i] === ":id"){
                                        if (title.indexOf(".") > -1){
                                            routeArr[i] = title
                                        }else{
                                            routeArr[i] = "route." + title + ".title"
                                        }

                                    }else{
                                        let paramValue = param[routeArr[i].replace(":","")]
                                        routeArr[i] = "route." + paramValue + ".title"
                                    }
                                }else{
                                    routeArr[i] = "route." + routeArr[i] + ".title"
                                }
                            }
                            return routeArr;
                        }
                    }
                }

            }
        },
    }
</script>
<style scoped>

</style>