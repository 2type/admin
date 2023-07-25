import template from "./tpl.js"
import tree from "../lbs/tree.js"
import copy from "https://esm.2type.cn/copy-to-clipboard@3.3.1"
export default {
    name: "ta-lbs-limit",
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
            type: Object,
            default: function () {
                return {
                    type: "unlimited",
                    inverse: [],
                    selected: [],
                }
            }
        }
    },
    created: function() {
        const vm = this
        // 让调用方只需要配置 value={}
        if (vm.value.type === "unlimited") {
            vm.$emit('input', vm.value)
        }
    },
    methods: {
        changeType: function(v) {
            const vm = this
            let value = vm.value
            value.type = v
            switch (value.type) {
                case "unlimited":
                    value.selected = []
                    value.inverse = []
                case "selected":
                    value.inverse = []
                case "inverse":
                    value.selected = []
                case "selectedAndInverse":
                    // 啥也不干
            }
            vm.$emit('input', value)
        },
        changeSelected: function(v) {
            const vm = this
            let value = vm.value
            value.selected = v
            vm.$emit('input', value)
        },
        changeInverse: function(v) {
            const vm = this
            let value = vm.value
            value.inverse = v
            vm.$emit('input', value)
        },
        copyInverse: function () {
            copy(JSON.stringify(this.value.inverse))
        },
        setInverse: function () {
            let newValue = prompt("粘贴内容")
            if (newValue) {
                this.changeInverse(JSON.parse(newValue))
            }
        },
        copySelected: function () {
            copy(JSON.stringify(this.value.selected))
        },
        setSelected: function () {
            let newValue = prompt("粘贴内容")
            if (newValue) {
                this.changeSelected(JSON.parse(newValue))
            }
        }
    },
}
