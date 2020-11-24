<template>
    <b-breadcrumb>
        <b-breadcrumb-item href="/">
            <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
            <t>breadcrumb.home.title</t>
        </b-breadcrumb-item>
        <b-breadcrumb-item v-for="item in RouteArray" active>
            <t>breadcrumb.{{ item }}.title</t>
        </b-breadcrumb-item>
    </b-breadcrumb>
</template>
<script>
    import I18n from "../../../../lib/classes/i18n";

    export default {
        name: "BkBreadCrumb",
        computed: {
            RouteArray() {
                let routeStr = this.$route.fullPath.substring(1);
                if (routeStr !== ""){
                    let routeArr = routeStr.split("/");
                    if (routeArr.length > 0){
                        return routeArr;
                    }
                }
            }
        },
    }
</script>
<style scoped>

</style>