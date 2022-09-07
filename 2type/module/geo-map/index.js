import template from "./tpl.js"
import echarts from "https://esm.2type.cn/echarts@5.2.1/dist/echarts.min.js"
export default {
    name: "ta-geo-map",
    template: template,
    props:{
        mapData: {
            type: Object,
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
        },
        rootStyle: {
            type: String,
            default: 'height:600px'
        },
        formatter: {
            type: Function,
            default: function(params, callback) {
                return (
                    params.name + "：" + (params.value || 0)
                );
            }
        }
    },
    data: function () {
        return {
            registeredMap: {},
        }
    },
    watch: {
        geo() {
            const vm = this
            console.log("ta-geo-map:watch geo change:render", JSON.parse(JSON.stringify(vm.geo)))
            vm.registerMap(vm.geo)
            vm.render()
        },
        mapData() {
            const vm = this
            console.log("ta-geo-map:watch dataMap change:render", JSON.parse(JSON.stringify(vm.mapData)))
            vm.render()
        },
        valueKey() {
            const vm = this
            console.log("ta-geo-map:watch valueKey change:render", vm.valueKey)
            vm.render()
        },
    },
    mounted: function(){
        const vm = this
        vm.registerMap(vm.geo)
        vm.$chart = echarts.init(vm.$refs.chartsCanvas);
        vm.render()
        vm.$chart.on("click", function(params) {
            vm.$emit("click", params.data)
        });
    },
    beforeDestroy: function(){
        const vm = this
        vm.$chart.dispose()
        console.log('vm.$chart.dispose()')
    },
    methods: {
        geoName(geo) {
            var name = "ta-geo-map-"
            var adcode = "random:" + String(Math.random())
            if (geo.features.length !== 0) {
                if (geo.features[0].adcode) {
                    adcode = geo.features[0].adcode
                } else if (geo.features[0].id) {
                    adcode = geo.features[0].id
                } else if (geo.features[0].properties && geo.features[0].properties.adcode) {
                    adcode = geo.features[0].properties.adcode
                } else if (geo.features[0].properties && geo.features[0].properties.id) {
                    adcode = geo.features[0].properties.id
                }
            }
            name += adcode
            return name
        },
        registerMap(geo) {
            const vm = this
            var name = vm.geoName(geo)
            if (vm.registeredMap[name]) {
                return
            }
            console.log(`echarts.registerMap`,name, geo)
            echarts.registerMap(name, geo)
            vm.registeredMap[name] = true
        },
        dataToSeries(data) {
            const vm = this
            var seriesData = []
            // { ename: "shanghai", name: "上海" },
            vm.geo.features.forEach(function (item) {
                seriesData.push({
                    name: item.properties.name,
                    id: item.id,
                })
            })
            var nameAdcodeHash = {}
            vm.geo.features.forEach(function (item) {
                nameAdcodeHash[item.properties.name] = item.id
            })
            seriesData = seriesData.map(function (item) {
                var adcode = nameAdcodeHash[item.name]
                if (adcode) {
                    item.id = adcode
                }
                var value = data[item.id]
                if (value) {
                    item.mapData = value
                    item.value = value[vm.valueKey]
                }
                return item
            })
            return seriesData
        },
        render() {
            const vm = this
            var seriesData = vm.dataToSeries(vm.mapData)
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
                    map: vm.geoName(vm.geo), //引入地图数据
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