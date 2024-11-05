import template from "./tpl.js"
import Upload from "../upload/index.js"
export default {
    name: "ta-upload-list",
    component: {
        Upload,
    },
    template: template,
    props: ['value','action', 'disabled', 'only-id'],
    data:function () {
        return {

        }
    },
    computed:{
        pv() {
            if (this.onlyId) {
                return ""
            } else {
                return {}
            }
        }
    },
    methods: {
        newItem(data) {
            const vm = this
            var v = vm.value
            v = v || []
            vm.$emit("input", v.concat(data))
        },
        removeItem(inputIndex){
            const vm = this
            vm.$emit("input", vm.value.filter(function (item, index){
                console.log(item, index, inputIndex)
                return inputIndex !== index
            }))
        },
        inputItem(inputIndex, value) {
            const vm = this
            vm.$emit("input", vm.value.map(function (item, index){
                if (inputIndex === index) {
                    return value
                }
                return item
            }))
        }
    },
}