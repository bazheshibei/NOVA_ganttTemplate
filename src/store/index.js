// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
import Tool from './tool.js' // 工具方法
import Dev from './dev.js' //   本地开发代码
import Prod from './prod.js' // 生产环境代码
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {},

  state: {
    nowCodeType: 'Prod', //     当前代码类型
    codeObj: { Dev, Prod }, // 代码类型 { Dev: '开发', Prod: '生产' }
    /**/
    local: {},
    p_type_id: '', //               父 ID
    isCountTableHeight: false, //   是否重新计算表格高度 [请求其他下拉选项 后 触发]
    /* 页面信息 */
    node_template_id: '', //        模板 ID
    pageType: '', //                页面类型 { update: 修改, addCopy: 复制新增, showView: 查看 }
    templateData: {}, //            模板页面数据
    isRequestTemplateData: true, // 是否可以请求模板数据
    jzz_start: {}, //               开始基准值
    jzz_end: {}, //                 结束基准值
    /* 下拉框 */
    ywlx: { label: '业务类型', index: 'ywlx', options: [] }, // 业务类型
    pp: { label: '品牌', index: 'pp', options: [] },
    pl: { label: '品类', index: 'pl', options: [] },
    ssxz: { label: '所属小组', index: 'ssxz', options: [] },
    ddlx: { label: '订单类型', index: 'ddlx', options: [] },
    xmlx: { label: '项目类型', index: 'xmlx', options: [] },
    templsteindex: [], //        展示哪些选项
    /* 设置结点 */
    addNode: false, //           是否添加节点
    nodeList: [], //             节点列表
    /* 表格 */
    tableObj: { asd: [] }, //    表格数组
    tableActive: 'asd', //       当前应渲染的表格
    /* 排序 */
    isSort: true, //             是否触发排序
    /* 页面原始数据 */
    selectShow: {}, //           当前下拉框选项
    old_selectShow: {}, //       原始数据 -- 下拉框的值
    old_min_lead_time: '', //    原始数据 -- 交货周期：最小天数
    old_max_lead_time: '', //    原始数据 -- 交货周期：最大天数
    /* 提交 */
    selectVal: {}, //            下拉框选项
    min_lead_time: '', //        交货周期：最小天数
    max_lead_time: '', //        交货周期：最大天数
    node_template_remark: '', // 模板备注
    is_copy: 0, //               是否复制新增
    template_name: '' //         模板名称
  },

  getters: {
    /**
     * [排序后的节点数组]
     */
    tableList: (state) => {
      const { nodeList, isSort } = state
      const list = Tool.sort(nodeList, isSort)
      // state.nodeList = list
      state.isSort = false
      // console.log('排序后的节点数组 ----- ', list)
      return list
    }
  },

  mutations: {
    /**
     * [重置顶部下拉选项]
     */
    resetSelect(state, { that }) {
      const { old_selectShow } = state
      for (const x in old_selectShow) {
        that.selectChange(old_selectShow[x], x) // 下拉框：变化
        that.selectShow[x] = old_selectShow[x]
      }
    },
    /**
     * [保存数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    saveData(state, params) {
      const { name, obj } = params
      state[name] = obj
      // Vue.set(state, name, obj)
    },
    /**
     * [添加数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    assignData(state, params) {
      const { name, obj } = params
      const data = state[name] || {}
      state[name] = Object.assign({}, data, obj)
    },
    /**
     * [表格删除]
     * @param {[String]} name  属性名
     * @param {[Object]} obj   属性值
     * @param {[Int]}    index 数据索引
     */
    spliceData(state, params) {
      const { name, obj, key } = params
      state[name].splice(key, 1, obj)
      state.addNode = false
    },
    /**
     * [添加节点]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    pushData(state, params) {
      const { name, obj } = params
      obj.forEach(function (item) {
        state[name].push(Object.assign({}, item))
      })
    }
  },

  actions: {
    /**
     * [请求：业务类型]
     */
    A_getBusinessType({ state, dispatch }, { that }) {
      state.codeObj[state.nowCodeType].A_getBusinessType(state, dispatch, that)
    },
    /**
     * [请求：模板数据]
     * @page 非新增页面
     */
    A_getGanttTemplate({ state, dispatch }, { that, node_template_id, type }) {
      state.codeObj[state.nowCodeType].A_getGanttTemplate(state, dispatch, node_template_id, type, that)
    },
    /**
     * [请求：其他下拉选项]
     */
    A_getBusinessTypeData({ state }, { type_id, that }) {
      state.codeObj[state.nowCodeType].A_getBusinessTypeData(state, type_id, that)
    },
    /**
     * [请求：基准值]
     */
    A_getGanttReference({ state }, { node_business_type_id }) {
      state.codeObj[state.nowCodeType].A_getGanttReference(state, node_business_type_id)
    },
    /**
     * [请求：保存]
     */
    A_addOrUpdatee({ state }, params) {
      state.codeObj[state.nowCodeType].A_addOrUpdatee(state, params)
    }
  }
})

export default store
