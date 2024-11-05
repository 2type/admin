export default `
<div>
    <div v-for="(item, index) in value" :key="index" style="margin-bottom: 1em;margin-right: 1em;display: inline-block;">
        <ta-upload :only-id="onlyId" :action="action" @input="inputItem(index, $event)" @remove="removeItem(index)"  :value="item"></ta-upload>    
    </div>
    <ta-upload :only-id="onlyId" :action="action" @input="newItem" :value="pv" ></ta-upload>
</div>
`