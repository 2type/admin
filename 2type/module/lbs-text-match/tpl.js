export default
`
<div class="ta-lbs-text-match" style="display: inline-block;margin-left: 10px" >
    <el-button @click="showDialog">文本匹配</el-button>
    <el-dialog :title="title" :visible.sync="dialogVisible" fullscreen @close="closeDialog">
        <el-steps :active="step" align-center style="margin-top: -40px;">  
            <el-step title="复制内容"></el-step>  
            <el-step title="匹配分析修正"></el-step>
        </el-steps>
        <template v-if="step==1">
            <table style="margin: auto;">
                <tr>
                    <td>
                        <el-input v-model="originData" type="textarea" :rows="20" placeholder="请输入文本, 一行一个" style="width: 400px;"></el-input>
                    </td>
                    <td>
                        <el-button @click="analysisOriginData">下一步</el-button>
                    </td>
                </tr>
            </table>
        </template>    
        <template v-if="step==2">
            <el-table :data="list" highlight-current-row height="600" size="mini">
                <el-table-column property="originIndex" label="原行位"></el-table-column>
                <el-table-column property="origin" label="原内容" width="300">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.origin" type="text" />
                    </template>
                </el-table-column>
                <el-table-column property="province" label="匹配(省)">
                    <template slot-scope="scope">
                        <template v-if="scope.row.province.find">
                            {{scope.row.province.fullName}} {{scope.row.province.adcode}}
                        </template>
                        <template v-else>--</template>
                    </template>
                </el-table-column>
                <el-table-column property="city" label="匹配(市)">
                    <template slot-scope="scope">
                        <template v-if="scope.row.city.find">
                            {{scope.row.city.fullName}} {{scope.row.city.adcode}}
                        </template>
                        <template v-else>--</template>
                    </template>
                </el-table-column>
                <el-table-column property="district" label="匹配(区)">
                    <template slot-scope="scope">
                        <template v-if="scope.row.district.find">
                            {{scope.row.district.fullName}} {{scope.row.district.adcode}}
                        </template>
                        <template v-else>--</template>
                    </template>
                </el-table-column>
                <el-table-column property="adcode" label=""></el-table-column>
                <el-table-column property="pass" label="匹配结果">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pass" type="success">{{scope.row.adcode}}</el-tag>
                        <el-tag v-else type="danger">失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="msg" label="分析"></el-table-column>
            </el-table>
            <div>
                数据: {{getTotal.total}} 个, 
                成功匹配: <span style="color: #67c23a;">{{getTotal.pass}}</span> 个, 
                失败匹配: <span style="color: #f56c6c;">{{getTotal.fail}}</span> 个
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="danger" @click="deletefromValue">将匹配成功结果去除</el-button>
                <el-button type="primary" @click="addToValue">将匹配成功结果加入</el-button>
            </span>
        </template>
    </el-dialog>
</div>
`