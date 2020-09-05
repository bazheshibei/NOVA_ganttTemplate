
<!-- 模块：下拉框 -->
<template>
  <div class="comBox">

    <!-- 业务类型 -->
    <div class="selectBox" v-if="pageType !== 'showView'">
      <div class="searchName">{{ywlx.label}}：</div>
      <el-select class="comSelect" ref="ywlx" filterable collapse-tags placeholder="请选择" size="mini"
        v-model="selectShow.ywlx" @change="selectChange"
      >
        <el-option v-for="(val, key) in ywlx.options" :key="'options_' + key" :value="val.label"></el-option>
      </el-select>
    </div>
    <div class="selectBox textBox" v-else>
      {{ywlx.label}}：{{selectShow.ywlx}}
    </div>

    <!-- 其他下拉框 -->
    <div class="selectBox" v-for="(item, index) in [pp, plList, ssxz, ddlx]" :key="'select_' + index" v-if="_arrIncludes(item.index, templsteindex) && pageType !== 'showView'">
      <div class="searchName">{{item.label}}：</div>
      <el-select class="comSelect" :ref="item.index" filterable collapse-tags placeholder="请选择" size="mini"
        v-model="selectShow[item.index]" @change="selectChange($event, item.index)"
      >
        <el-option value="通用"></el-option>
        <el-option v-for="(val, key) in item.options" :key="'options_' + key" :value="val.label"></el-option>
      </el-select>
    </div>
    <div class="selectBox textBox" v-for="(item, index) in [pp, plList, ssxz, ddlx]" :key="'select_' + index" v-if="_arrIncludes(item.index, templsteindex) && pageType === 'showView'">
      {{item.label}}：{{selectShow[item.index] || '通用'}}
    </div>

    <!-- 交货周期 -->
    <div class="selectBox" v-if="_arrIncludes('jhzq', templsteindex) && pageType !== 'showView'">
      <div class="searchName">交货周期：</div>
      <el-input size="mini" v-model="min_lead_time" placeholder="最小天数" @input="input('min_lead_time', $event)" @blur="blur('min_lead_time', $event)"></el-input>
      <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
      <el-input size="mini" v-model="max_lead_time" placeholder="最大天数" @input="input('max_lead_time', $event)" @blur="blur('max_lead_time', $event)"></el-input>
    </div>
    <div class="selectBox textBox" v-if="_arrIncludes('jhzq', templsteindex) && pageType === 'showView'">
      交货周期：{{min_lead_time || 0}}天<span>&nbsp;至&nbsp;</span>{{max_lead_time || 0}}天
    </div>

    <div class="templateBox" v-if="pageType !== 'showView'">
      <div class="templateName">模板名称：</div>
      <el-input size="mini" v-model="templateName" placeholder="请选择业务类型" @change="_saveData('')"></el-input>
    </div>
    <div class="templateBox textBox" v-else>
      模板名称：{{templateName}}
    </div>

  </div>
</template>

