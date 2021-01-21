
import Ywlx from './data_ywlx.js' // 业务类型
import Qtxx from './data_qtxx.js' // 其他选项
import Mbsj from './data_mbsj.js' // 模板数据
import Jzz from './data_jzz.js' //   基准值

/* 修改：从本地获取 */
// ganttTemplateAddOrUpdate
// {"node_template_id":"8a8a806273ea5f870173eb07f21d000c","type":"update"} // type: update: 修改, addCopy: 复制新增, showView: 查看

const data = Object.assign({}, Ywlx, Qtxx, Mbsj, Jzz)

export default data
