<template>
  <div class="columnContext">
    <div class="left">
      <a-row :gutter="8" style="margin: 2px">
        <a-button size="small"><a-icon type="setting" theme="theme" twoToneColor="#296FBE"/>增加</a-button>&nbsp;
        <a-button icon="form" size="small">编辑</a-button>&nbsp;
        <a-button icon="minus-square" size="small">删除</a-button>
      </a-row>
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
      <div v-if="treeSelectId == ''">
        信息描述页面，展示操作信息等内容
      </div>
      <div v-if="treeSelectId != ''">
        <a-form @submit="handleSubmit" :form="form" style="margin: 10px;">
          <div class="title">基本信息</div>
          <a-row type="flex">
            <a-col :span="12">
              <a-form-item
                label="单位全称"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input v-decorator="['fullName',{rules: [{ required: true, message: '请输入公司全称!' }]}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="单位简称"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-input
                  v-decorator="['name',{rules: [{ required: true, message: '请输入公司简称!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="单位编码"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input v-decorator="['code',{rules: [{ required: true, message: '请输入单位编码!' }]}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="排序号"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-input
                  v-decorator="['name',{rules: [{ required: true, message: '请输入排序号!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>

          <div class="title">地址信息</div>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="地址"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input v-model="orgAddress"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="邮编"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-input v-model="orgPostCode"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="电话号码"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input v-model="telNo"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="传真号码"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-input v-model="faxNo"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="邮箱号"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input v-model="emailNo"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="网址"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-input v-model="website"/>
              </a-form-item>
            </a-col>
          </a-row>

          <div class="title">权限信息</div>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="权限类型"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }">
                <a-input v-decorator="['code',{rules: [{ required: true, message: '请输入单位编码!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="4">
              <a-button type="primary">保存</a-button>&nbsp;&nbsp;
              <a-button>取消</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
import { orgUnitTree } from '@/api/org/orgUnitApi'
export default {
  name: 'OrgUnit',
  components: {
  },
  data () {
    return {
      searchText: '',
      treeSelectId: '',
      treeData: [],
      form: this.$form.createForm(this)
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
    }
  }
}
</script>
<style lang="less">
  .columnContext {
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
</style>
