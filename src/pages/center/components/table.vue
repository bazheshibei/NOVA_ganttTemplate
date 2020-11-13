
<!-- 模块：表格 -->

<template>
  <div class="comTableBox" ref="comTableBox">
    <p style="display:none;">{{tableList}}</p>

    <el-table :data="tableList" size="mini" border :height="tableHeight">
      <!-- 操作 -->
      <el-table-column label="排序" width="140" fixed v-if="pageType !== 'showView'">
        <template slot-scope="scope">
          <el-input size="mini" placeholder="序号" v-model="scope.row.node_number" @change="numChange">
            <template slot="append">
              <el-popconfirm :title="'确定要删除 ' + scope.row.node_name + ' 吗？'" icon="el-icon-info" iconColor="red" confirmButtonType="text"
                @onConfirm="deleteClick(scope.$index)"
              >
                <span class="hover" slot="reference">删除</span>
              </el-popconfirm>
            </template>
          </el-input>
        </template>
      </el-table-column>
      <!-- 节点标识 -->
      <el-table-column label="节点标识" width="200" fixed>
        <template slot-scope="scope">
          <el-checkbox-group v-if="scope.row.node_ierarchy !== 2" v-model="nodeList[scope.$index].badge" :disabled="pageType === 'showView'">
            <el-checkbox label="is_core_node">核心节点</el-checkbox>
            <el-checkbox label="is_audit_follow">审核关注</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <!-- 节点名称 -->
      <el-table-column label="节点名称" width="200" fixed>
        <template slot-scope="scope">
          <span :style="scope.row.node_ierarchy === 2 ? 'color: #C0C4CC;' : ''">{{scope.row.node_name}}</span>
        </template>
      </el-table-column>
      <!-- 节点编码 -->
      <el-table-column prop="node_code" label="节点编码" width="110" fixed></el-table-column>
      <!-- 节点层级 -->
      <el-table-column label="节点层级" width="80">
        <template slot-scope="scope">
          <span :class="scope.row.node_ierarchy === 2 ? 'grey' : ''">{{ierarchyObj[scope.row.node_ierarchy] || ''}}</span>
        </template>
      </el-table-column>
      <!-- 提报类型 -->
      <el-table-column label="提报类型" width="130">
        <template slot-scope="scope">
          <span class="grey" v-if="scope.row.node_ierarchy === 2">{{typeObj[scope.row.submit_type]}}</span>
          <div v-else>
            <el-select class="comSelect" v-if="nodeList[scope.$index]" v-model="nodeList[scope.$index].submit_type" size="mini" :disabled="pageType === 'showView'">
              <el-option label="系统计算" :value="1"></el-option>
              <el-option label="用户提报" :value="2"></el-option>
              <el-option label="系统生成" :value="3"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <!-- 描述 -->
      <el-table-column label="描述" width="130" v-if="pageType !== 'showView'">
        <template slot-scope="scope">
          <el-input size="mini" placeholder="节点描述" maxlength="200"
            v-if="nodeList[scope.$index]" v-model="nodeList[scope.$index].sys_describe"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="130" v-else>
        <template slot-scope="scope">
          <p v-if="nodeList[scope.$index]">
             {{nodeList[scope.$index].sys_describe}}
          </p>
        </template>
      </el-table-column>
      <!-- 系统计算公式 -->
      <el-table-column label="系统计算公式" min-width="400" v-if="pageType !== 'showView'">
        <template slot-scope="scope">
          <div v-if="typeObj[scope.row.submit_type] !== '用户提报'">
            <el-input size="mini" :placeholder="scope.$index === 0 ? '如:Math.min(Math.max(${APPQR},${PPWLDQ})-2,(${KC}-2))' : '请输入计算公式'"
              v-if="nodeList[scope.$index]" v-model="nodeList[scope.$index].sys_clac_formula"
              @change="inputChange(`第${scope.$index + 1}行_系统计算公式`, $event, scope.row.node_code, 'main')"
            ></el-input>
          </div>
          <span v-if="typeObj[scope.row.submit_type] === '用户提报'">----</span>
        </template>
      </el-table-column>
      <el-table-column label="系统计算公式" min-width="400" v-else>
        <template slot-scope="scope">
          <p v-if="nodeList[scope.$index]">
             {{nodeList[scope.$index].sys_clac_formula}}
          </p>
        </template>
      </el-table-column>
      <!-- 节点验证区间最小值 -->
      <el-table-column label="节点验证区间最小值" width="200" v-if="pageType !== 'showView'">
        <template slot-scope="scope">
          <div v-if="typeObj[scope.row.submit_type] !== '系统生成'">
            <el-input :disabled="pageType === 'showView'" size="mini"
              v-if="nodeList[scope.$index]" v-model="nodeList[scope.$index].min_section_value"
              :placeholder="scope.$index === 0 ? '如:${KSJZZ}+3' : '请输入计算公式'"
              @change="inputChange(`第${scope.$index + 1}行_节点验证区间最小值`, $event, scope.row.node_code)"
            ></el-input>
          </div>
          <span v-if="typeObj[scope.row.submit_type] === '系统生成'">----</span>
        </template>
      </el-table-column>
      <el-table-column label="节点验证区间最小值" min-width="200" v-else>
        <template slot-scope="scope">
          <p v-if="nodeList[scope.$index]">
             {{nodeList[scope.$index].min_section_value}}
          </p>
        </template>
      </el-table-column>
      <!-- 节点验证区间最大值 -->
      <el-table-column label="节点验证区间最大值" width="200" v-if="pageType !== 'showView'">
        <template slot-scope="scope">
          <div v-if="typeObj[scope.row.submit_type] !== '系统生成'">
            <el-input :disabled="pageType === 'showView'" size="mini"
              v-if="nodeList[scope.$index]" v-model="nodeList[scope.$index].max_section_value"
              :placeholder="scope.$index === 0 ? '如:${KSJZZ}+3' : '请输入计算公式'"
              @change="inputChange(`第${scope.$index + 1}行_节点验证区间最大值`, $event, scope.row.node_code)"
            ></el-input>
          </div>
          <span v-if="typeObj[scope.row.submit_type] === '系统生成'">----</span>
        </template>
      </el-table-column>
      <el-table-column label="节点验证区间最大值" min-width="200" v-else>
        <template slot-scope="scope">
          <p v-if="nodeList[scope.$index]">
             {{nodeList[scope.$index].max_section_value}}
          </p>
        </template>
      </el-table-column>
      <!-- 节点验证说明 -->
      <el-table-column label="节点验证说明" width="200" v-if="pageType !== 'showView'">
        <template slot-scope="scope">
          <span v-if="typeObj[scope.row.submit_type] === '系统生成'">----</span>
          <div v-else>
            <el-input size="mini" placeholder="请输入验证说明" :disabled="pageType === 'showView'" maxlength="200"
              v-if="nodeList[scope.$index]" v-model="nodeList[scope.$index].verification_remark"
            ></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="节点验证说明" min-width="200" v-else>
        <template slot-scope="scope">
          <p v-if="nodeList[scope.$index]">
             {{nodeList[scope.$index].verification_remark}}
          </p>
        </template>
      </el-table-column>
    </el-table>

    <div class="bottomBox" ref="bottomBox">
      <el-button size="mini" type="info" plain @click="clickClose">关闭</el-button>
      <el-button size="mini" type="primary" plain @click="save" v-if="pageType !== 'showView'">保存</el-button>
    </div>

  </div>
