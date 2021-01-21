
import Tool from './tool.js'
import LocalData from '@/localData/data.js'

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
  const res = LocalData['业务类型'] || []
  /* 赋值：业务类型 */
  state.ywlx.options = Tool.options(res, 'ywlx') // 下拉选项
  /* 其他页面：修改、复制新增、查看 */
  const { node_template_id, type } = JSON.parse('{"node_template_id":"8a8a806273ea5f870173eb07f21d000c","type":"update"}')
  if (type) {
    /** 请求：模板数据 **/
    dispatch('A_getGanttTemplate', { that, node_template_id, type })
  }
}

/**
 * [请求：模板数据]
 * @page 非新增页面
 */
Dev.A_getGanttTemplate = function (state, dispatch, node_template_id, type, that) {
  const res = LocalData['模板数据'] || {}
  console.log('甘特表新增模板 ----- ', res)
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
  const arr = { ywlx: state.ywlx.options }
  const { ywlx = {} } = Tool.findInArr({ text, arr })
  const { label = '通用', value = '通用', p_type_id = '' } = ywlx
  state.p_type_id = p_type_id
  state.old_selectShow.ywlx = label
  state.selectVal.ywlx = value
  that.selectShow.ywlx = label
  that.selectVal.ywlx = value
  that.lastVal.ywlx = value
  that.lastShow.ywlx = label
  /* 赋值：节点列表 */
  const { ganttTemplateDetail = [] } = res
  state.nodeList = ganttTemplateDetail.map((item, index) => {
    item.nodeIndex = index
    return item
  })
  /* 请求：其他下拉选项 */
  dispatch('A_getBusinessTypeData', { type_id: value, that })
  /* 请求：基准值 */
  dispatch('A_getGanttReference', { node_business_type_id: value })
}

/**
 * [请求：基准值]
 */
Dev.A_getGanttReference = function (state, node_business_type_id) {
  const res = LocalData['基准值'] || []
  console.log('基准值 ----- ', res)
  const jzz_start = {}
  const jzz_end = {}
  res.forEach(function (item) {
    const { gantt_reference_code = '', gantt_reference_name = '', gantt_reference_type = 1 } = item
    if (gantt_reference_code && gantt_reference_name) {
      if (String(gantt_reference_type) === '1') {
        jzz_start[gantt_reference_code] = gantt_reference_name
      } else {
        jzz_end[gantt_reference_code] = gantt_reference_name
      }
    }
  })
  state.jzz_start = jzz_start
  state.jzz_end = jzz_end
}

/**
 * [请求：其他下拉选项]
 */
Dev.A_getBusinessTypeData = function (state, type_id, that) {
  const res = LocalData['其他选项'] || {}
  /* ----- 默认操作 ----- */
  /* 展示哪些选项 */
  state.templsteindex = res.templsteindex ? res.templsteindex : []
  /* 提取数据 */
  const arr = ['pp', 'pl', 'ssxz', 'ddlx', 'xmlx']
  arr.forEach(function (item) {
    if (item === 'xmlx') {
      state[item].options = [{ value: 1, label: '客户提供' }, { value: 2, label: '自主开发' }, { value: 3, label: '设计项目' }]
    } else if (res[item] && res[item].length) {
      /* 接口返回值：有 */
      state[item].options = Tool.options(res[item], item) // 其他数据：直接提取
    } else {
      /* 接口返回值：无 */
      state[item].options = []
    }
  })
  /* ----- 非新增页面 ----- */
  const { pageType, isRequestTemplateData, is_copy } = state
  if (pageType && (isRequestTemplateData || is_copy)) {
    /* 赋值：品牌、品类、所属小组、订单类型 */
    const { custom_id, dress_type_id, business_group_id, order_type, design_source } = state.templateData
    const text = { pp: custom_id, pl: dress_type_id, ssxz: business_group_id, ddlx: order_type, xmlx: design_source }
    const arr = { pp: state.pp.options, pl: state.pl.options, ssxz: state.ssxz.options, ddlx: state.ddlx.options, xmlx: state.xmlx.options }
    const { pp = {}, pl = {}, ssxz = {}, ddlx = {}, xmlx = {} } = Tool.findInArr({ text, arr })
    const forData = { pp, pl, ssxz, ddlx, xmlx }
    for (const x in forData) {
      const item = forData[x]
      const { label = '通用', value = '通用' } = item
      state.old_selectShow[x] = label
      state.selectVal[x] = value
      that.selectShow[x] = label
      that.selectVal[x] = value
      that.lastVal[x] = value
      that.lastShow[x] = label
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
    const { templateData: { template_name }, node_template_remark } = state
    that.templateName = node_template_remark ? template_name + ' ' + node_template_remark : template_name
    that.node_template_remark = node_template_remark
    state.template_name = node_template_remark ? template_name + ' ' + node_template_remark : template_name
    state.node_template_remark = node_template_remark
    /* 禁止再次请求 */
    state.isRequestTemplateData = false
  }
  /* ----- 重新计算表格高度 ----- */
  setTimeout(function () {
    state.isCountTableHeight = true
  }, 0)
}

/**
 * [请求：保存]
 */
Dev.A_addOrUpdatee = function (state, params) {
  console.log('保存 ----- obj', params.obj)
}

export default Dev
