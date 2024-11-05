export default `
<el-upload
        
        class="ta-upload"
        :action="action"
        :show-file-list="false"
        :on-success="onSuccess"
>
    <div class="ta-upload-inner">
        <img v-if="pv.src" :src="pv.src" class="ta-upload-preview"/>
        <i v-if="!pv.src && !pv.filename" class="el-icon-plus ta-upload-picker"></i>
        <span class="ta-upload-filename">{{pv.filename}}</span>
    </div>
    <span v-if="pv.src || pv.filename"  @click.stop="onRemove" class="ta-upload-close el-icon-error"></span>
</el-upload>
`