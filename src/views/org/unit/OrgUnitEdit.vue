<template>
  <i-dialog
    :title="title"
    :width="dialogWidth"
    :height="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="padding-right: 20px;">
        <i-section-header title="基本信息"></i-section-header>
        <a-row type="flex">
          <a-col :span="12">
            <a-form-item
              label="单位全称"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['fullName', validatorRules.fullName]" placeholder="请输入单位全称"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="单位简称"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-input
                v-decorator="['name', validatorRules.name]"
                placeholder="请输入单位简称"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="上级单位" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-tree-select
                style="width: 100%"
                :treeData="orgUnitTree"
                :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                placeholder="请选择上级单位"
                v-decorator="[ 'parentId' ]"
                :value="parentId"
                :showCheckedStrategy="SHOW_PARENT"
                searchPlaceholder=""
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="是否有效"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-radio-group v-decorator="['status',{initialValue: '1'}]" style="width: 100%">
                <a-radio value="1">启用</a-radio>
                <a-radio value="2">停用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="单位编码"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['code',{rules: [{ required: true, message: '请输入单位编码!' }]}]"
                       placeholder="请输入单位编码"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="排序号"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-input
                v-decorator="['sort', validatorRules.sort]" placeholder="请输入排序号"/>
            </a-form-item>
          </a-col>
        </a-row>

        <i-section-header title="通讯信息"></i-section-header>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="单位地址"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['orgAddress']" placeholder="请输入单位地址"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="邮编"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['orgPostCode']" placeholder="邮编"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="电话号码"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['telNo']" placeholder="请输入电话号码"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="传真号码"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-input v-decorator="['faxNo']" placeholder="请输入传真号码"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="邮箱号"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['emailNo']" placeholder="请输入邮箱号"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="网址"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-input v-decorator="['website']" placeholder="请输入网址"/>
            </a-form-item>
          </a-col>
        </a-row>

        <i-section-header title="权限信息"></i-section-header>
        <!--<a-row>
          <a-col :span="12">
            <a-form-item
              label="权限类型"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
              <a-input v-decorator="['code',{rules: [{ required: true, message: '请输入单位编码!' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>-->
      </a-form>
    </a-spin>
    <icon ref="iconSelect" @choose="iconChange"></icon>
  </i-dialog>
</template>
<script>
import { saveData, findById, orgUnitTree } from '@/api/org/orgUnitApi'
import Icon from '@/components/IconSelector/Icon'
import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
import IDialog from '@/views/system/component/IDialog'
import ISectionHeader from '@/views/system/component/ISectionHeader'
export default {
  components: {
    IDialog,
    ARadioButton,
    Icon,
    ISectionHeader
  },
  data () {
    return {
      title: '机构信息',
      statusInitValue: 'Y',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      dialogWidth: '1000',
      visible: false,
      confirmLoading: false,
      orgUnitTree: [],
      model: {},
      form: this.$form.createForm(this),
      validatorRules: {
        fullName: {
          rules: [
            { required: true, message: '请输入单位全称!' },
            { min: 5, max: 30, message: '长度在 5 到 100 个字符', trigger: 'blur' }
          ]
        },
        name: {
          rules: [
            { required: true, message: '请输入单位简称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ]
        },
        sort: {
          rules: [
            { required: true, message: '请输入序号!' }
          ]
        }
      },
      id: null
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    add () {
      this.title = '新增机构信息'
      // 编辑内容设置默认值
      this.form.resetFields()
      this.initOrgUnitTree()
      this.visible = true
    },
    initOrgUnitTree () {
      orgUnitTree().then(res => {
        // 增加根节点
        this.orgUnitTree = [{
          key: '-1',
          leaf: false,
          parentId: '',
          title: '根节点',
          value: '-1',
          children: res.result
        }]
      })
    },
    selectIcon () {
      const defaultIcon = this.form.getFieldValue('menuIcon')
      this.$refs.iconSelect.show(defaultIcon)
    },
    iconChange (iconClass) {
      this.form.setFieldsValue({
        menuIcon: iconClass
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    edit (id) {
      if (id) {
        this.initOrgUnitTree()
        this.id = id
        findById({ id: id }).then((resp) => {
          this.$nextTick(() => {
            this.form.setFieldsValue(resp.result)
          })
        }).finally(() => {
        })
      }
      this.title = '编辑机构信息'
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      var that = this
      validateFields((errors, values) => {
        if (!errors) {
          const formData = Object.assign(this.model, values)
          // 编辑状态下给出ID的原始值
          if (this.id) {
            formData.id = this.id
          }
          const rtnObj = saveData(formData)
          rtnObj.then((res) => {
            console.table(res)
            if (res.code === 200) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else if (res.status === 400 || res.status === 415) {
              this.$message.warning(res.message)
            } else {
              this.$message.warning(res.message)
            }
            that.confirmLoading = false
            that.$emit('ok')
            that.close()
          }).catch((error) => {
            that.$message.error(error.message)
            that.confirmLoading = false
          }).finally(() => {
            that.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
