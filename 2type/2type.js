import qs from "https://esm.nimo.run/query-string@7.0.0"
import axios from "https://esm.nimo.run/axios@0.21.1"
import dayjs from "https://esm.nimo.run/dayjs@1.8.21"
window.TA = {
    m: {},
    default: {
        hook: {

        }
    },
    DATA: {
        commandKeyDown: false
    }
}
// https://dayjs.gitee.io/docs/zh-CN/manipulate/manipulate
TA.dayjs = dayjs
// https://www.npmjs.com/package/query-string/v/7.0.0
TA.qs = qs
//  https://axios-http.com/zh/docs/api_intro
TA.axios = axios

document.onkeydown = function(event) {
    if (event.key === 91) {
        TA.DATA.commandKeyDown = true
    }
}
document.onkeyup = function(event) {
    if (event.key === 91) {
        TA.DATA.commandKeyDown = false
    }
}

/*
* 跳转页面
* @param {string} url
* */
TA.m._jump = function (url) {
    if (TA.DATA.commandKeyDown) {
        window.open(url)
    } else {
        location.href = url
    }
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
    return qs.parse(location.search)
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
    let query = qs.parse(location.search)
    let RenderData = __RENDER_DATA
    let key =  vm.formKind || query.formKind || RenderData.formKind
    return map[key] || '提交'
}

/*
* 读取页面搜索参数
* return {object}
* */
TA.m._readSearch = function() {
    if (!qs.parse(location.search).json) {
        return {}
    }
    return JSON.parse(qs.parse(location.search).json)
}

/*
    发起请求
    @param {config} axios 参数 - https://axios-http.com/zh/docs/api_intro
    @param {function} passCallback
    @param {function} failCallback
*/
TA.m._req = function (config, passCallback, failCallback) {
    let settings = config
    settings.responseType = settings.responseType || "json"
    const loading = ELEMENT.Loading.service({
        lock: true,
        text: settings.$LoadingText || 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    axios(settings).then(function (res) {
        loading.close()
        if (!failCallback) {
            failCallback = TA.hook.req.failCallback
        }
        if (!passCallback) {
            passCallback = TA.hook.req.passCallback
        }
        TA.hook._req.handleError(res, passCallback, failCallback)
    }).catch(function (err) {
        loading.close()
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
TA.m._list = function (data, page) {
    TA.m._listURL(location.pathname, data, page)
}
/*
* 列表跳转专用(指定 path)
* @param {string} path - 请求路径
* @param {object} data - 数据
* @param {number} page - 翻页,不传则为搜索第一页,传则为翻页
* */
TA.m._listURL = function(path, data, page) {
    if (page) {
        data['page'] = page
    } else {
        data['page'] = 1
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
    data.export = true
    TA.m._open(path + "?" + TA.qs.stringify({
        json: JSON.stringify(data)
    }))
}
/*
* 返回 TA.enum
* */
TA.m._enum = function () {
    return TA.enum
}
/*
* 根据 source
* @param {string|object} source - 数据源为字符串时查询  TA.enum[source],为数组时则查询数组
* @param {string} key - 搜索 key
* @param {any} value  - 匹配 value
* */
TA.m._find = function (source, key, value) {
    let data = {}
    if (typeof source == "string") {
        if (!data) {
            console.log(`_find(${source}, ${key}, ${value}) TA.m.${source} can not found`)
            return
        }
        data = TA.enum[source]
    } else {
        data = source
    }
    key = key || "key"
    let out = ""
    data.some(function (item) {
        if (item[key] == value) {
            out = item
            return true
        }
    })
    return out
}
import Upload from "./module/upload/index.js"
Vue.component(Upload.name, Upload)

import UploadList from "./module/uploadList/index.js"
Vue.component(UploadList.name, UploadList)

import Page from "./module/page/index.js"
Vue.component(Page.name, Page)

import Box from "./module/box/index.js"
Vue.component(Box.name, Box)

import Editor from "./module/editor/index.js"
Vue.component(Editor.name, Editor)

document.getElementById("ta-app").style.display="block"