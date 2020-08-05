
<!-- 自定义统计 -->

<template>
  <div class="pageBox" v-on:scroll="pageScroll" ref="page">

    <!-- 下拉框 -->
    <com-select ref="select"></com-select>

    <!-- 设置结点 -->
    <com-set ref="set"></com-set>

    <!-- 表格 -->
    <com-table :style="tableStyle"></com-table>

  </div>
</template>

<script>
import ComSelect from './components/select.vue' // 下拉框
import ComSet from './components/set.vue' //       设置结点
import ComTable from './components/table.vue' //   表格
export default {
  components: { ComSelect, ComSet, ComTable },
  data() {
    return {
      tableStyle: {},
      scrollTop: 0
    }
  },
  created() {
    /** 计算：表格高度 **/
    this._countHeight()

    /* 平台方法 */
    // eslint-disable-next-line
    dg.removeBtn('cancel')
    // eslint-disable-next-line
    dg.removeBtn('saveAndAdd')
    // eslint-disable-next-line
    dg.removeBtn('saveAndClose')
    // eslint-disable-next-line
    dg.removeBtn('saveNoClose')
  },
  watch: {
    '$store.state.isCountTableHeight'() {
      if (this.$store.state.isCountTableHeight) {
        /** 计算：表格高度 **/
        this._countHeight()
      }
    }
  },
  methods: {
    /**
     * [计算：表格高度]
     */
    _countHeight() {
      const that = this
      let i = 0
      const timer = setInterval(function () {
        if (Object.keys(that.$refs).length) {
          const { page, select, set } = that.$refs
          if (page.clientHeight && select.$el && select.$el.clientHeight && set.$el && set.$el.clientHeight) {
            const num = page.clientHeight - select.$el.clientHeight - set.$el.clientHeight - 10
            that.tableStyle = { height: num + 'px' }
            clearInterval(timer)
          }
        }
        if (i > 100) {
          clearInterval(timer)
        }
        i++
      }, 100)
    },
    /**
     * [页面滚动事件]
     */
    pageScroll(event) {
      const newNum = event.target.scrollTop
      const oldNum = this.scrollTop
      if (Math.abs(newNum - oldNum) < 300) {
        this.scrollTop = event.target.scrollTop
        this.$refs.page.scrollTop = newNum
      } else {
        this.$refs.page.scrollTop = oldNum
      }
    }
  }
}
</script>

<style scoped>
.pageBox {
  width: 100%;
  height: 100%;
  font-size: 12px;
  background: #ffffff;
  overflow-y: auto;
}
</style>

<style>
/*** 模块刷新 ***/
.f5 {
  color: #909399;
  cursor: pointer;
  padding: 0 6px;
}

/*** 表格字体 ***/
.el-table {
  font-size: 12px !important;
}
/*** 重置表头单元格 ***/
.el-table > div th, .el-table > div th > .cell {
  padding: 0 !important;
}
.el-table > div th > .cell .thText {
  padding: 5px 10px;
}
th > .cell, th > .cell .thText {
  text-align: center;
}
/*** 表头输入内容 ***/
.thActive {
  color: #000000 !important;
  /* color: #ffffff;
  background: #409EFF; */
}
/*** 单元格 ***/
td {
  padding: 0 !important;
}
.cell p {
  line-height: 16px !important;
  margin: 4px 0 !important;
}
td > .cell {
  text-align: center;
}

/*** 搜索 ***/
.el-popover {
  padding: 6px;
}
.el-popover > div > input {
  height: 26px;
  font-size: 12px !important;
  display: flex;
  align-items: center;
}
.el-popover > div > .el-input__suffix { /* input 中删除按钮 */
  margin-top: -6px;
}

/*** 分页 ***/
.comPagination {
  padding: 0;
}
.comPagination > .el-pagination__sizes { /* 总条数 */
  margin: 0 0 0 30px;
}
.comPagination > .el-pagination__sizes > .el-select > .el-input--suffix { /* 总条数 */
  margin-right: 0;
}
</style>
