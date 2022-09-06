import template from "./tpl.js"
import geo from "./geo.js"
import echarts from "https://esm.2type.cn/echarts@5.2.1/dist/echarts.min.js"
export default {
    name: "ta-china-map",
    template: template,
    props:{
        data: {
            type: Object,
            default: function () {
                return {"110000":{"value":0},"120000":{"value":0},"130000":{"value":0},"140000":{"value":0},"150000":{"value":0},"210000":{"value":0},"220000":{"value":0},"230000":{"value":0},"310000":{"value":0},"320000":{"value":0},"330000":{"value":0},"340000":{"value":0},"350000":{"value":0},"360000":{"value":0},"370000":{"value":0},"410000":{"value":0},"420000":{"value":0},"430000":{"value":0},"440000":{"value":0},"450000":{"value":0},"460000":{"value":0},"500000":{"value":0},"510000":{"value":0},"520000":{"value":0},"530000":{"value":0},"540000":{"value":0},"610000":{"value":0},"620000":{"value":0},"630000":{"value":0},"640000":{"value":0},"650000":{"value":0},"710000":{"value":0},"810000":{"value":0},"820000":{"value":0},"999999":{"value":0}}
            }
        },
        // html 中用 value-key="xxx"
        valueKey: {
            type: String,
            default: function () {
                return "value"
            }
        },
        // https://unpkg.com/echarts@4.9.0/map/js/china.js
        geo: {
            type: Object,
            default: function () {
                return geo
            },
        },
        rootStyle: {
            type: String,
            default: 'height:600px'
        },
        formatter: {
            type: Function,
            default: function(params, callback) {
                var tip = ""
                if (params.data.ename) {
                    tip = "<br/> <span style='opacity: 0.7;font-size:12px;'>按鼠标左键进入市级地图</span>"
                }
                return (
                    params.name + "：" + (params.value || 0) + tip
                );
            }
        }
    },
    watch: {
        data() {
            const vm = this
            console.log("ta-china-map:watch data change:render", JSON.parse(JSON.stringify(vm.data)))
            vm.render()
        },
        valueKey() {
            const vm = this
            console.log("ta-china-map:watch data change:valueKey", JSON.parse(JSON.stringify(vm.data)))
            vm.render()
        },
    },
    mounted: function(){
        const vm = this
        echarts.registerMap('ta-china-map', vm.geo)
        vm.$chart = echarts.init(vm.$refs.chartsCanvas);
        vm.render()
        vm.$chart.on("click", function(params) {
            console.log(params.data)
        });
    },
    beforeDestroy: function(){
        const vm = this
        vm.$chart.dispose()
        console.log('vm.$chart.dispose()')
    },
    methods: {
        dataToSeries(data) {
            const vm = this
            var seriesData = [
                { name: "南海诸岛" },
                { ename: "beijing", name: "北京"},
                { ename: "tianjin", name: "天津" },
                { ename: "shanghai", name: "上海" },
                { ename: "chongqing", name: "重庆" },
                { ename: "hebei", name: "河北" },
                { ename: "henan", name: "河南"},
                { ename: "yunnan", name: "云南" },
                { ename: "liaoning", name: "辽宁" },
                { ename: "heilongjiang", name: "黑龙江" },
                { ename: "hunan", name: "湖南"},
                { ename: "anhui", name: "安徽" },
                { ename: "shandong", name: "山东" },
                { ename: "xinjiang", name: "新疆" },
                { ename: "jiangsu", name: "江苏" },
                { ename: "zhejiang", name: "浙江" },
                { ename: "jiangxi", name: "江西" },
                { ename: "hubei", name: "湖北" },
                { ename: "guangxi", name: "广西"},
                { ename: "gansu", name: "甘肃" },
                { ename: "shanxi", name: "山西" },
                { ename: "neimenggu", name: "内蒙古" },
                { ename: "shanxi1", name: "陕西" },
                { ename: "jilin", name: "吉林" },
                { ename: "fujian", name: "福建" },
                { ename: "guizhou", name: "贵州" },
                { ename: "guangdong", name: "广东" },
                { ename: "qinghai", name: "青海" },
                { ename: "xizang", name: "西藏" },
                { ename: "sichuan", name: "四川" },
                { ename: "ningxia", name: "宁夏" },
                { ename: "hainan", name: "海南" },
                { name: "台湾"},
                { ename: "xianggang", name: "香港" },
                { ename: "aomen", name: "澳门" },
            ]
            var nameAdcodeHash = {}
            vm.geo.features.forEach(function (item) {
                nameAdcodeHash[item.properties.name] = item.id
            })
            seriesData = seriesData.map(function (item) {
                var adcode = nameAdcodeHash[item.name]
                if (adcode) {
                    item.adcode = adcode
                }
                if (item.name === '南海诸岛') {
                    item.adcode = "999999"
                }
                var value = data[item.adcode]
                if (value) {
                    item = {
                        ...item,
                        ...value,
                    }
                    item.value = value[vm.valueKey]
                }
                return item
            })
            return seriesData
        },
        render() {
            const vm = this
            var seriesData = vm.dataToSeries((vm.data))
            var option = {
                title: {
                    text: ''
                },
                tooltip: {
                    //数据格式化
                    formatter: vm.formatter,
                },
                legend: {
                    borderWidth: 0,
                },
                xAxis: {
                    show:false,
                },
                yAxis: {
                    show:false,
                },
                series: [
                    {
                        type: "map",
                        geoIndex: 0,
                        data: seriesData,
                    },
                ],
                visualMap: function(){
                    var max = 0
                    seriesData.forEach(function (item) {
                        if (item.value > max) {
                            max = item.value
                        }
                    })
                    return {
                        min: 0, //最小值
                        max: max, //最大值
                        left: "right", //位于地图左边
                        top: "center",//位于地图下方
                        text: ["高", "低"], //取值范围的文字
                        inRange: {
                            color: ["#e0ffff", "#409EFF"], //取值范围的颜色
                        },
                        show: true, //图注
                    }
                }(),
                geo: {
                    map: "ta-china-map", //引入地图数据
                    roam: false, //不开启缩放和平移
                    zoom: 1, //视角缩放比例
                    label: {
                        normal: {
                            show: true,
                            fontSize: "10",
                            color: "rgba(0,0,0,0.7)",
                        },
                    },
                    itemStyle: {
                        normal: {
                            borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                        emphasis: { //高亮的显示设置
                            areaColor: "skyblue", //鼠标选择区域颜色
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            }
            vm.$chart.setOption(option, true);
        }
    }
}