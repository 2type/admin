import qs from "https://esm.2type.cn/query-string@7.0.0"
import axios from "https://esm.2type.cn/axios@0.21.1"
import dayjs from "https://esm.2type.cn/dayjs@1.8.21"
import echarts from "https://esm.2type.cn/echarts@5.2.1/dist/echarts.min.js"
import wangEditor from "https://esm.2type.cn/wangeditor@4.7.8/dist/wangEditor.min.js"
import copy from "https://esm.2type.cn/copy-to-clipboard@3.3.1"
window.TA = window.TA || {
    qs,
    axios,
    dayjs,
    echarts,
    wangEditor,
    copy,
}
TA.qs = qs
TA.axios = axios
TA.dayjs = dayjs
TA.echarts = echarts
TA.wangEditor = wangEditor
TA.copy = copy
