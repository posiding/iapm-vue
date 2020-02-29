<template>
  <div class="table-content">
    <div class="table-operator">
      <div class="button-group">
        <a-button type="primary" size="small" @click="$refs.orgUnitEdit.add()">新建</a-button>
      </div>
      <div class="search-group">
        <a-form layout="inline">
          <a-form-item label="机构名称">
            <q-input opt="like" name="fullName" style="width: 140px;height: 28px;" :context="queryBody" placeholder="请输入机构名称"/>
          </a-form-item>
          <a-form-item>
            <a-button-group>
              <a-button type="primary" size="small" style="margin-right: 0px" @click="handleOk">搜索</a-button>
              <a-button type="primary" size="small" style="margin-left: 0px" icon="search" @click="higerSearch"></a-button>
            </a-button-group>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="false"
      :scroll="{y: 10}"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record.id)">编辑</a>
        </template>
      </span>
    </s-table>
    <org-unit-edit ref="orgUnitEdit" @ok="handleOk"></org-unit-edit>
    <sys-common-query v-model="sendVal" type="danger" title="我是标题" content="我是内容" v-on:cancel="clickCancel()" @danger="clickDanger()" @confirm="clickConfirm()" dangerText="Delete">
      <a-form layout="inline" class="searchForm">
        <i-section-header title="查询条件"></i-section-header>
        <a-row :gutter="24" :class="['searchRow']" :style="{marginLeft: '0px', marginRight: '0px'}">
          <a-col :md="12" :sm="12">
            <a-form-item label="单位全称" :style="{width: '100%', textAlign: 'left'}">
              <q-input opt="like" name="fullName" :context="queryBody" placeholder="请输入单位全称"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="单位简称" :style="{width: '100%', textAlign: 'left'}">
              <q-input opt="like" name="name" :context="queryBody" placeholder="请输入单位简称"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :class="['searchRow']">
          <a-col :md="24" :sm="24" :style="{ textAlign: 'center', margin: '10px 0px' }">
            <a-button size="small" type="primary" @click="handleOk">查询</a-button>
            <a-button size="small" style="margin-left: 8px" @click="calcelSearch">取消</a-button>
            <a-button size="small" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </sys-common-query>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis, QInput } from '@/components'
import { getRoleList } from '@/api/manage'
import { getOrgUnitData } from '@/api/org/orgUnitApi'
import OrgUnitEdit from './OrgUnitEdit'
import SysCommonQuery from '@/views/common/SysCommonQuery'
import ISectionHeader from '@/views/system/component/ISectionHeader'
export default {
  name: 'OrgUnitList',
  components: {
    STable,
    Ellipsis,
    QInput,
    OrgUnitEdit,
    SysCommonQuery,
    ISectionHeader
  },
  data () {
    return {
      modal1Visible: true,
      mdl: {},
      name: '',
      code: '',
      sendVal: false,
      // 高级搜索 展开/关闭
      advanced: false,
      defaultHolder: {
        value: '我是默认提示信息'
      },
      timestamp: null,
      // 查询参数
      queryParam: {},
      // 封装查询条件参数
      queryBody: {
      },
      plainOptions: [
        { label: '语文', value: '1' },
        { label: '数学', value: '2' },
        { label: '英语', value: '3' }
      ],
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          align: 'center',
          width: '10%'
        },
        {
          title: '单位全称',
          dataIndex: 'fullName',
          align: 'left',
          sorter: true,
          width: '15%'
        },
        {
          title: '单位名称（简称）',
          dataIndex: 'name',
          align: 'left',
          sorter: true,
          width: '15%'
        },
        {
          title: '单位编码',
          dataIndex: 'code',
          align: 'left',
          sorter: true,
          width: '10%'
        },
        {
          title: '序号',
          dataIndex: 'sort',
          align: 'left',
          width: '10%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'left',
          width: '10%'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOrgUnitData(Object.assign(parameter, { queryPrams: this.queryBody }))
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: true
    }
  },
  created () {
    this.queryBody = {
      name: {
        opt: 'like',
        values: []
      },
      code: {
        opt: 'like',
        values: []
      }
    }
    this.tableOption()
    getRoleList({ t: new Date() })
  },
  methods: {
    higerSearch () {
      this.sendVal = true
    },
    execSearch () {
    },
    calcelSearch () {
      this.sendVal = false
    },
    clickCancel () {
      console.log('点击了取消')
    },
    clickDanger () {
      console.log('这里是danger回调')
    },
    clickConfirm () {
      console.log('点击了confirm')
    },
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
      }
      this.optionAlertShow = !this.optionAlertShow
    },

    handleEdit (id) {
      this.$refs.orgUnitEdit.edit(id)
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    showValues () {
    },
    checkQueryValues () {
    },
    setQueryParam (queryObj) {
      const that = this
      const targetName = queryObj.target
      that[targetName].push(queryObj.queryParam)
    },
    rowClassFunction (record, index) {
      return 'vue-table-tr'
    }
  }
}
</script>
<style lang="less">
  .searchRow{
    margin-left: 0px;
    margin-right: 0px;
    .ant-form-item-label{
      width: 30%
    }

    .ant-form-item-control-wrapper{
      width: 70%
    }
  }
  .ant-row ant-form-item{
    display: inline-block;
    margin-right: 0px;
    margin-bottom: 0px;
  }
  .searchForm .ant-form .ant-form-inline -> .ant-row ant-form-item{
    width: 100%
  }

</style>
