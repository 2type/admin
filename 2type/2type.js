window.TA.m = {}
window.TA.default={hook:{}}
window.TA.enum = {}
window.TA.nav = {}
window.TA.hook = {}
window.TA.hook.req = {
    // 控制跳转到任意地址 {"jump":"https://github.com/2type/admin", "code":0, "message":""}
    // 控制跳转到 TA.m {"jump":"url_home()", "code":0, "message":""}
    // 控制跳转到 TA.m 带参数 {"jump":"url_demo_update()", "jumpArgs": [1], "code":0, "message":""}
    // 成功提示 {"successMessage": "创建成功","code":0, "message":""}
    passCallback: function (res) {
        res.data = res.data || {}
        if (res.data.jump) {
            if (res.data.jump == "refresh") {
                ELEMENT.Message({
                    type: 'info',
                    message: '即将刷新页面',
                })
                setTimeout(function () {
                    location.reload()
                }, 1000)
            }
            if (/^url_/.test(res.data.jump) && /\(\)$/.test(res.data.jump)) {
                const urlKey = res.data.jump.replace("()", "")
                console.log("跳转至 TA.m." + urlKey)
                const urlfn = TA.m[urlKey]
                if (typeof urlfn == "undefined") {
                    ELEMENT.Message({
                        type: 'error',
                        message: '跳转地址' + res.data.jump + "格式错误,未在 TA.m 中找到" + urlKey + "函数",
                    })
                    return
                }
                res.data.jump = urlfn.apply(TA.m, res.data.jumpArgs)
            }
            let page = res.data.jumpPageName || res.data.jump
            ELEMENT.Message({
                type: 'info',
                message: '即将跳转至: ' + page,
            })
            setTimeout(function () {
                TA.m._jump(res.data.jump)
            }, 1000)
        } else {
            ELEMENT.Message({
                type: 'success',
                message: res.data.successMessage || '操作成功',
            })
        }
    },
    // 错误消息弹窗 {"code":1, "message":"标题重复"}
    failCallback: function (res) {
        ELEMENT.Message({
            type: 'error',
            message: res.data.error.message,
        })
    },
}

window.TA.hook.editor = {}

/*
* 跳转页面
* @param {string} url
* */
TA.m._jump = function (url) {
    location.href = url
}
/*
* 打开新页面
* @param {string} url
* */
TA.m._open = function (url) {
    window.open(url)
}
/*
* 当前是否是演示环境
* @return {boolean}
* */
TA.m._isDemo = function() {
    return ['localhost', 'admin.2type.cn'].some(function (item){
        return item == location.hostname
    })
}
/*
* 返回页面 GET 参数
* @return {object}
* @example _query().id // 在 https://domain.com/path?id=abc 页面中返回 abc
* */
// /news?id=1&name=nimo 返回 {id:"1",name:"nimo"}
TA.m._query = function() {
    return TA.qs.parse(location.search)
}
/*
* 返回 formKind 对应的中文
* @return {string}
* */
TA.m._formKindLabel = function() {
    let map = {
        'create': "创建",
        'update': "编辑",
    }
    let vm = this
    let query = TA.qs.parse(location.search)
    let RenderData = __RENDER_DATA
    let key =  vm.formKind || query.formKind || RenderData.formKind
    return map[key] || '提交'
}

/*
* 读取页面搜索参数
* return {object}
* */
TA.m._readSearch = function() {
    if (!TA.qs.parse(location.search).json) {
        return {}
    }
    return JSON.parse(TA.qs.parse(location.search).json)
}