<script>
import Tool from './tool.js'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      /* 值 */
      lastShow: { ywlx: '', pp: '通用', pl: '通用', ssxz: '通用', ddlx: '通用' }, //   之前选中的：文字
      lastVal: { ywlx: '', pp: '通用', pl: '通用', ssxz: '通用', ddlx: '通用' }, //    之前选中的：值
      selectShow: { ywlx: '', pp: '通用', pl: '通用', ssxz: '通用', ddlx: '通用' }, // 下拉框：文字
      selectVal: { ywlx: '', pp: '通用', pl: '通用', ssxz: '通用', ddlx: '通用' }, //  下拉框：值
      min_lead_time: '', //                                                         最小天数
      max_lead_time: '', //                                                         最大天数
      templateName: '' //                                                           模板名称
    }
  },
  created() {
    /** 请求：业务类型 **/
    this.$store.dispatch('A_getBusinessType', { that: this })
  },
  computed: {
    ...mapState(['ywlx', 'pp', 'pl', 'ssxz', 'ddlx', 'templsteindex', 'pageType', 'p_type_id', 'nodeList']),
    /**
     * [根据品牌，匹配品类]
     */
    plList() {
      const { pl, selectVal: { pp: id } } = this
      if (id !== '通用') {
        const arr = []
        const { options } = pl
        options.forEach(function (item) {
          if (item.custom_id === id) {
            arr.push(item)
          }
        })
        return { label: '品类', index: 'pl', options: arr }
      } else {
        return { label: '品类', index: 'pl', options: [] }
      }
    }
  },
  methods: {
    /**
     * [下拉框：变化]
     * @param {[String]} val  选项文字
     * @param {[String]} name 选项ID
     */
    selectChange(val, name = 'ywlx') {
      const that = this
      /* 提取 ID */
      const { options } = this[name]
      let nowLabel = '通用' // 当前：文字
      let type_id = '通用' //  当前：选项 ID
      let pId = '' //         当前：父 ID
      for (let i = 0; i < options.length; i++) {
        const { label, value, p_type_id = '' } = options[i]
        if (label === val) {
          nowLabel = label
          type_id = value
          pId = p_type_id
          break
        }
      }

      /* 验证：是否需要重置节点列表 */
      const { nodeList } = this
      const typeId = this.selectVal[name] //                                         之前：选项 ID
      const { p_type_id } = this //                                                  之前：父 ID
      const proving_1 = name === 'ywlx' && p_type_id !== pId && p_type_id !== '' //  切换业务类型 && 父ID有变化 && 非首次选择业务类型
      const proving_2 = name !== 'ywlx' && p_type_id && typeId !== type_id //        切换其他选项 && 有父ID && 选项有变化
      const proving_3 = name === 'ywlx' && typeId !== type_id //                     切换业务类型 && 选项变化
      const proving_4 = nodeList.length //                                           有数据
      if ((proving_1 || proving_2 || proving_3) && proving_4) {
        this.$confirm('切换后需重新添加节点, 是否确定切换?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消' })
          .then(() => {
            /* 切换业务类型时，记录：父ID */
            if (name === 'ywlx') {
              that.$store.commit('saveData', { name: 'p_type_id', obj: pId })
            }
            /* 重置数据 */
            that.$store.commit('saveData', { name: 'nodeList', obj: [] })
            that.$store.commit('saveData', { name: 'tableObj', obj: { asd: [] } })
            that.$store.commit('saveData', { name: 'tableActive', obj: 'asd' })
            /* 收起下拉框 */
            if (name !== 'ywlx') {
              that.$refs[name][0].blur()
            } else {
              that.$refs[name].blur()
            }
            /* 赋值 */
            that.selectVal[name] = type_id
            that.lastVal[name] = type_id
            that.lastShow[name] = nowLabel
            if (name === 'ywlx') {
              /** 请求：其他下拉选项 **/
              that.$store.dispatch('A_getBusinessTypeData', { type_id, that })
            }
            /* 重置 */
            if (name === 'ywlx') {
              /* 切换：业务类型 */
              const obj = { pp: '通用', pl: '通用', ssxz: '通用', ddlx: '通用' }
              that.selectShow = Object.assign({}, that.selectShow, obj)
              that.selectVal = Object.assign({}, that.selectVal, obj)
              that.min_lead_time = ''
              that.max_lead_time = ''
            } else if (name === 'pp') {
              /* 切换：品牌 */
              const obj = { pl: '通用', ssxz: '通用', ddlx: '通用' }
              that.selectShow = Object.assign({}, that.selectShow, obj)
              that.selectVal = Object.assign({}, that.selectVal, obj)
            }
            /* 保存数据：vuex */
            if (name !== 'ywlx') {
              that._saveData('select')
            }
          }).catch(() => {
            if (name !== 'ywlx') {
              that.$refs[name][0].blur()
            } else {
              that.$refs[name].blur()
            }
            that.selectShow[name] = that.lastShow[name]
            that.selectVal[name] = that.lastVal[name]
          })
      } else {
        /* 切换业务类型时，记录：父ID */
        if (name === 'ywlx') {
          that.$store.commit('saveData', { name: 'p_type_id', obj: pId })
        }
        /* 赋值 */
        this.selectVal[name] = type_id
        this.lastVal[name] = type_id
        this.lastShow[name] = nowLabel
        if (name === 'ywlx') {
          /** 请求：其他下拉选项 **/
          this.$store.dispatch('A_getBusinessTypeData', { type_id, that: this })
        }
        /* 重置 */
        if (name === 'ywlx') {
          /* 切换：业务类型 */
          const obj = { pp: '通用', pl: '通用', ssxz: '通用', ddlx: '通用' }
          this.selectShow = Object.assign({}, this.selectShow, obj)
          this.selectVal = Object.assign({}, this.selectVal, obj)
          this.min_lead_time = ''
          this.max_lead_time = ''
        } else if (name === 'pp') {
          /* 切换：品牌 */
          const obj = { pl: '通用', ssxz: '通用', ddlx: '通用' }
          this.selectShow = Object.assign({}, this.selectShow, obj)
          this.selectVal = Object.assign({}, this.selectVal, obj)
        }
        /* 保存数据：vuex */
        if (name !== 'ywlx') {
          this._saveData('select')
        }
      }
    },
    /**
     * [交货周期：输入]
     * @param {[String]} name 属性名
     * @param {[String]} num  数量
     */
    input(name, num) {
      const first = num[0] === '-' ? '-' : ''
      if (num === '' || num === '-') {
        // 不处理 '' 和 '-'
      } else if (isNaN(parseInt(num))) {
        /* 修改：NaN */
        this[name] = first ? '-1' : 1
      } else {
        /* 修改：小数 */
        this[name] = first ? '-1' : parseInt(num)
      }
      /* 保存数据：vuex */
      this._saveData('time')
    },
    /**
     * [交货周期：失焦]
     * @param {[String]} name  属性名
     * @param {[Object]} event 事件
     */
    blur(name, event) {
      const num = event.target.value
      if (num === '' || num === '0') {
        if (this.min_lead_time === '-1' && name === 'max_lead_time') {
          this[name] = '1'
        } else {
          // 输入的空或0，锁死数量0
          this[name] = '-1'
        }
      }
      /* 保存数据：vuex */
      this._saveData('time')
    },
    /**
     * [保存数据：vuex]
     * @param {[String]} type 类型 { select: 下拉框, time: 交货周期 }
     */
    _saveData(type) {
      // console.log(type)
      if (type === 'select') {
        const { selectVal } = this
        this.$store.commit('saveData', { name: 'selectVal', obj: selectVal })
      } else if (type === 'time') {
        const { min_lead_time, max_lead_time } = this
        this.$store.commit('saveData', { name: 'min_lead_time', obj: min_lead_time })
        this.$store.commit('saveData', { name: 'max_lead_time', obj: max_lead_time })
      }
      /* 生成模板名称 */
      Tool.templateName(this, type)
      this.$store.commit('saveData', { name: 'template_name', obj: this.templateName })
    },
    /**
     * [兼容IE11：数组includes]
     * @param  {[String]}  str 关键字
     * @param  {[Array]}   arr 数组
     * @return {[Boolean]}     true || false
     */
    _arrIncludes(str, arr) {
      let status = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
          status = true
        }
      }
      return status
    }
  }
}
</script>

<style scoped>
.comBox {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}

/*** 下拉框部分 ***/
.selectBox { /* 单个组件块 */
  width: 280px;
  font-size: 12px;
  margin: 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.searchName { /* 单个 label */
  width: 80px;
  min-width: 80px;
  text-align: right;
}
.comSelect { /* 下拉框组件 */
  flex: 1;
}

/*** 模板名称 ***/
.templateBox {
  width: 580px;
  font-size: 12px;
  margin: 10px 10px 0;
  display: flex;
  align-items: center;
}
.templateName {
  width: 80px;
  min-width: 80px;
  text-align: right;
}

.textBox { /* 基准值文字容器 */
  width: auto;
  margin-right: 30px;
  justify-content: flex-start;
}
</style>
