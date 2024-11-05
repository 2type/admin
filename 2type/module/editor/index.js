import template from "./tpl.js"
const wangEditor= TA.wangEditor
export default {
    name: "ta-editor",
    template: template,
    props: ['value', 'photo'],
    data:function () {
        return {
            id: "ta-editor" + new Date().getTime(),
            editor: null,
            editorData: "",
        }
    },
    mounted() {
        const vm = this
        if (!TA.wangEditor) {
            var msg = "页面需要引入" + `<` + `script type="module" src="/public/2type/2type.dep.editor.js" ></` +`.script>`
            alert(msg)
            console.error(msg)
            return
        }
        const editor = new TA.wangEditor(vm.$refs.editor)
        editor.config.onchange = (newHtml) => {
            vm.editorData = newHtml
            vm.$emit("input", newHtml)
        }
        // editor.config.uploadImgServer = vm.photo
        editor.config.customUploadImg = function (resultFiles, insertImgFn) {
            resultFiles.forEach(function (file) {
                let data = new FormData()
                data.append("file", file, file.name)
                TA.m._req({
                    method: "post",
                    url: vm.photo,
                    data:data,
                    headers: {'Content-Type': 'multipart/form-data'}
                }, function (res){
                    TA.hook.editor.insertImage(res, insertImgFn)
                })
            })
        }
        editor.create()
        editor.txt.html(vm.value)
        this.editor = editor

    },
    beforeDestroy() {
        // 调用销毁 API 对当前编辑器实例进行销毁
        this.editor.destroy()
        this.editor = null
    },
    methods: {

    },
}