</template>

<script>
import Tool from './tool.js'
import { mapState, mapGetters } from 'vuex'
export default {
  created() {
    /** 计算：表格高度 **/
    this._countHeight()
  },
  data() {
    return {
      tableHeight: 0, //                                       表格高度
      /* 页面布局 */
      ierarchyObj: { 1: '提报节点', 2: '内控节点' }, //           展示：节点层级
      typeObj: { 1: '系统计算', 2: '用户提报', 3: '系统生成' }, // 展示：提报类型
      codeObj: {}, //                                          记录：用到哪些节点编码
      /* 验证 */
      inputCode: {}, //  记录某节点引用了哪几个节点
      inputStatus: {} // 记录各input的验证状态  { 第1行_系统计算公式: false, 第2行_系统计算公式: true }
    }
  },
  watch: {
    '$store.state.isCountTableHeight'() {
      const that = this
      if (this.$store.state.isCountTableHeight) {
        setTimeout(function () {
          /** 计算：表格高度 **/
          that._countHeight()
        }, 1)
      }
    }
  },
  computed: {
    ...mapState(['nodeList', 'tableObj', 'tableActive', 'pageType']),
    ...mapGetters(['tableList']),
    /**
     * [数组：全部节点]
     */
    arrCode() {
      const { tableList } = this
      const obj = { 'KHXDRQ': true, 'KSTXDSJ': true, 'YHRQ': true, 'FPJCRQ': true, 'KHJQ': true, 'GCJQ': true }
      tableList.forEach(function (item) {
        obj[item.node_code] = true
      })
      return obj
    },
    /**
     * [数组：用到的节点编码]
     */
    arrCodeUsed() {
      return Object.keys(this.codeObj)
    }
  },
  methods: {
    /**
     * [排序变更]
     */
    numChange() {
      this.$store.commit('saveData', { name: 'isSort', obj: true })
    },
    /**
     * [删除]
     * @param {[Int]} index 索引
     */
    deleteClick(index) {
      const { nodeList } = this
      nodeList[index].is_delete = 0
      this.$store.commit('saveData', { name: 'isSort', obj: true })
    },
    /**
     * [输入变更]
     * @param {[String]} key  位置：第几行系统计算公式
     * @param {[String]} str  输入值
     * @param {[String]} code 节点编码
     * @param {[String]} who  who === 'main' 系统计算公式
     */
    inputChange(key, str, code, who = '') {
      const that = this
      const { inputStatus } = that
      let status = true // 此输入框的验证状态
      if (str) {
        /** ----- 有输入值 ----- **/
        /** 验证：页面跳转 **/
        if (Tool.windowOpen(str)) {
          /** 验证：节点编码是否存在 **/
          const proving_includes = Tool.includes(key, str, this)
          /** 验证：是否引用自身 **/
          const proving_useSelf = who === 'main' ? Tool.useSelf(key, str, code, this) : true
          /** 验证：是否互相引用 **/
          const proving_eachOther = who === 'main' ? Tool.eachOther(key, str, code, this) : true
          /** 验证：公式是否能计算 **/
          const proving_math = Tool.math(key, str, this)
          /* 输出：验证结果 */
          status = proving_includes && proving_useSelf && proving_eachOther && proving_math
        } else {
          this.$alert('闲的蛋疼？', '滚蛋', { confirmButtonText: '确定', type: 'error' })
        }
        /* 记录：验证状态 */
        this.inputStatus = Object.assign({}, inputStatus, { [key]: status })
      } else {
        /** ----- 无输入值 ----- **/
        /* 记录：验证状态 */
        this.inputStatus = Object.assign({}, inputStatus, { [key]: false })
      }
    },
    /**
     * [关闭]
     */
    clickClose() {
      // eslint-disable-next-line
      dg.close()
    },
    /**
     * [保存]
     */
    save() {
      const [obj, problemArr, datalist] = Tool.submit(this)
      obj.datalist = JSON.stringify(datalist)
      if (problemArr.length) {
        // console.log('报错')
        const arr = []
        problemArr.forEach(function (item) {
          arr.push(`<p>${item}</p>`)
        })
        const str = arr.join('')
        this.$alert(str, '请完善后再提交', { dangerouslyUseHTMLString: true })
      } else {
        /* 非新增页面 */
        const { node_template_id, pageType, is_copy } = this.$store.state
        obj.is_copy = is_copy // 是否复制新增：0否，1复制新增，2复制修改
        if (pageType) {
          if (pageType === 'update') {
            /* 修改 */
            obj.node_template_id = node_template_id // 模板id
          } else if (pageType === 'addCopy') {
            /* 复制新增 */
            obj.copy_node_template_id = node_template_id // 复制对应的模板id
          }
        }
        /** 请求：保存 **/
        this.$store.dispatch('A_addOrUpdatee', { obj })
      }
    },
    /**
     * [计算：表格高度]
     */
    _countHeight() {
      const that = this
      let i = 0
      const timer = setInterval(function () {
        if (Object.keys(that.$refs).length) {
          const { comTableBox, bottomBox } = that.$refs
          if (comTableBox.clientHeight && bottomBox.clientHeight) {
            that.tableHeight = comTableBox.clientHeight - bottomBox.clientHeight
            clearInterval(timer)
          }
        }
        if (i > 100) {
          clearInterval(timer)
        }
        i++
      }, 100)
    },
    /**
     * [兼容IE11：数组includes]
     * @param  {[String]}  str 关键字
     * @param  {[Array]}   arr 数组
     * @return {[Boolean]}     true || false
     */
    _arrIncludes(str, arr = []) {
      let status = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
          status = true
        }
      }
      return status
    }
  }
}
</script>

<style scoped>
.comTableBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*** 表格容器 ***/
.deleteBtn { /* 删除按钮 */
  margin: 5px 0;
  cursor: pointer;
}
.comSelect { /* 下拉框 */
  margin: 5px 0;
}

/*** 底部按钮 ***/
.bottomBox {
  margin: 4px 10px;
  display: flex;
  justify-content: flex-end;
}
.bottomBtn {
  margin-right: 30px;
}
</style>
