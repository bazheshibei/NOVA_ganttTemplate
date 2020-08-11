
const obj = {}

/**
 * [生成：模板名称]
 * @param {[String]} type select || time
 */
obj.templateName = function (that, type = '') {
  /** 验证：模板名称 **/
  const { selectShow, min_lead_time, max_lead_time, pp, pl, ssxz, ddlx } = that
  const templateNameArr = [`【${selectShow.ywlx}】`]
  if (selectShow.ywlx && type) {
    /* 提取值 */
    for (const x in selectShow) {
      if (x !== 'ywlx' && selectShow[x]) {
        if (x === 'pp' && pp.options.length) {
          templateNameArr.push(selectShow[x])
        }
        if (x === 'pl' && pl.options.length) {
          templateNameArr.push(selectShow[x])
        }
        if (x === 'ssxz' && ssxz.options.length) {
          templateNameArr.push(selectShow[x])
        }
        if (x === 'ddlx' && ddlx.options.length) {
          templateNameArr.push(selectShow[x])
        }
      }
    }
    /* 时间区间 */
    if (min_lead_time !== '' && max_lead_time !== '') {
      if (min_lead_time === '-1') {
        templateNameArr.push(`小于${max_lead_time}天`)
      } else if (max_lead_time === '-1') {
        templateNameArr.push(`大于${min_lead_time}天`)
      } else {
        templateNameArr.push(`${min_lead_time}至${max_lead_time}天`)
      }
    }
    /* 表尾 */
    templateNameArr.push('甘特表模板')
    that.templateName = templateNameArr.join(' ')
  }
}

/**
 * [验证：是否打开新页面]
 * @param {[String]} str 输入值
 */
obj.windowOpen = function (str) {
  if (str.indexOf('http://') === -1) {
    return true
  } else {
    return false
  }
}

/**
 * [验证：节点编码是否存在]
 * @param {[String]} key  位置：第几行系统计算公式
 * @param {[String]} str  输入值
 * @param {[Object]} that this 对象
 */
obj.includes = function (key, str, that) {
  const codeObj = {} //                                  用到哪些节点编码
  const strArr = str.match(/\$\{[\w-_:/]+\}/g) || [] // 提取数组：变量
  if (strArr.length) {
    /** ----- 有节点编码 ----- **/
    /* 提取数组：节点编码 */
    const codeArr = strArr.map(function (item) {
      const code = item.slice(2, -1)
      codeObj[code] = true
      return code
    })
    /* 验证数组：节点编码 */
    const { arrCode } = that // 页面数据：全部节点
    const messageArr = [] //    暂存数据：未知节点
    codeArr.forEach(function (item) {
      if (!arrCode[item]) {
        messageArr.push(item)
      }
    })
    if (messageArr.length) {
      /* 提示报错 */
      that.$notify.error({ title: `${key}`, message: `${messageArr.join('、 ')}是未知编码，请确认后再输入` })
      return false
    } else {
      /* 记录：用到哪些节点编码 */
      that.codeObj = Object.assign({}, that.codeObj, codeObj)
      return true
    }
  } else {
    /** ----- 无节点编码 ----- **/
    /* 提示报错 */
    that.$notify.error({ title: `${key}`, message: `无节点编码，请确认后再输入` })
    return false
  }
}

/**
 * [验证：是否引用自身]
 * @param {[String]} key  位置：第几行系统计算公式
 * @param {[String]} str  输入值
 * @param {[String]} code 当前行的节点编码
 * @param {[Object]} that this 对象
 */
obj.useSelf = function (key, str, code, that) {
  const strArr = str.match(/\$\{[\w-_:/]+\}/g) || [] // 提取数组：变量
  const { inputCode } = that
  const arrObj = {}
  const obj = {}
  let status = true
  strArr.forEach(function (item) {
    if (item.slice(2, -1) === code) {
      status = false
    } else {
      obj[item.slice(2, -1)] = true
    }
  })
  if (status) {
    /* 记录：当前节点引用了哪些节点 */
    inputCode[code] = Object.assign({}, arrObj, obj)
    that.inputCode = Object.assign({}, inputCode)
    return true
  } else {
    /* 提示报错 */
    that.$notify.error({ title: `${key}`, message: `引用了自身节点，请重新输入` })
    return false
  }
}

/**
 * [验证：是否互相引用]
 * @param {[String]} key  位置：第几行系统计算公式
 * @param {[String]} str  输入值
 * @param {[String]} code 当前行的节点编码
 * @param {[Object]} that this 对象
 */
obj.eachOther = function (key, str, code, that) {
  const strArr = str.match(/\$\{[\w-_:/]+\}/g) || [] // 提取数组：变量
  const { inputCode } = that
  let status = true
  strArr.forEach(function (item) {
    if (item.slice(2, -1) !== code) {
      if (inputCode[item.slice(2, -1)] && inputCode[item.slice(2, -1)][code]) {
        status = false
      }
    }
  })
  if (status) {
    return true
  } else {
    /* 提示报错 */
    that.$notify.error({ title: `${key}`, message: `有互相引用的节点，请重新输入` })
    return false
  }
}

