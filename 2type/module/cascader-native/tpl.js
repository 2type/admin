export default
`<div class="ta-cascader-native">
<span 
    class="ta-cascader-native-select"
    v-if="childOption[index] && childOption[index].length != 0"
     v-for="(v, index) in value" 
>
    <select 
     :value="value[index]" 
     @change="changeItem($event, index)" 
     >
        <option value="">请选择{{label[index]}}</option>
        <option  v-for="i in childOption[index]" :value="i.value">{{i.label}}</option>
    </select>
</span>
</div>
`
