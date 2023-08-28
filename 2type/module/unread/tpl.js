export default
`
<div class="ta-unread" >
    <slot></slot>
   <template  v-if="unread" >
    <span v-if="showCount" class="ta-unread-count">{{unread}}</span>
    <span v-else class="ta-unread-dot" ></span>   
    </template>
    
</div>
`