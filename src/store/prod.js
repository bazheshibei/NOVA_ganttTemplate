
import Api from '@/config/api'
import Tool from './tool.js'
import { Loading } from 'element-ui'

/**
 * 生产环境代码
 */
const Prod = {}

/**
 * [请求：业务类型]
 */
Prod.A_getBusinessType = function (state, dispatch, that) {
  /** 请求 **/
  const name = '业务类型'
  const obj = {}
  const suc = function (res) {
    /* 赋值：业务类型 */
    state.ywlx.options = Tool.options(res, 'ywlx')
    /* 其他页面：修改、复制新增、查看 */
    const { local: { node_template_id, type } } = state
    if (type) {
      // ganttTemplateAddOrUpdate
      // {"node_template_id":"2c915e107433e34601743813791a0000","type":"addCopy"}
      localStorage.removeItem('ganttTemplateAddOrUpdate')
      /** 请求：模板数据 **/
      dispatch('A_getGanttTemplate', { that, node_template_id, type })
    }
  }
  Api({ name, obj, suc, loading: '请求数据中...' })
}

/**
 * [请求：模板数据]
 * @page 非新增页面
 */
Prod.A_getGanttTemplate = function (state, node_template_id, type, that) {
  /* 请求 */
  const name = '模板数据'
  const obj = { node_template_id }
  const suc = function (res) {
    // localStorage.setItem('甘特表新增模板', JSON.stringify(res))
    state.node_template_id = node_template_id
    state.pageType = type
    /* 添加页面需要的属性 */
    if (res !== null) {
      res.ganttTemplateDetail.map(function (item, index) {
        item.is_delete = 1
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
    state.old_selectShow.ywlx = ywlx
    /* 赋值：节点列表 */
    state.nodeList = res.ganttTemplateDetail
  }
  Api({ name, obj, suc, loading: '请求数据中...' })
}

/**
 * [请求：其他下拉选项]
 */
Prod.A_getBusinessTypeData = function (state, type_id, that) {
  /* 请求 */
  const name = '其他下拉选项'
  const obj = { type_id }
  const suc = function (res) {
    // localStorage.setItem('其他下拉选项', JSON.stringify(res))
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
    const { pageType, isRequestTemplateData, is_copy } = state
    if (pageType && (isRequestTemplateData || is_copy)) {
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
        state.old_selectShow[x] = forData[x]
      }
      /* 赋值：交货周期 */
      const { min_lead_time, max_lead_time } = state.templateData
      that.min_lead_time = min_lead_time
      that.max_lead_time = max_lead_time
      state.min_lead_time = min_lead_time
      state.max_lead_time = max_lead_time
      state.old_min_lead_time = min_lead_time
      state.old_max_lead_time = max_lead_time
      /* 赋值：模板名称 */
      setTimeout(function () {
        const { templateData: { template_name }, node_template_remark } = state
        that.templateName = node_template_remark ? template_name + ' ' + node_template_remark : template_name
        that.node_template_remark = node_template_remark
        state.template_name = node_template_remark ? template_name + ' ' + node_template_remark : template_name
        state.node_template_remark = node_template_remark
        state.isCountTableHeight = true
      }, 0)
      /* 禁止再次请求 */
      state.isRequestTemplateData = false
    }
  }
  Api({ name, obj, suc })
}

/**
 * [请求：保存]
 */
Prod.A_addOrUpdatee = function (state, params) {
  const name = '保存'
  const method = 'post'
  const obj = params.obj
  const suc = function (res) {
    const loading = Loading.service({ text: '保存成功', spinner: 'el-icon-circle-check' })
    setTimeout(() => {
      loading.close()
      // eslint-disable-next-line
      dg.close()
    }, 1000)
  }
  Api({ name, obj, suc, method, loading: '保存中...' })
}

export default Prod
