export default `
<div>
    <div v-for="(item, index) in value" key="index" style="margin-bottom: 1em;">
        <ta-upload :action="action" @input="inputItem(index, $event)" @remove="removeItem(index)"  :value="item"></ta-upload>    
    </div>
    <ta-upload :action="action" @input="newItem" :value="{}" ></ta-upload>
</div>
`