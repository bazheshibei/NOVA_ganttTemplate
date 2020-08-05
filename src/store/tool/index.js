
const obj = {}

/**
 * [整理：下拉选项]
 * @param {[Array]} list  属性值
 * @param {[String]} name 属性名
 */
obj.options = function (list, name) {
  const arr = []
  list.forEach(function (item) {
    if (name === 'ywlx') {
      const { type_id: value, type_name: label, p_type_id = '' } = item
      arr.push({ value, label, p_type_id })
    }
    if (name === 'pp') {
      const { custom_id: value, brand_name: label } = item
      arr.push({ value, label })
    }
    if (name === 'pl') {
      const { dress_type_id: value, type_name: label, custom_id } = item
      arr.push({ value, label, custom_id })
    }
    if (name === 'ssxz') {
      const { business_group_id: value, group_name: label } = item
      arr.push({ value, label })
    }
    if (name === 'ddlx') {
      const { dcode: value, dcvalue: label } = item
      arr.push({ value, label })
    }
  })
  return arr
}

/**
 * [表格数据：首次添加节点]
 */
obj.tableFirst = function (state) {
  const { nodeList, tableObj } = state
  const arr = []
  const strArr = []
  nodeList.forEach(function (item, index) {
    item.index = index
    arr.push(item)
    strArr.push(index) // 数据索引
  })
  const str = strArr.join('_')
  tableObj[str] = arr
  state.tableObj = Object.assign({}, tableObj)
  state.tableActive = str
  return arr
}

/**
 * [表格数据：再次添加节点]
 */
obj.tableSecond = function (state) {
  const { tableActive, tableObj, nodeList } = state
  const arr = []
  const strArr = []
  /* 原数据转对象 */
  const obj = {}
  tableObj[tableActive].forEach(function (item) {
    obj[item.node_id] = item
  })
  /* 处理全部数据 */
  let i = 0
  nodeList.forEach(function (item) {
    if (obj[item.node_id]) {
      /* 旧数据 */
      const data = obj[item.node_id]
      data.index = i
      arr.push(data)
      strArr.push(data.key) // 数据索引
      i++
    } else {
      /* 新数据 */
      if (item.is_delete !== 0) {
        item.index = i
        arr.push(item)
        strArr.push(item.key) // 数据索引
        i++
      }
    }
  })
  /* 更新表格 */
  const str = strArr.join('_')
  tableObj[str] = arr
  state.tableObj = Object.assign({}, tableObj)
  state.tableActive = str
  state.addNode = false
  return arr
}

/**
 * [表格数据：删除某行]
 */
obj.tableDelete = function (state) {
  const { tableActive, tableObj, nodeList } = state
  const arr = []
  const strArr = []
  let i = 0
  tableObj[tableActive].forEach(function (item, index) {
    if (nodeList[item.key].is_delete !== 0) {
      item.index = i
      arr.push(item)
      strArr.push(item.key) // 数据索引
      i++
    }
  })
  const str = strArr.join('_')
  tableObj[str] = arr
  state.tableObj = Object.assign({}, tableObj)
  state.tableActive = str
  return arr
}

/**
 * [在数组中查找包含某字段的项]
 * @param {[Object]} text       要查找的文字
 * @param {[Object]} name       查找的属性名
 * @param {[Object]} returnName 返回的属性名
 * @param {[Object]} arr        被查找的数组
 */
obj.findInArr = function ({ text, name, returnName, arr }) {
  const returnData = {}
  for (const x in text) {
    for (let i = 0; i < arr[x].length; i++) {
      const item = arr[x][i]
      if (item[name[x]] === text[x]) {
        returnData[x] = item[returnName[x]]
        break
      }
    }
  }
  return returnData
}

export default obj
