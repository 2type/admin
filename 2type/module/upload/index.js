import template from "./tpl.js"
export default {
    name: "ta-upload",
    template: template,
    props: ['value','action', 'disabled',],
    data:function () {
        return {

        }
    },
    methods: {
        onSuccess(data) {
            var res = {
                data: data
            }
            if (TA.hook.req.handleError(res, TA.hook.req.passCallback, TA.hook.req.failCallback) == false) {
                this.$emit('input', {
                    id: res.data.id,
                    src: res.data.src,
                    filename: res.data.filename,
                })
            }
        },
        onRemove() {
            this.$emit('input', {
                id: '',
                src: '',
                filename: '',
            })
        }
    },
}