<template>
  <div class="table-content">
    <div class="table-operator">
      <div class="button-group">
        <a-button type="primary" size="small" @click="$refs.sysClusterNodeEdit.add()">新建</a-button>
        <!--{{this.queryBody}}-->
      </div>
      <div class="search-group">
        <a-form layout="inline">
          <a-form-item label="节点名称">
            <q-input opt="like" name="nodeName" style="width: 140px;height: 28px;" :context="queryBody" placeholder="请输入节点名称"/>
          </a-form-item>
          <a-form-item label="节点IP">
            <q-input opt="like" name="nodeIp" style="width: 140px;height: 28px;" :context="queryBody" placeholder="请输入节点IP"/>
          </a-form-item>
          <a-form-item label="节点描述">
            <q-input opt="like" name="nodeDescription" style="width: 140px;height: 28px;" :context="queryBody" placeholder="请输入节点描述"/>
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
      :rowSelection="options.rowSelection"
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
        </template>
      </span>
    </s-table>
    <sys-cluster-node-edit ref="sysClusterNodeEdit" @ok="handleOk"></sys-cluster-node-edit>
    <sys-common-query v-model="sendVal" type="danger" title="我是标题" content="我是内容" v-on:cancel="clickCancel()" @danger="clickDanger()" @confirm="clickConfirm()" dangerText="Delete">
      <a-form layout="inline" class="searchForm">
        <h3 style="margin: 10px;font-weight: bold"> >>查询条件</h3>
        <a-row :gutter="24" :class="['searchRow']" :style="{marginLeft: '0px', marginRight: '0px'}">
          <a-col :md="12" :sm="12">
            <a-form-item label="节点名称" :style="{width: '100%', textAlign: 'left'}">
              <q-input opt="like" name="nodeName" :context="queryBody" placeholder="请输入节点名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="节点IP" :style="{width: '100%', textAlign: 'left'}">
              <q-input opt="like" name="nodeIp" :context="queryBody" placeholder="请输入节点IP"/>
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
import SysClusterNodeEdit from './SysClusterNodeEdit'
import { getRoleList } from '@/api/manage'
import { getData } from '@/api/sys/sysClusterNodeApi'
import SysCommonQuery from '@/views/common/SysCommonQuery'
export default {
  name: 'SysClusterNodeList',
  components: {
    STable,
    Ellipsis,
    QInput,
    SysClusterNodeEdit,
    SysCommonQuery
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
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          align: 'center',
          width: '10%'
        },
        {
          title: '节点名称',
          dataIndex: 'nodeName',
          align: 'left',
          sorter: true,
          width: '15%'
        },
        {
          title: '节点IP',
          dataIndex: 'nodeIp',
          align: 'left',
          sorter: true,
          width: '15%'
        },
        {
          title: '节点状态',
          align: 'nodeStatus',
          sorter: true,
          width: '15%'
        },
        {
          title: '节点描述',
          dataIndex: 'nodeDescription',
          align: 'left',
          width: '40%'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getData(Object.assign(parameter, { queryPrams: this.queryBody }))
          .then(res => {
            console.log(res.result)
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
    this.tableOption()
    getRoleList({ t: new Date() })
  },
  computed: {
  },
  methods: {
    higerSearch () {
      this.sendVal = true
    },
    execSearch () {
      // console.log('---------------')
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
      this.$refs.sysClusterNodeEdit.edit(id)
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
      console.table('=========>' + this.queryBody)
    },
    setQueryParam (queryObj) {
      const that = this
      const targetName = queryObj.target
      console.log('------------targetName:' + targetName)
      that[targetName].push(queryObj.queryParam)
    },
    rowClassFunction (record, index) {
      return 'vue-table-tr'
    }
  }
}
</script>
<style lang="less">
  /*.ant-table-body{
    !*max-height: calc(100vh - 208px);
    min-height: calc(100vh - 208px);*!
    max-height: calc(100vh - 230px);
    min-height: calc(100vh - 230px);
    overflow-y: scroll;
  }
  .ant-layout-content {
    .content{
      margin: 0px;
    }
  }
  .ant-layout-content > .content {
    margin: 0px;
  }
  .layout.ant-layout.tablet > .ant-layout-content > .content {
    margin: 0px;
  }

  .ant-table-pagination.ant-pagination{
    margin: 8px 0;
    float: right;
  }
  .ant-table-thead > tr > th{
    font-weight: bold;
    font-size: 14px;
    font-family: "Microsoft YaHei Helvetica";
  }*/
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