/**
 * [验证：公式是否能计算]
 * @param {[String]} key 位置：第几行系统计算公式
 * @param {[String]} str 输入值  // Math.max(${DH-XMCJ},${DH-XMCJ})+5-4*2/3
 * @param {[Object]} that this 对象
 */
obj.math = function (key, str, that) {
  /* 替换值 */
  // eslint-disable-next-line
  const strReplace = str.replace(/[0-9]+/g, function (item) {
    return parseInt(item) * 60 * 60 * 24 * 1000
    // Math.max(${DH-XMCJ},${DH-XMCJ})+432000000-345600000*172800000/259200000
  }).replace(/\$\{[\w-_:/]+\}/g, function (item, index) {
    return new Date().getTime() + index * 60 * 60 * 24 * 1000
    // Math.max(1590652727106,1591603127106)+432000000-345600000*172800000/259200000
  })
  /* 运行公式 */
  try {
    // eslint-disable-next-line
    const result = eval(strReplace)
    return true
  } catch (err) {
    setTimeout(function () {
      that.$notify.error({ title: `${key}`, message: '公式有误，请确认后再输入' })
    }, 0)
    return false
  }
}

/**
 * [验证：提交]
 */
obj.submit = function (that) {
  const problemArr = [] // 问题数组

  /** 验证：模板名称 **/
  const { selectVal, min_lead_time, max_lead_time, template_name } = that.$store.state
  const templateObj = { node_business_type_id: '', custom_id: '', dress_type_id: '', business_group_id: '', order_type: '', min_lead_time, max_lead_time, template_name }
  if (template_name && selectVal['ywlx']) {
    const word = { ywlx: 'node_business_type_id', pp: 'custom_id', pl: 'dress_type_id', ssxz: 'business_group_id', ddlx: 'order_type' } // 对应的数据库字段
    for (const x in selectVal) {
      templateObj[word[x]] = selectVal[x] === '通用' ? '' : selectVal[x]
    }
  }
  if (!selectVal['ywlx']) {
    problemArr.push('请选择业务类型')
  }
  if (!template_name) {
    problemArr.push('请选择填写模板名称')
  }

  /** 验证：表格 **/
  const { tableData, inputStatus, nodeList } = that
  const tableArr = []
  /* 提取：提交数据 */
  const { codeObj } = that // 用到的节点
  if (tableData.length) {
    tableData.forEach(function (item, index) {
      nodeList[item.key] = item
    })
  } else {
    problemArr.push(`请添加节点后再保存`)
  }
  nodeList.forEach(function (item, index) {
    if (item.sys_clac_formula || item.is_delete === 0 || parseInt(item.submit_type) === 2) {
      item.is_delete = item.is_delete === 0 ? item.is_delete : 1 // 是否删除
      /* 拆分：节点标识 */
      item.is_core_node = 0 //                                      核心节点
      item.is_audit_follow = 0 //                                   审核关注
      item.badge.forEach(function (val) {
        item[val] = 1
      })
      /* 删除：【用户提报】 状态下的 [系统计算公式, 验证状态] */
      if (parseInt(item.submit_type) === 2) {
        item.sys_clac_formula = ''
        inputStatus[`第${index + 1}行_系统计算公式`] = true
      }
      /* 删除：【删除】 状态下的 [系统计算公式, 验证状态] */
      if (item.is_delete === 0) {
        item.sys_clac_formula = ''
        inputStatus[`第${index + 1}行_系统计算公式`] = true
      }
      /* 提取：字段 */
      const { sys_clac_formula, is_audit_follow, is_core_node, max_section_value, min_section_value, node_code, node_id, node_detail, node_ierarchy, node_name, verification_remark, is_delete, node_template_detail_id } = item
      const submit_type = parseInt(item.submit_type)
      const obj = { sys_clac_formula, is_audit_follow, is_core_node, max_section_value, min_section_value, node_code, node_id, node_detail, node_ierarchy, node_name, verification_remark, submit_type, is_delete }
      if (that.$store.state.pageType === 'update') {
        obj.node_template_detail_id = node_template_detail_id
      }
      /* 是否：用到 */
      if (codeObj[item.node_code] === true) {
        obj.is_quote = 1
      } else {
        obj.is_quote = 0
      }
      tableArr.push(obj)
    } else {
      problemArr.push(`请填写第${index + 1}行_系统计算公式`)
    }
  })
  if (!tableArr.length) {
    problemArr.push(`请添加节点后再保存`)
  }
  /* 提取：报错信息 */
  for (const x in inputStatus) {
    if (inputStatus[x] === false) {
      problemArr.push(x + '输入错误')
    }
  }
  return [templateObj, problemArr, tableArr]
}

export default obj
