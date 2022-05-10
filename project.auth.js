// 单独存储包含管理后台信息的js配置,未登录状态可看到此文件会被恶意攻击者知道管理后台的菜单项

// TA.m._find("skuType", "value", 1).label // "虚拟"
TA.enum.skuType = [
    {
        key: 'digit',
        value: 1,
        label: '虚拟',
    },
    {
        key: 'object',
        value: 2,
        label: '实物',
    },
]

// url
TA.m.url_logout = function () {
    return "/admin/logout"
}
TA.m.url_demo_list = function () {
    let json = JSON.stringify({
        daterange: [
            TA.dayjs().subtract(6, 'day').format("YYYY-MM-DD"),
            TA.dayjs().format("YYYY-MM-DD")
        ]
    })
    return "/admin/demo_list?json=" + encodeURIComponent(json)
}
TA.m.url_demo_update = function (id) {
    return "/admin/demo_update?id=" + id
}
TA.m.url_demo_create = function () {
    return "/admin/demo_create"
}
TA.m.url_mobile_home = function () {
    return "/mobile/home"
}

TA.nav = {
    // 头部
    top: {
        logo: 'https://icon.2type.cn/logo.svg',
        title: "内部管理后台",
    },
    user: {
        avatar: "https://icon.2type.cn/user-male.svg",
        name: "admin",
    },
    // 退出登录
    logoutURL: TA.m.url_logout(),
    // 导航
    items: [
        {
            url: TA.m.url_home(),
            // 可在 https://icon.2type.cn/ 中寻找 icon 或者直接填写 https://icon.2type.cn/logo.svg
            icon: 'display',
            title: "首页",
        },
        {
            icon: 'shopping',
            title: "演示",
            items: [
                {
                    // 可在 http://www.fontawesome.com.cn/faicons/ 中寻找fontawesome
                    fontawesome: 'list-alt',
                    url: TA.m.url_demo_list(),
                    title: '列表',
                },
                {
                    fontawesome: 'pencil-square-o',
                    url: TA.m.url_demo_create(),
                    title: '创建',
                },
            ]
        },
    ]
}

TA.footer = {
    link: {
        text: "@2type/admin",
        href: "https://github.com/2type/admin",
    }
}
