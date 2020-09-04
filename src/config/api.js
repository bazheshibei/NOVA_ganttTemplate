// 接口

import Axios from '@/config/axios'

/**
 * [服务器地址]
 */
// const host = '/api/'
const host = window.location.origin + '/nova/'

/**
 * [接口地址]
 */
const url = {
  '模板数据': 'ganttTemplateShowAction.ndo?action=getGanttTemplate',
  '业务类型': 'nodeBusinessTypeShowAction.ndo?action=getBusinessType',
  '其他下拉选项': 'ganttTemplateShowAction.ndo?action=getBusinessTypeData',
  '保存': 'ganttTemplateSaveAction.ndo?action=addOrUpdatee'
}

const request = function (param) {
  param.path = host + url[param.name]
  Axios(param)
}

export default request
