import template from "./tpl.js"
import Upload from "../upload/index.js"
export default {
    name: "ta-upload-list",
    component: {
        Upload,
    },
    template: template,
    props: ['value','action', 'disabled'],
    data:function () {
        return {

        }
    },
    methods: {
        newItem(data) {
            const vm = this
            vm.$emit("input", vm.value.concat(data))
        },
        removeItem(inputIndex){
            const vm = this
            vm.$emit("input", vm.value.filter(function (item, index){
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