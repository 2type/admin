import template from "./tpl.js"
import area from "../lbs/area.js";
import tree from "../lbs/tree.js"
export default {
    name: "ta-lbs-text-match",
    template: template,
    props: {
        title: {type:String, default:"文本匹配"},
        value: {type:Array, default:()=>{return []}},
    },
    data:function() {
        return {
            dialogVisible: false,
            step:1,
            originData: "",
            // @todo 向上提交时, 过滤重复数据
            list:[
                {
                    origin:"",
                    originIndex:"",
                    originList:["","",""], // [省, 市, 区]

                    province:{ fullName:"", adcode: "", find:false },
                    city:{ fullName:"", adcode: "", find:false },
                    district:{ fullName:"", adcode: "", find:false },
                    adcode:"",
                    pass:false,
                    // tip:false, // 例: 存在重复数据, 模糊匹配到的数据; 这类界面提示, 仍算成功
                    msg:"", // 详细的提示内容, 或错误原因
                }
            ]
        }
    },
    computed:{
        getTotal(){
            const vm = this
            let total = vm.list.length
            let pass = 0
            vm.list.forEach((item)=>{
                if(item.pass) {
                    pass++
                }
            })
            return {
                total,
                pass,
                fail:total-pass,
            }
        }
    },
    methods:{
        showDialog:function() {
            const vm = this
            vm.dialogVisible = true
        },
        closeDialog:function() {
            const vm = this
            vm.dialogVisible = false
            vm.step = 1
            vm.originData = ""
        },
        analysisOriginData:function() {
            const vm = this
            const list = vm.originData.split("\n")
            let result = []
            list.forEach((item,index)=>{
                const origin = item.trim()
                if(origin) {
                    // @todo 根据/或tab分割
                    const originList = origin.split("\t")
                    const analysisResult = vm.analysisOriginList(originList)
                    result.push({
                        origin:origin,
                        originIndex:index+1,
                        originList:originList,
                        ...analysisResult,
                    })
                }
            })
            // 排序, pass=false的排在最前面, pass=true时有msg内容的排在前面
            result = result.sort((a,b)=>{
                if(a.pass == b.pass) {
                    if(a.msg && b.msg) {
                        return 0
                    }else if(a.msg) {
                        return -1
                    }else if(b.msg) {
                        return 1
                    }else {
                        return 0
                    }
                }else if(a.pass) {
                    return 1
                }else {
                    return -1
                }
            })
            vm.list = result
            vm.step = 2
        },
        analysisOriginList:function(originList) {
            const vm = this
            let output = {
                adcode:"",
                province:{ fullName:"", adcode: "", find:false },
                city:{ fullName:"", adcode: "", find:false },
                district:{ fullName:"", adcode: "", find:false },
                pass:false,
                msg:"",
            }
            /*  源数据情况
                    1 省/市/区
                    2 省/市
                    3 省/
                    4   /市/
                    5   /市/区
                    6   /  /区

                结果情况1: 给到的数据找到
                结果情况2: 给到的数据找到部分
                结果情况3: 给到的数据未找到
            * */

            // 1. 查找省市区数据源
            const province = originList[0] || ""
            const city = originList[1] || ""
            const district = originList[2] || ""
            // 分析情况 1 2 3
            if(province){
                // 从tree数据中找到省
                tree.some((pItem)=>{
                    if(pItem.label == province || pItem.label.indexOf(province) > -1) {
                        output.province.fullName = pItem.label
                        output.province.adcode = pItem.value
                        output.adcode = pItem.value
                        output.province.find = true
                        pItem.children = pItem.children || []
                        if (city) {
                            if(pItem.children.length > 0){
                                // 从tree2级数据中找到市
                                pItem.children.some((cItem)=>{
                                    if(cItem.label == city || cItem.label.indexOf(city) > -1) {
                                        output.city.fullName = cItem.label
                                        output.city.adcode = cItem.value
                                        output.adcode = cItem.value
                                        output.city.find = true
                                        cItem.children = cItem.children || []
                                        if (district) {
                                            if(cItem.children.length > 0){
                                                // 从tree3级数据中找到区
                                                cItem.children.some((dItem)=>{
                                                    if(dItem.label == district || dItem.label.indexOf(district) > -1) {
                                                        output.district.fullName = dItem.label
                                                        output.district.adcode = dItem.value
                                                        output.adcode = dItem.value
                                                        output.district.find = true
                                                        output.pass = true
                                                        return true
                                                    }
                                                })
                                                if(output.city.find == false){
                                                    output.pass = false
                                                    output.msg = "未匹配到区数据"
                                                }
                                            }else {
                                                output.pass = false
                                                output.msg = "市下无区数据"
                                                return true
                                            }
                                        }else {
                                            output.pass = true
                                        }
                                        return true
                                    }
                                })
                                if(output.city.find == false){
                                    output.pass = false
                                    output.msg = "未匹配到市数据"
                                }
                            }else {
                                output.pass = false
                                output.msg = "省份下无城市数据"
                                return true
                            }
                        }else{
                            output.pass = true
                        }
                        return true
                    }
                })
                if(output.province.find == false){
                    output.pass = false
                    output.msg = "未匹配到省数据"
                }
            }
            // @todo 4 5 6
            return output
        },
        // 将list中pass=true的数据中adcode, 添加到value中
        addToValue:function() {
            const vm = this
            let value = JSON.parse(JSON.stringify(vm.value))
            vm.list.forEach((item)=>{
                if(item.pass && value.indexOf(item.adcode) == -1) {
                    value.push(item.adcode)
                }
            })
            vm.$emit("input", value)
            vm.closeDialog()
        },
        // 将list中pass=true的数据中adcode, 从value中去除
        deletefromValue:function() {
            const vm = this
            let value = JSON.parse(JSON.stringify(vm.value))
            vm.list.forEach((item)=>{
                if(item.pass && value.indexOf(item.adcode) > -1) {
                    value.splice(value.indexOf(item.adcode), 1)
                }
            })
            vm.$emit("input", value)
            vm.closeDialog()
        },
    },
}