
import Tool from './tool.js'

/**
 * 本地开发代码
 * @ [调用本地数据]
 * @ [不请求接口]
 */
const Dev = {}

/**
 * [请求：业务类型]
 */
Dev.A_getBusinessType = function (state, dispatch, that) {
  const res = JSON.parse(localStorage.getItem('业务类型'))
  /* 赋值：业务类型 */
  state.ywlx.options = Tool.options(res, 'ywlx') // 下拉选项
  /* 其他页面：修改、复制新增、查看 */
  const { node_template_id, type } = JSON.parse('{"node_template_id":"8a8a806273ea5f870173eb07f21d000c","type":"addCopy"}')
  if (type) {
    /** 请求：模板数据 **/
    dispatch('A_getGanttTemplate', { that, node_template_id, type })
  }
}

/**
 * [请求：模板数据]
 * @page 非新增页面
 */
Dev.A_getGanttTemplate = function (state, node_template_id, type, that) {
  const res = JSON.parse(localStorage.getItem('甘特表新增模板'))
  //
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

/**
 * [请求：其他下拉选项]
 */
Dev.A_getBusinessTypeData = function (state, type_id, that) {
  const res = JSON.parse(localStorage.getItem('其他下拉选项'))
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

/**
 * [请求：保存]
 */
Dev.A_addOrUpdatee = function (state, params) {
  console.log('保存 ----- obj', params.obj)
}

export default Dev
