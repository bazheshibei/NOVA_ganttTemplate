
<!-- 模块：设置节点 -->
<template>
  <div class="comBox">

    <div class="selectBox">
      <div class="searchName">设置节点&nbsp;&nbsp;&nbsp;</div>
      <div class="searchVal">
        <el-button type="primary" size="mini" plain @click="add" :disabled="pageType === 'showView'">批量添加节点</el-button>
      </div>
    </div>

    <div class="selectBox textBox blue" v-for="(item, index) in startObj" :key="'start_' + index">
      <div class="searchName">{{item}}：</div>
      <span>{{index}}</span>
    </div>
    <div class="selectBox textBox red" v-for="(item, index) in endObj" :key="'end_' + index">
      <div class="searchName">{{item}}：</div>
      <span>{{index}}</span>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      startObj: { 'KHXDRQ': '客户下单日期', 'KSTXDSJ': '款式图下单时间', 'YHRQ': '验货日期', 'FPJCRQ': '发票寄出日期' },
      endObj: { 'KHJQ': '客户交期', 'GCJQ': '工厂交期' }
    }
  },
  computed: {
    ...mapState(['nodeList', 'pageType', 'selectVal', 'p_type_id', 'min_lead_time', 'max_lead_time'])
  },
  methods: {
    // [{"node_id":"2c9f10b66779c50801677c1aea6b0282","node_name":"染色完成","node_code":"DH-RSWC1","node_ierarchy":null},{"node_id":"2c9f10b66e18114f016e3ad259d617cc","node_name":"计划提报","node_code":"DH-JHTB1","node_ierarchy":null},{"node_id":"2c9f10b66c3e484d016c4b52869567c8","node_name":"项目创建","node_code":"DH-XMCJ","node_ierarchy":null}]
    // [{"node_id":"2c9f10b66779c50801677c1a1121027b","node_name":"毛条到厂","node_code":"DH-MTDC","node_ierarchy":null},{"node_id":"8a8a8062638a6cab01638aaf51ee0034","node_name":"服装合同下达","node_code":"DH-FZHTXD","node_ierarchy":null},{"node_id":"2c9f10b66779c50801677c1aea760284","node_name":"大货完成","node_code":"DH-DHWC","node_ierarchy":null}]

    /**
     * [批量添加节点]
     * @param {[Boolean]} addPage 是否：新增页面
     */
    add(addPage = true) {
      const { pageType } = this
      const { ywlx: node_business_type_id } = this.selectVal
      if (node_business_type_id) {
        // /* 本地 */
        // const that = this
        // const { nodeList } = that
        // let local = nodeList.length ? JSON.parse(localStorage.getItem('asd')) || [] : JSON.parse(localStorage.getItem('ganttTemplateChoiceNodeData')) || []
        // if (!addPage) {
        //   /* 非新增页面 */
        //   local = that.$store.state.templateData.ganttTemplateDetail || [] // 模板页面数据：节点列表
        // }
        // /* 转对象：原数据 */
        // const obj = {}
        // nodeList.forEach(function (item) {
        //   obj[item.node_id] = item
        // })
        // /* 转对象：新数据 && 去重 */
        // let i = nodeList.length
        // const arr = []
        // local.forEach(function (item) {
        //   if (!obj[item.node_id]) {
        //     const otherObj = {}
        //     const addObj = { key: i, badge: [], submit_type: 1, sys_clac_formula: '', min_section_value: '', max_section_value: '', verification_remark: '' }
        //     if (item.node_ierarchy === 2) {
        //       otherObj.submit_type = 2 // 内控节点 => 提报类型 改为 用户提报
        //     }
        //     if (addPage) {
        //       /* 新增页面 */
        //       arr.push(Object.assign({}, item, addObj, otherObj))
        //     } else {
        //       /* 非新增页面 */
        //       item.submit_type = String(item.submit_type)
        //       arr.push(Object.assign({}, addObj, item, otherObj))
        //     }
        //     i++
        //   }
        // })
        // this.$store.commit('saveData', { name: 'addNode', obj: true })
        // that.$store.commit('pushData', { name: 'nodeList', obj: arr })

        /* 服务器 */
        const that = this
        if (!addPage) {
          /* ----- 非新增页面 ----- */
          const { nodeList } = that
          const local = that.$store.state.templateData.ganttTemplateDetail || [] // 模板页面数据：节点列表
          /* 转对象：原数据 */
          const obj = {}
          nodeList.forEach(function (item) {
            obj[item.node_id] = item
          })
          /* 转对象：新数据 && 去重 */
          let i = nodeList.length
          const arr = []
          local.forEach(function (item) {
            if (!obj[item.node_id]) {
              const otherObj = {}
              const addObj = { key: i, badge: [], submit_type: 1, sys_clac_formula: '', min_section_value: '', max_section_value: '', verification_remark: '' }
              if (item.node_ierarchy === 2) {
                otherObj.submit_type = 2 // 内控节点 => 提报类型 改为 用户提报
              }
              arr.push(Object.assign({}, addObj, item, otherObj))
              i++
            }
          })
          that.$store.commit('saveData', { name: 'addNode', obj: true })
          that.$store.commit('pushData', { name: 'nodeList', obj: arr })
        } else {
          /* ----- 新增页面 ----- */
          const host = window.location.origin + '/nova/'
          const { pp: custom_id, pl: dress_type_id, ssxz: business_group_id, ddlx: order_type } = this.selectVal
          const { min_lead_time, max_lead_time } = this
          const { p_type_id } = that
          let str = ''
          if (p_type_id) {
            const obj = { p_type_id, custom_id, dress_type_id, business_group_id, order_type, min_lead_time, max_lead_time }
            const arr = []
            for (const x in obj) {
              if (obj[x] === '通用') {
                arr.push(`${x}=`)
              } else {
                arr.push(`${x}=${obj[x]}`)
              }
            }
            str = arr.join('&')
          }
          // eslint-disable-next-line
          win({
            url: host + `pages/nodeinfo/nodeInfolist.jsp?htmlchoice=true&node_business_type_id=${node_business_type_id}&${str}`,
            param: {},
            width: 1100,
            height: 550,
            title: '批量添加节点',
            onClose: function () {
              const { nodeList } = that
              const local = JSON.parse(localStorage.getItem('ganttTemplateChoiceNodeData')) || []
              /* 转对象：原数据 */
              const obj = {}
              nodeList.forEach(function (item) {
                obj[item.node_id] = item
              })
              /* 转对象：新数据 && 去重 */
              let i = nodeList.length
              const arr = []
              local.forEach(function (item) {
                if (!obj[item.node_id]) {
                  const otherObj = {}
                  const addObj = { key: i, badge: [], submit_type: 1, sys_clac_formula: '', min_section_value: '', max_section_value: '', verification_remark: '' }
                  if (item.node_ierarchy === 2) {
                    otherObj.submit_type = 2 // 内控节点 => 提报类型 改为 用户提报
                  }
                  arr.push(Object.assign({}, item, addObj, otherObj))
                  i++
                }
              })
              that.$store.commit('saveData', { name: 'addNode', obj: true })
              that.$store.commit('pushData', { name: 'nodeList', obj: arr })
              /* 清除缓存 */
              localStorage.removeItem('ganttTemplateChoiceNodeData')
            }
          })
        }
      } else if (!node_business_type_id && pageType === '') {
        this.$message.error('请先选择业务类型')
      }
    }
  }
}
</script>

<style scoped>
.comBox {
  margin-top: 10px;
  padding: 10px 0;
  background: #F2F6FC;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}
.selectBox { /* 单个组件块 */
  width: 280px;
  font-size: 12px;
  white-space: nowrap;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.searchName { /* 单个 label */
  width: 80px;
  min-width: 80px;
  text-align: right;
}
.searchVal { /* 下拉框组件 */
  flex: 1;
}
.comSelect { /* 下拉框组件 */
  flex: 1;
}
.textBox { /* 基准值文字容器 */
  width: auto;
  min-width: auto;
  margin-right: 20px;
  justify-content: flex-start;
}
.textBox > .searchName {
  width: auto;
  min-width: auto;
}
.blue {
  color: #409EFF;
}
.red {
  color: #F56C6C;
}
</style>

<style>
.comSelectOptions { /* 单个选项 */
  height: 25px !important;
  font-size: 12px !important;
  line-height: 25px !important;
  padding: 0 10px !important;
}
</style>
