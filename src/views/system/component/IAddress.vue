<template>
  <i-dialog :title="title" v-model="visible" width="820" height="600" closable :resizeable="resizeable" :dragable="dragable" @cancel="calcelEdit" :maskClosable="maskClosable" :mask="mask" :maskStyle="maskStyle">
    <!--待选内容-->
    <div class="address_unselect">
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="角色" key="4">
          <div class="unSelectedContent">
            <ul class="address_selected_content_ul">
              <li>
                集团管理员
              </li>
            </ul>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="机构" key="1">
          <a-row class="searchRow">
            <a-col :span="24">
              <a-input-search
                placeholder="输入机构名称搜索"
                style="width: 100%"
                v-model="orgUnitName"
              />
            </a-col>
          </a-row>
          <a-row>
            <a-tree
              :treeData="treeData"
              showLine
              v-model="checkedKeys"
              checkStrictly
              checkable="multiSelect"
              multiple="multiSelect"
              @check="treeCheckBoxClick"
            >
            </a-tree>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="部门" key="2">
          <a-row class="searchRow">
            <a-col :span="10">
              <a-tree-select
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder='请选择组织维度'
                treeDefaultExpandAll
                v-model="orgDepartmentUnitId"
              >
              </a-tree-select>
            </a-col>
            <a-col :span="14">
              <a-input-search
                placeholder="输入部门名称搜索"
                style="width: 100%"
                v-model="orgDepartmentSearchName"
              />
            </a-col>
          </a-row>
          <a-row>
            <a-tree
              :treeData="treeData"
              showLine
              v-model="checkedKeys"
              checkStrictly
              checkable="multiSelect"
              multiple="multiSelect"
              @select="treeLabelClick"
              @check="treeCheckBoxClick"
            >
            </a-tree>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="人员" key="3" forceRender>人员内容</a-tab-pane>
      </a-tabs>
    </div>
    <div class="address_switch">
        <div class="icon_switch">
          <div style="width: 100%;height: 25px;">
            <a-icon type="plus"/>
          </div>
          <div style="width: 100%;height: 25px;">
            <a-icon type="plus"/>
          </div>
        </div>
    </div>
    <!--已选内容-->
    <div class="address_selected">
      <div class="address_selected_search">
        <a-input-search
          placeholder="输入名称搜索"
          style="width: 100%"
          v-model="selectedName"
        />
      </div>
      <div class="address_selected_content">
        <ul class="address_selected_content_ul">
          <li v-for="(item) in selectedData" @dblclick="removeFromSelected(item.value)">{{item.text}}</li>
        </ul>
      </div>
    </div>
  </i-dialog>
</template>

<script>
import { ISectionHeader } from '@/views/system/component'
import IDialog from '@/views/ivan/components/dialog/dialog'
import ACol from 'ant-design-vue/es/grid/Col'
import { orgUnitTree } from '@/api/org/orgUnitApi'
export default {
  props: {
    // 是否多选
    multiSelect: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ACol,
    IDialog,
    ISectionHeader,
    orgUnitTree
  },
  data () {
    return {
      title: '部门信息选择',
      size: 'default',
      orgDepartmentUnitId: undefined,
      orgDepartmentSearchName: '',
      selectedName: '',
      resizeable: true,
      visible: false,
      confirmLoading: false,
      treeData: null,
      // 已选择的数据
      selectedData: [],
      // 机构页签中名称搜索
      orgUnitName: ''
    }
  },
  created () {
    // 获取机构下拉数据
    orgUnitTree().then(res => {
      this.treeData = res.result
    })
    // 获取角色数据
  },
  // 计算属性
  computed: {
    // 默认选中的树节点，因为系统已有选中数据，此处为了统一已选内容，所以采用此种方式
    checkedKeys: function () {
      const selectedKeys = []
      this.selectedData.forEach(selectData => {
        selectedKeys.push(selectData.value.toString())
      })
      selectedKeys.push('123321')
      return selectedKeys
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleCancel () {
      this.visible = false
    },
    callback (key) {
      console.log(key)
    },
    treeLabelClick (checkedKeys, event) {
      return false
    },
    // 树节点选中
    treeCheckBoxClick (checkedKeys, event) {
      const node = event.node
      const inx = this.existsInArray(node.value)
      if (inx < 0) {
        this.pushToSelectd(node.value, node.title)
      } else {
        this.selectedData.splice(inx, 1)
      }
    },
    // 添加已选列表
    pushToSelectd (value, text) {
      // 通过value判断已选列表中是否存在，如果存在则不允许继续加入已选列表
      let flag = true
      // 判断数据是否存在此记录
      for (let i = 0; i < this.selectedData.length; i++) {
        if (this.selectedData[i].value === value) {
          flag = false
          break
        }
      }
      if (flag) {
        this.selectedData.push({
          value: value,
          text: text
        })
      }
    },
    // 从列表中移除
    removeFromSelected (value) {
      this.selectedData.forEach(function (item, index, arr) {
        if (item.value === value) {
          arr.splice(index, 1)
        }
      })
    },
    // 判断在数组中是否存在，如果存在则返回>=0的数据，否则返回-1
    existsInArray (value) {
      let inx = -1
      for (let i = 0; i < this.selectedData.length; i++) {
        if (this.selectedData[i].value === value) {
          inx = i
          break
        }
      }
      return inx
    }
  }
}
</script>
<style>
  .address_unselect {
    flex: 1;
    height: 100%;
    border: 0px solid red;
  }
  .address_switch{
    width: 46px;
    height: 100%;
    text-align: center;
    border-left: 1px solid #e7e8eb;
    border-right: 1px solid #e7e8eb;
  }
  .icon_switch{
    margin: auto;
    position: absolute;
    width: 100%;
    height: 50px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .address_selected {
    flex: 1;
    height: 100%;
    border: 0px solid blue;
  }
  .address_selected_search{
    width: 100%;
    height: 35px;
    margin: 0;
  }
  .address_selected_content{
    width: 100%;
    height: calc(100% - 35px);
  }
  .address_selected_content_ul {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .address_selected_content_ul li{
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: black;
    list-style: none;
    cursor: pointer;
    margin: 0;
    padding: 0 12px;
  }
  .address_selected_content_ul li:hover{
    /*background-color: #E7E8EB;*/
    background-color: #EBF5FB;;
  }
  .unSelectedContent{
    width: 100%;
    height: 100%;
  }
  .dept_advance_search {
    border: 1px solid #e7e8eb;
    height: 100%;
  }
  .dept_advance_search > ul > li {
    height: 20px;
    width: 100%;
    list-style-type: none;
  }
  .ant-tabs-bar {
    margin: 0!important;
  }
  .searchRow .ant-select-selection{
    background-color: #EBF5FB;
    border-radius: 0px!important;
  }
  .searchRow .ant-input {
    border-radius: 0px!important;
  }
  .ant-tabs-line{
    height: 100%!important;
  }

</style>