/*
    发起请求
    @param {config} axios 参数 - https://axios-http.com/zh/docs/api_intro
    @param {function} passCallback
    @param {function} failCallback
*/
TA.m._req = function (config, passCallback, failCallback, always) {
    let settings = config
    settings.responseType = settings.responseType || "json"
    settings.headers = settings.headers || {}
    settings.headers['X-Requested-With'] = 'XMLHttpRequest'
    let loading = {
        close(){}
    }
    if (config.$loading !== false){
        loading = ELEMENT.Loading.service({
            lock: true,
            text: settings.$LoadingText || 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }
    always = always || function () {

    }
    TA.axios(settings).then(function (res) {
        loading.close()
        if (!failCallback) {
            failCallback= TA.hook.req.failCallback
        }
        if (!passCallback) {
            passCallback= TA.hook.req.passCallback
        }
        TA.hook.req.handleError(res, passCallback, failCallback)
        always()
    }).catch(function (err) {
        loading.close()
        always()
        console.error(err)
        alert(err)
    })
}

/*
* 提交数据到当前页面
* @param {object} data - 数据
* @param {function} passCallback - 成功回调
* @param {function} failCallback - 失败回调
* */
TA.m._submit = function(data, passCallback, failCallback) {
    TA.m._submitURL(location.pathname, data, passCallback, failCallback)
}
/*
* 提交数据到 url
* @param {string} url - 请求地址
* @param {object} data - 数据
* @param {function} passCallback - 成功回调
* @param {function} failCallback - 失败回调
* */
TA.m._submitURL = function(url, data, passCallback, failCallback) {
    TA.m._req({
        method: "post",
        url: url,
        data:data,
    }, passCallback, failCallback)
}

/*
* 列表跳转专用(请求当前页)
* @param {object} data - 数据
* @param {number} page - 翻页,不传则为搜索第一页,传则为翻页
* */
TA.m._list = function (data, page,  perPage) {
    TA.m._listURL(location.pathname, data, page, perPage)
}
/*
* 列表跳转专用(指定 path)
* @param {string} path - 请求路径
* @param {object} data - 数据
* @param {number} page - 翻页,不传则为搜索第一页,传则为翻页
* */
TA.m._listURL = function(path, data, page, perPage) {
    if (page) {
        data['page'] = page
    } else {
        data['page'] = 1
    }
    if (perPage) {
        data['perPage'] = perPage
    }
    TA.m._jump(path + "?" + TA.qs.stringify({
        json: JSON.stringify(data)
    }))
}
/*
* 导出专用(当前页面)
* @param {object} data - 数据
* */
TA.m._export = function (data) {
    TA.m._exportURL(location.pathname, data)
}
/*
* 导出专用(指定 path)
* @param {string} path - 请求路径
* @param {object} data - 数据
* */
TA.m._exportURL = function (path, data) {
    var cloneData = JSON.parse(JSON.stringify(data))
    cloneData.export = true
    TA.m._open(path + "?" + TA.qs.stringify({
        json: JSON.stringify(cloneData)
    }))
}
/*
* 返回 TA.enum
* */
TA.m._enum = function () {
    return TA.enum
}
TA.enum= TA.enum || {}
/*
* 根据 source
* @param {string|object} source - 数据源为字符串时查询  TA.enum[source],为数组时则查询数组
* @param {string} key - 搜索 key
* @param {any} value  - 匹配 value
* */
TA.m._find = function (source, key, value) {
    let data = {}
    let out = {}
    if (typeof source == "string") {
        data= TA.enum[source]
        if (!data) {
            var msg = `_find(${source}, ${key}, ${value}) TA.m.${source} can not found`
            console.error(msg)
            alert(msg)

            return
        }
    } else {
        data = source
    }
    if (typeof value == "undefined") {
        value = key
        data.some(function (item) {
            Object.keys(item).some(function (itemKey) {
                var itemValue = item[itemKey]
                if (itemValue == value) {
                    out = item
                    return true
                }
            })
        })
    } else {
        data.some(function (item) {
            if (item[key] == value) {
                out = item
                return true
            }
        })
    }
    return out
}
TA.m._objectIDToDate = function(objectID) {
    if (!objectID) {
        return null
    }
    return new Date(parseInt(objectID.substring(0, 8), 16) * 1000);
}
TA.m._dateFormat = function(date, layout) {
    if (!layout) {
        layout = 'YYYY-MM-DD HH:mm:ss'
    }
    return TA.dayjs(date).format(layout)
}
TA.m._encodeJSONQuery=function(data) {
    let json = JSON.stringify(data)
    return encodeURIComponent(json)
}
import Upload from "./module/upload/index.js"
Vue.component(Upload.name, Upload)

import UploadList from "./module/uploadList/index.js"
Vue.component(UploadList.name, UploadList)

import Pc from "./module/pc/index.js"
Vue.component(Pc.name, Pc)

import Box from "./module/box/index.js"
Vue.component(Box.name, Box)

import Editor from "./module/editor/index.js"
Vue.component(Editor.name, Editor)

import LBSLIMIT from "./module/lbs-limit/index.js"
Vue.component(LBSLIMIT.name, LBSLIMIT)

import RESGION from "./module/region/index.js"
Vue.component(RESGION.name, RESGION)

import RESGION_NATIVE from "./module/cascader-native/index.js"
Vue.component(RESGION_NATIVE.name, RESGION_NATIVE)

import InputFen from "./module/input-fen/index.js"
Vue.component(InputFen.name, InputFen)

import LbsTextMatch from "./module/lbs-text-match/index.js"
Vue.component(LbsTextMatch.name, LbsTextMatch)

import Unread from "./module/unread/index.js"
Vue.component(Unread.name, Unread)

document.getElementById("ta-app").style.display="block"
