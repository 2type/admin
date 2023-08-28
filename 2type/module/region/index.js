import template from "./tpl.js"
import tree from "../lbs/tree.js"
const copy= TA.copy
export default {
    name: "ta-region",
    template: template,

    data: function() {
        return {

        }
    },
    props:{
        debug: Boolean,
        debugProps: {
            type: Object,
            default: function () {
                return {
                    label: function (node) {
                        return `${node.label}(${node.value})`
                    }
                }
            }
        },
        options: {
            type: Array,
            default: function () {
                return tree
            }
        },
        value: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    methods: {
        copyValue: function () {
            copy(JSON.stringify(this.value))
        },
        setValue: function () {
            let newValue = prompt("粘贴内容")
            if (newValue) {
                this.$emit("input", JSON.parse(value))
            }
        },
        changeValue: function (v) {
            this.$emit("input", v)
        }
    },
}