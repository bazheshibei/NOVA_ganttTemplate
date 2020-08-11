// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/config/api'
import Tool from './tool.js'
import { Loading } from 'element-ui'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {},

  state: {
    p_type_id: '', // 父 ID
    isCountTableHeight: false, //   是否重新计算表格高度 [请求其他下拉选项 后 触发]
    /* 页面信息 */
    node_template_id: '', //        模板 ID
    pageType: '', //                页面类型 { update: 修改, addCopy: 复制新增, showView: 查看 }
    templateData: {}, //            模板页面数据
    isRequestTemplateData: true, // 是否可以请求模板数据
    /* 下拉框 */
    ywlx: { label: '业务类型', index: 'ywlx', options: [] }, // 业务类型
    pp: { label: '品牌', index: 'pp', options: [] },
    pl: { label: '品类', index: 'pl', options: [] },
    ssxz: { label: '所属小组', index: 'ssxz', options: [] },
    ddlx: { label: '订单类型', index: 'ddlx', options: [] },
    templsteindex: [], // 展示哪些选项
    /* 设置结点 */
    addNode: false, // 是否添加节点
    nodeList: [], //   节点列表
    /* 表格 */
    tableObj: { asd: [] }, // 表格数组
    tableActive: 'asd', //    当前应渲染的表格
    /* 提交 */
    selectVal: {}, //         下拉框选项
    min_lead_time: '', //     交货周期：最小天数
    max_lead_time: '', //     交货周期：最大天数
    template_name: '' //      模板名称
  },

  getters: {
    /**
     * [表格数据]
     */
    tableData: (state, getter) => {
      const { tableObj, nodeList, addNode } = state
      if (nodeList.length) {
        if (Object.keys(tableObj).length === 1) {
          /** 首次添加节点 **/
          return Tool.tableFirst(state)
        } else if (addNode) {
          /** 再次添加节点 **/
          return Tool.tableSecond(state)
        } else {
          /** 删除某行 **/
          return Tool.tableDelete(state)
        }
      } else {
        return []
      }
    }
  },

  mutations: {
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
        state[name].push(item)
      })
    }
  },

  actions: {
    /**
     * [请求：业务类型]
     */
    A_getBusinessType({ state, dispatch }, { that }) {
      const name = '业务类型'
      const obj = {}
      const suc = function (res) {
        /* 赋值：业务类型 */
        state.ywlx.options = Tool.options(res, 'ywlx')
        /* 其他页面：修改、复制新增、查看 */
        const { node_template_id, type } = JSON.parse(localStorage.getItem('ganttTemplateAddOrUpdate')) || {}
        if (type) {
          // ganttTemplateAddOrUpdate
          // {"node_template_id":"8a8a80627272706201727283a5730000","type":"update"}
          localStorage.removeItem('ganttTemplateAddOrUpdate')
          /** 请求：模板数据 **/
          dispatch('A_getGanttTemplate', { that, node_template_id, type })
        }
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：其他下拉选项]
     */
    A_getBusinessTypeData({ state }, { type_id, that }) {
      /* 请求 */
      const name = '其他下拉选项'
      const obj = { type_id }
      const suc = function (res) {
        /* ----- 默认操作 ----- */
        /* 展示哪些选项 */
        state.templsteindex = res.templsteindex ? res.templsteindex : []
        /* 提取数据 */
        const arr = ['pp', 'pl', 'ssxz', 'ddlx']
        arr.forEach(function (item) {
          if (res[item] && res[item].length) {
            /* 接口返回值：有 */
            state[item].options = Tool.options(res[item], item) // 其他数据：直接提取
          } else {
            /* 接口返回值：无 */
            state[item].options = []
          }
        })
        /* 保存数据：vuex */
        that._saveData('select')
        /* 重新计算表格高度：新增 */
        if (!state.pageType) {
          setTimeout(function () {
            state.isCountTableHeight = true
          }, 0)
        }
        /* ----- 非新增页面 ----- */
        const { pageType, isRequestTemplateData } = state
        if (pageType && isRequestTemplateData) {
          // console.log('模板数据 ----- ', state.templateData)
          /* 赋值：品牌、品类、所属小组、订单类型 */
          const { custom_id, dress_type_id, business_group_id, order_type } = state.templateData
          const text = { pp: custom_id, pl: dress_type_id, ssxz: business_group_id, ddlx: order_type }
          const name = { pp: 'value', pl: 'value', ssxz: 'value', ddlx: 'value' }
          const returnName = { pp: 'label', pl: 'label', ssxz: 'label', ddlx: 'label' }
          const arr = { pp: state.pp.options, pl: state.pl.options, ssxz: state.ssxz.options, ddlx: state.ddlx.options }
          const { pp = '通用', pl = '通用', ssxz = '通用', ddlx = '通用' } = Tool.findInArr({ text, name, returnName, arr })
          const forData = { pp, pl, ssxz, ddlx }
          for (const x in forData) {
            that.selectChange(forData[x], x) // 下拉框：变化
            that.selectShow[x] = forData[x]
          }
          /* 赋值：交货周期 */
          const { min_lead_time, max_lead_time } = state.templateData
          that.min_lead_time = min_lead_time
          that.max_lead_time = max_lead_time
          state.min_lead_time = min_lead_time
          state.max_lead_time = max_lead_time
          /* 赋值：模板名称 */
          setTimeout(function () {
            const { template_name } = state.templateData
            that.templateName = template_name
            state.template_name = template_name
            state.isCountTableHeight = true
          }, 0)
          /* 禁止再次请求 */
          state.isRequestTemplateData = false
        }
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：模板数据]
     * @page 非新增页面
     */
    A_getGanttTemplate({ state }, { that, node_template_id, type }) {
      /* 请求 */
      const name = '模板数据'
      const obj = { node_template_id }
      const suc = function (res) {
        state.node_template_id = node_template_id
        state.pageType = type
        /* 添加页面需要的属性 */
        if (res !== null) {
          res.ganttTemplateDetail.map(function (item, index) {
            item.key = index
            item.badge = []
            item.badgeText = []
            if (item.is_core_node === 1) {
              item.badge.push('is_core_node')
              item.badgeText.push('核心节点')
            }
            if (item.is_audit_follow === 1) {
              item.badge.push('is_audit_follow')
              item.badgeText.push('审核关注')
            }
            return item
          })
          state.templateData = res
        }
        /* 赋值：业务类型 */
        const text = { ywlx: res.node_business_type_id }
        const name = { ywlx: 'value' }
        const returnName = { ywlx: 'label' }
        const arr = { ywlx: state.ywlx.options }
        const { ywlx } = Tool.findInArr({ text, name, returnName, arr })
        that.selectChange(ywlx) // 下拉框：变化
        that.selectShow.ywlx = ywlx
        /* 赋值：节点列表 */
        state.nodeList = res.ganttTemplateDetail
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：保存]
     */
    A_addOrUpdatee({ state }, params) {
      const loadingInstance = Loading.service({})
      const name = '保存'
      const method = 'post'
      const obj = params.obj
      const suc = function (res) {
        loadingInstance.close()
        // eslint-disable-next-line
        dg.close()
      }
      Api({ name, obj, suc, method })
    }
  }
})

export default store
