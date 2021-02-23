
const Tool = {}

/**
 * [排序]
 * @param {[Array]} nodeList 节点列表
 */
Tool.sort = function (nodeList) {
  const showArr = []
  let i = 1
  /* ----- 初始化 ----- */
  nodeList.forEach(function (item, index) {
    if (item.is_delete !== 0) {
      item.node_number = item.node_number ? parseInt(item.node_number) : i
      showArr.push(Object.assign({}, item))
      i++
    }
  })
  /* ----- 调整单个位置 ----- */
  const arr = showArr.sort(function (val1, val2) {
    if (val1.is_delete !== 0 && val2.is_delete !== 0) {
      if (val1.node_number < val2.node_number) {
        return -1
      } else if (val1.node_number > val2.node_number) {
        return 1
      } else {
        return 0
      }
    }
  })
  return arr
}

/**
 * [整理：下拉选项]
 * @param {[Array]} list  属性值
 * @param {[String]} name 属性名
 */
Tool.options = function (list, name) {
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
 * [在数组中查找包含某字段的项]
 * @param {[Object]} text 要查找的文字
 * @param {[Object]} arr  被查找的数组
 */
Tool.findInArr = function ({ text, arr }) {
  const returnData = {}
  for (const x in text) {
    for (let i = 0; i < arr[x].length; i++) {
      const item = arr[x][i]
      if (item.value === text[x]) {
        returnData[x] = item
        break
      }
    }
  }
  return returnData
}

// /**
//  * [在数组中查找包含某字段的项]
//  * @param {[Object]} text       要查找的文字
//  * @param {[Object]} name       查找的属性名
//  * @param {[Object]} returnName 返回的属性名
//  * @param {[Object]} arr        被查找的数组
//  */
// Tool.findInArr = function ({ text, name, returnName, arr }) {
//   const returnData = {}
//   for (const x in text) {
//     for (let i = 0; i < arr[x].length; i++) {
//       const item = arr[x][i]
//       if (item[name[x]] === text[x]) {
//         returnData[x] = item[returnName[x]]
//         break
//       }
//     }
//   }
//   return returnData
// }

export default Tool
