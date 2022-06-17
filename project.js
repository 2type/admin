// 后端操作成功响应: {"error": {"code": 0, "message": ""}}
// 后端操作失败响应: {"error": {"code": 1, "message": "标题重复"}}
TA.hook.req.handleError= function (res, passCallback, failCallback) {
    // 数据格式补全
    res.data.error = res.data.error || {}
    res.data.error.code = res.data.error.code || 0

    // 失败判断
    if (res.data.error.code) {
        failCallback(res)
        return true
    } else {
        res.data.error = undefined
        passCallback(res)
        return false
    }
}
// 配置富文本编辑器的上传图片插入
TA.hook.editor.insertImage = function (res, insert) {
    console.log("TA.hook.editor.insertImage:res:", res)
    insert(res.data.src)
}
// 错误消息弹窗 {"code":1, "message":"标题重复"}
TA.hook.req.failCallback = function (res) {
    ELEMENT.Message({
        type: 'error',
        message: res.data.error.message,
    })
}

// 控制跳转到任意地址 {"jump":"https://github.com/2type/admin", "code":0, "message":""}
// 控制跳转到 TA.m {"jump":"url_home()", "code":0, "message":""}
// 控制跳转到 TA.m 带参数 {"jump":"url_demo_update()", "jumpArgs": [1], "code":0, "message":""}
// 成功提示 {"successMessage": "创建成功","code":0, "message":""}
TA.hook.req.passCallback =  function (res) {
    res.data = res.data || {}
    if (res.data.jump) {
        if (res.data.jump === "refresh") {
            ELEMENT.Message({
                type: 'info',
                message: '即将刷新页面',
            })
            setTimeout(function () {
                location.reload()
            }, 1000)
            return
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
}

TA.footer = {
    link: {
        text: "2type/admin",
        href: "https://github.com/2type/admin",
    }
}

TA.m.url_sms_send = function () {
    return "/sms/send"
}
TA.m.url_captcha = function () {
    return "/captcha"
}
TA.m.url_home = function () {
    return "/admin/home"
}
