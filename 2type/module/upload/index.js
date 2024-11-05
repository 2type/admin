import template from "./tpl.js"
export default {
    name: "ta-upload",
    template: template,
    props: ['value','action', 'disabled', 'remove', 'only-id'],
    data:function () {
        return {

        }
    },
    computed: {
        pv() {
            if (this.onlyId) {
                return {
                    src: this.value,
                    id: this.value,
                }
            } else {
                return {
                    src: this.value.src,
                    id: this.value.id,
                    filename: this.value.filename,
                }
            }
        }
    },
    methods: {
        onSuccess(data) {
            var res = {
                data: data
            }
            if (TA.hook.req.handleError(res, TA.hook.req.passCallback, TA.hook.req.failCallback) == false) {
                var v = {
                    id: res.data.id,
                    src: res.data.src,
                    filename: res.data.filename,
                }
                if (this.onlyId) {
                    v = res.data.id
                }
                this.$emit('input', v)
            }
        },
        onRemove() {
            var v = {
                id: '',
                src: '',
                filename: '',
            }
            if (this.onlyId) {
                v = ""
            }
            this.$emit('input', v)
            this.$emit('remove')
        }
    },
}