export default
`
<div class="ta-lbs-limit"  >
    <el-tree v-if="debug" :data="options" :props="debugProps" :default-expand-all="true"></el-tree>
    <el-select
        style="margin-bottom: 1em;"
        placeholder="请选择模式" :value="value.type" @change="changeType">
        <el-option value="unlimited" label="♾️不限地区"></el-option>
        <el-option value="selected" label="✅包含区域"></el-option>
        <el-option value="inverse" label="🚫排除区域"></el-option>
        <el-option value="selectedAndInverse" label="🔗组合模式"></el-option>
    </el-select>
    <div v-if="value.type == 'selected' || value.type == 'selectedAndInverse'" >
        包含区域: <br>
        <el-cascader
        style="width:100%;margin-bottom: 1em;"
        placeholder="请选择包含区域"
        :value="value.selected"
        @change="changeSelected"
        :options="options"
        :props="{ multiple: true, checkStrictly: true, expandTrigger:'hover', emitPath: false }"
        clearable
        filterable
        ></el-cascader>
        <el-button @click="copySelected">复制配置</el-button>
        <el-button @click="setSelected">设置配置</el-button>
        <ta-lbs-text-match title="包含区域" v-model="value.selected"></ta-lbs-text-match>
    </div>
    <div v-if="value.type == 'inverse' || value.type == 'selectedAndInverse'" >
        排除区域: <br>
        <el-cascader
        style="width:100%;margin-bottom: 1em;"
        placeholder="请选择排除区域"
        :value="value.inverse"
        @change="changeInverse"
        :options="options"
        :props="{ multiple: true, checkStrictly: true, expandTrigger:'hover', emitPath: false }"
        clearable
        filterable
        ></el-cascader>
        <el-button @click="copyInverse">复制配置</el-button>
        <el-button @click="setInverse">设置配置</el-button>
   </div>
</div>
`
