import template from "./tpl.js"
export default {
    name: "ta-heat-map",
    template: template,
    props:{
        mapData: {
            type: Array,
            required:true,
        },
        apiKey: {
            type:String,
        },
        center: {
          type: Object,
          required:true,
        },
        rootStyle: {
            type: String,
            default: 'height:600px'
        },
        mapOption: {
            type: Object,
            default: function () {
                return {
                    zoom: 13,//设置地图缩放级别
                    baseMap: {
                        type: "vector",
                        features: ["base", "building3d", 'building2d', 'point', 'label'],
                    },
                }
            }
        },
        heatOption: {
            type: Object,
            defualt: function () {
                return {
                    height: 0, // 峰值高度
                    gradientColor: { // 渐变颜色
                        0.6: "#673198",
                        0.8: "#e53390",
                        0.9: "#ffc95a",
                    },
                    radius: 30 // 最大辐射半径
                }
            }

        }
    },
    data: function () {
        return {
            registeredMap: {},
        }
    },
    watch: {
        mapData() {
            const vm = this
            console.log("ta-heat-map:watch mapData change:render")
            vm.render()
        },
        center() {
            const vm = this
            console.log("ta-heat-map:watch center change:render")
            vm.render()
        },
    },
    mounted: function(){
        const vm = this
        //初始化地图
        vm.render()
    },
    beforeDestroy: function(){
        const vm = this
        vm.$map.destroy()
        console.log('vm.$map.destroy()')
    },
    methods: {
        render() {
            const vm = this
            if (vm.$map) {
                vm.$map.destroy()
            }
            var mapOption =  JSON.parse(JSON.stringify(vm.mapOption))
            mapOption.center = vm.center
            vm.$map = new TMap.Map(vm.$refs.mapCanvans, mapOption);
            //初始化热力图并添加至map图层
            var heatOption =  JSON.parse(JSON.stringify(vm.mapOption))
            var counts = []
            vm.mapData.forEach(function (item) {
                counts.push(item[2])
            })
            if (heatOption.max) {
                heatOption.max = Math.max(...counts)
                heatOption.min = Math.min(...counts)
                if (heatOption.max == heatOption.min) {
                    heatOption.max++
                }
            }
            var heat = new TMap.visualization.Heat(heatOption).addTo(vm.$map);
            heat.setData(vm.mapData.map(function (item) {
                return {
                    "lng": item[0],
                    "lat": item[1],
                    "count": item[2],
                }
            }))
        }
    }
}