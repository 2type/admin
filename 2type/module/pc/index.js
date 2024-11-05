import template from "./tpl.js"
export default {
    name: "ta-pc",
    template: template,
    props: ['header', 'logo'],
    data:function () {
        return {
            nav: TA.nav,
            footer: TA.footer,
            isCollapse: false,
            navActive: location.pathname
        }
    },
    methods: {
        navIndex(url) {
            if (url) {
                return url.replace(/\?.*$/, "")
            }
            return  url
        },
        icon(path) {
            return path
        },
        handleSelect(url) {
            if (url) {
                TA.m._jump(url)
            }
        },
        isEmptyArray(arr) {
            if (Array.isArray(arr)) {
                return arr.length == 0
            }
           return !arr
        }
    },
}