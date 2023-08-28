export default
`
<el-container >
        <el-aside width="350" >
            <el-menu             
              style="height: 100%;"
              class=""
              :default-active="navActive"
              >
                <el-menu-item style="padding:1em;" >
                    <div style="text-align: center;margin-top: -1em;">
                        <img class="" :src="nav.top.logo" style="margin-bottom: -.3em;height:2em;" >
                        <span style="display:inline-block;font-size:1.4em;">{{nav.top.title}}</span>
                    </div>
                </el-menu-item>
                 <template v-for="(item, index) in nav.items"  >
                    <el-menu-item v-if="isEmptyArray(item.items)" :index="navIndex(item.url)" :key="item.title" >
                        <div slot="title">
                            <a :href="item.url" class="ta-pc-link">
                            <img class="ta-icon" :src="icon(item.icon)" />
                            {{item.title}}
                            </a>
                        </div>
                    </el-menu-item>         
                    <el-submenu v-else :index="'i'+index" :key="item.title"  >
                        <div slot="title">
                            <a :href="item.url" class="ta-pc-link">
                            <img class="ta-icon" :src="icon(item.icon)" />
                            {{item.title}}
                            </a>
                        </div>
                        <el-menu-item v-for="sub in item.items" :index="navIndex(sub.url)" :key="sub.title"  >
                            <div slot="title">
                                <a :href="sub.url" class="ta-pc-link">
                                    <i :class="'fa fa-' + sub.fontawesome" aria-hidden="true"></i>
                                    {{sub.title}}
                                </a>
                            </div>
                        </el-menu-item>
                    </el-submenu>       
                </template>       
                
            </el-menu>
        </el-aside>
        <el-container>
            <el-header  style="height:auto;padding:1em;border-bottom:1px solid #eee;position:relative;z-idnex:2;">
                <div  style="float:right;" >
                    <el-dropdown :hide-on-click="false">
                        <div style="cursor: pointer;">
                              <el-image
                                  style="width: 30px; height: 30px;border-radius: 50%;margin-bottom: -0.8em;"
                                  :src="nav.manager.avatar"
                                  fit="contain"
                               ></el-image>
                              <ta-unread :unread="nav.manager.unreadMessage">
                              {{nav.manager.name}}
                              </ta-unread>
                              <i class="el-icon-arrow-down el-icon--right"></i>
                        </div>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                          <ta-unread :unread="nav.manager.unreadMessage" :show-count="true">
                            <el-link :href="nav.messageURL" target="_blank">消息</el-link>
                          </ta-unread>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link :href="nav.logoutURL" target="_blank">退出</el-link>
                          </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item key="1">
                        <i class="fa fa-tachometer"></i>
                    </el-breadcrumb-item>
                   <el-breadcrumb-item v-for="item in header" :key="item.link" >
                        <a style="cursor: pointer;" v-if="item.url" :href="item.url">{{item.title}}</a>
                        <span v-else>{{item.title}}</span>
                   </el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main style="background: #f7f7f7;">
              <slot></slot>
            </el-main>
            <el-footer height="auto">
                <div style="text-align: center;padding:1em;opacity: 0.3;">
                    <el-link :href="footer.link.href">{{footer.link.text}}</el-link>
                </div>
            </el-footer>
        </el-container>
    </el-container>


`