<template>
  <div class="treeTableContent">
    <div class="left">
      <a-row>
        <a-input-search
          placeholder="请输入您要搜索的单位名称"
          style="width: 100%"
          v-model="searchText"
          @search="treeSearch"
        />
      </a-row>
      <a-row>
        <a-tree
          :treeData="treeData"
          showLine
          @select="treeClick"
        >
        </a-tree>
      </a-row>
    </div>
    <div class="right">
      <div class="table-content">
        <div class="table-operator">
          <div class="button-group">
            <a-button type="primary" size="small" @click="$refs.orgDepartmentEdit.add()">新建</a-button>
            <a-button type="primary" size="small" @click="$refs.addressSelect.add()">组织架构选择</a-button>
            <a-button type="primary" size="small" @click="$refs.orgDepartmentEdit.add()">删除</a-button>
          </div>
          <div class="search-group">
            <q-input opt="like" name="name" style="width: 140px;height: 28px;" :context="queryBody" placeholder="请输入部门名称"/>
            <a-button-group>
              <a-button type="primary" size="small" style="margin-right: 0px" >搜索</a-button>
              <a-button type="primary" size="small" style="margin-left: 0px" icon="search" @click="searchManage"></a-button>
            </a-button-group>
          </div>
          <!--<div class="button-group">
            <a-button type="primary" size="small" @click="$refs.orgDepartmentEdit.add()">新建</a-button>
            &lt;!&ndash;{{this.queryBody}}&ndash;&gt;
          </div>
          <div class="search-group">
            <a-form layout="inline">
              <a-form-item label="部门名称">
                <q-input opt="like" name="name" style="width: 140px;height: 28px;" :context="queryBody" placeholder="请输入部门名称"/>
              </a-form-item>
              <a-form-item>
                <a-button-group>
                  <a-button type="primary" size="small" style="margin-right: 0px" >搜索</a-button>
                  <a-button type="primary" size="small" style="margin-left: 0px" icon="search" @click="searchManage"></a-button>
                </a-button-group>
              </a-form-item>
            </a-form>
          </div>-->
        </div>
        <s-table
          ref="table"
          size="small"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
          :scroll="{y: 10}"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="status" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
          </span>
          <span slot="description" slot-scope="text">
            <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record.id)">编辑</a>
              <!--<a-divider type="vertical" />
              <a @click="handleSub(record)">订阅报警</a>-->
            </template>
          </span>
        </s-table>
        <i-address ref="addressSelect"></i-address>
        <org-department-edit ref="orgDepartmentEdit" @ok="handleOk"></org-department-edit>
        <sys-common-query v-model="sendVal" type="danger" title="标题内容" content="我是内容" v-on:cancel="clickCancel()" >
          <a-form layout="inline" class="searchForm">
            <i-section-header title="常用条件"></i-section-header>
            <a-row :class="['searchRow']" :style="{marginLeft: '0px', marginRight: '0px'}">
              <a-col :md="12" :sm="12">
                <a-form-item label="部门名称" :style="{width: '100%', textAlign: 'left'}" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                  <q-input opt="like" name="name" :context="queryBody" placeholder="请输入部门名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="12">
                <a-form-item label="部门编码" :style="{width: '100%'}" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                  <q-input opt="like" name="code" :context="queryBody" placeholder="请输入部门编码"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :class="['searchRow']">
              <a-col :md="24" :sm="24" :style="{ textAlign: 'center', margin: '10px 0px' }">
                <a-button size="small" type="primary" @click="handleOk">查询</a-button>
                <a-button size="small" style="margin-left: 8px" @click="searchManage">取消</a-button>
                <a-button size="small" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </sys-common-query>
      </div>
    </div>
  </div>
</template>
<script>
import { orgUnitTree } from '@/api/org/orgUnitApi'
import { getOrgDepartmentData } from '@/api/org/orgDepartmentApi'
import { STable, QInput } from '@/components'
import SysCommonQuery from '@/views/common/SysCommonQuery'
import IAddress from '@/views/system/component/IAddress'
import OrgDepartmentEdit from './OrgDepartmentEdit'
import ISectionHeader from '@/views/system/component/ISectionHeader'
import moment from 'moment'
export default {
  name: 'OrgUnit',
  components: {
    STable,
    QInput,
    SysCommonQuery,
    moment,
    OrgDepartmentEdit,
    ISectionHeader,
    IAddress
  },
  data () {
    return {
      showCreate: false,
      searchText: '',
      treeSelectId: '',
      treeData: [],
      queryBody: {},
      sendVal: false,
      form: this.$form.createForm(this),
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          align: 'center',
          width: '10%'
        }, {
          title: '部门名称',
          dataIndex: 'name',
          align: 'left',
          sorter: true,
          width: '15%'
        }, {
          title: '部门编码',
          dataIndex: 'code',
          align: 'left',
          sorter: true,
          width: '15%'
        }, {
          title: '备注信息',
          dataIndex: 'remark',
          align: 'left',
          sorter: true,
          width: '60%'
        }
      ],
      loadData: parameter => {
        return getOrgDepartmentData(Object.assign(parameter, { queryPrams: this.queryBody }))
          .then(res => {
            return res.result
          })
      }
    }
  },
  created () {
    orgUnitTree().then(res => {
      this.treeData = res.result
    })
  },
  methods: {
    // 树形结构搜索功能
    treeSearch: function () {
      orgUnitTree({ searchName: this.searchText }).then(res => {
        console.table(res.result)
        this.treeData = res.result
      })
    },
    // 树节点点击事件
    treeClick: function (selectedKeys, e) {
      const nodeObj = e.node.dataRef
      this.treeSelectId = nodeObj.value
    },
    // 表单提交操作
    handleSubmit: function () {
      console.log('执行表单提交操作')
    },
    // 展示高级搜索
    searchManage: function () {
      this.sendVal = this.sendVal ? false : true
    },
    // 执行查询功能
    handleOk () {
      this.$refs.table.refresh()
    },
    // 重置表单
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    // 展示新建窗口
    createDepartment: function () {

      this.showCreate = this.showCreate ? false : true
    }
  }
}
</script>
<style lang="less">
  .treeTableContent {
    width: 100%;
    height: 100%;
  }
  .left{
    width: 280px;
    height: 100%;
    float: left;
    background-color: white;
    border-right: 2px solid #F9F9F9;
    /*border: 1px solid red;*/
  }
  .right{
    width: calc(100% - 280px);
    height: 100%;
    float: left;
    background-color: white;
  }
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .searchContent {
    margin: 10px;
    font-weight: bold;
  }
</style>
