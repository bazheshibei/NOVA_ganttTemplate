
<!-- 自定义统计 -->

<template>
  <div class="pageBox" v-on:scroll="pageScroll" ref="page" v-loading="loadingText === '加载业务类型中...'" :element-loading-text="loadingText">

    <!-- 下拉框 -->
    <com-select ref="select"></com-select>

    <!-- 设置结点 -->
    <com-set ref="set"></com-set>

    <!-- 表格 -->
    <com-table :style="tableStyle"></com-table>

  </div>
</template>

<script>
import { mapState } from 'vuex'
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

    try {
      /* 平台方法 */
      // eslint-disable-next-line
      dg.removeBtn('cancel')
      // eslint-disable-next-line
      dg.removeBtn('saveAndAdd')
      // eslint-disable-next-line
      dg.removeBtn('saveAndClose')
      // eslint-disable-next-line
      dg.removeBtn('saveNoClose')
    } catch (err) {
      //
    }
  },
  computed: {
    ...mapState(['loadingText'])
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
