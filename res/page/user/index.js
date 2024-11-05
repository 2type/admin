import template from "./tpl.js"
import {areaList} from "https://esm.run/@vant/area-data@v1.2.3"
export default {
    name: "page-user",
    template: template,
    props: [],
    data:function () {
        return {
            areaList: areaList,
            showAddressEdit: false,
            showAbout: false,
        }
    },
    methods: {
        // 不要漏掉 ...TA.m
        ...TA.m,
        clickLoginBtn() {
            const vm = this
            vm.$store.dispatch("fetchUser")
        },
        onSaveAddress() {
            const vm = this
            vm.showAddressEdit = false
        },
    },
}