export default
`
<div class="ta-lbs-limit"  >
    <el-tree v-if="debug" :data="options" :props="debugProps" :default-expand-all="true"></el-tree>
    <el-cascader
        style="width:100%;margin-bottom: 1em;"
        placeholder="请选择包含区域"
        :value="value"
        @change="changeValue"
        :options="options"
        :props="{ multiple: true, checkStrictly: true, expandTrigger:'hover', emitPath: false }"
        clearable
        filterable
        ></el-cascader>
    <el-button @click="copyValue">复制配置</el-button>
    <el-button @click="setValue">设置配置</el-button>
    <ta-lbs-text-match title="包含区域" v-model="value"></ta-lbs-text-match>
</div>
`
