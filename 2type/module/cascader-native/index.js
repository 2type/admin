import template from "./tpl.js"
import tree from "../lbs/tree.js"
const copy= TA.copy
export default {
    name: "ta-cascader-native",
    template: template,
    data: function() {
        return {
            childOption: []
        }
    },
    props:{
        option: {
            type: Array,
            default: function () {
                return tree;
            }
        },
        label: {
            type: Array,
            default: function () {
                return ["省","市", "区/县"]
            },
        },
        value: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    created: function() {
        var newValue = this.value
        // 修复数据,必须有一个选中项
        if (newValue == 0) {
            newValue = [""]
        }
        this.$emit("input", newValue)
        this.calcOption(newValue)
    },
    beforeUpdate() {
        this.calcOption(this.value)
    },
    computed: {

    },
    methods: {
        calcOption(value) {
            var vm = this
            var childOption = []
            if (value.length <1) {
                vm.childOption = [vm.option]
                return
            }
            value.forEach(function (item, i) {
                if (i==0) {
                    childOption.push(vm.option)
                    return
                }
                var out = []
                var nextOpt = childOption[i-1]
                if (nextOpt) {
                    nextOpt.some(function (sub) {
                        if (sub.value == value[i-1]) {
                            out = sub.children
                            return true
                        }
                    })
                }
                childOption.push(out)

            })
            vm.childOption= childOption
        },
        changeItem(e, index) {
            var v = e.target.value
            // clone
            var newV = JSON.parse(JSON.stringify(this.value))
            // 清除子级
            newV = newV.splice(0, index+1)
            // 设置当前
            newV[index] = v
            // 加入新的空子级
            newV.push("")
            // 计算选项
            this.calcOption(newV)
            // 向上传递
            this.$emit("input", newV)
        }
    },
}
