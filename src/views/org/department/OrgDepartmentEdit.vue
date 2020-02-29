<template>
    <i-dialog
      :title="部门信息"
      :width="900"
      :height="500"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
    <a-spin :spinning="confirmLoading" style="margin-right: 10px">
      <a-form :form="form">
        <i-section-header title="基本信息"></i-section-header>
        <a-row>
          <a-col :span="12">
            <!--<a-form-item label="部门名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-decorator="[ 'name', validatorRules.name ]" placeholder="请输入部门名称" />
            </a-form-item>-->
            <a-form-item label="部门名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-decorator="[ 'name', validatorRules.name ]" placeholder="请输入部门名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部门编码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-decorator="[ 'code', validatorRules.code ]" placeholder="请输入部门编码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="上级部门" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-decorator="[ 'orgDepartmentLeaderId']" placeholder="请选择上级部门!" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="排序" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input-number :min="1" :max="1000000" style="width: 100%" v-decorator="[ 'sort', validatorRules.sort ]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-radio-group v-decorator="['status', {initialValue: 0, rules: [{required: true}]}]" style="width: 100%">
                <a-radio :value="0">启用</a-radio>
                <a-radio :value="1">停用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <i-section-header title="管理信息"></i-section-header>
        <a-row>
          <a-col :span="12">
            <a-form-item label="部门负责人" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-decorator="[ 'orgDepartmentLeaderId']" placeholder="请选择部门负责人" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部门分管领导" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-decorator="[ 'orgDepartmentChargerId']" placeholder="请选择部门分管领导" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="描述" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-textarea placeholder="请输入部门描述内容" :rows="2"  v-decorator="[ 'remark' ]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </i-dialog>
  <!--</a-modal>-->
</template>

<script>
import { IDialog, ISectionHeader } from '@/views/system/component'
import { addOrgPosition, getOrgPosition } from '@/api/org/orgPositionApi'
import ACol from 'ant-design-vue/es/grid/Col'
export default {
  components: {
    ACol,
    IDialog,
    ISectionHeader
  },
  data () {
    return {
      resizeable: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      model: {},
      form: this.$form.createForm(this),
      validatorRules: {
        name: {
          rules: [
            { required: true, message: '请输入部门名称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ]
        },
        code: {
          rules: [
            { min: 2, max: 20, message: '部门编码长度在5到100个字符', trigger: 'blur' }
          ]
        },
        sort: {
          rules: [
            { required: true, message: '请输入排序号' }
          ]
        },
        remark: {
          rules: [
            { required: true, message: '请输入描述内容' }
          ]
        }
      },
      id: null
    }
  },
  created () {
  },
  methods: {
    add () {
      this.visible = true
      // 编辑内容设置默认值
      this.form.setFieldsValue({
        name: '',
        code: '',
        sort: '',
        remark: ''
      })
    },
    // 取消编辑
    calcelEdit () {
      this.visible = false
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    edit (id) {
      this.visible = true
      if (id) {
        this.id = id
        getOrgPosition({ id: id }).then((resp) => {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              name: resp.result.name,
              code: resp.result.code,
              sort: resp.result.sort,
              remark: resp.result.remark
            })
          })
        }).finally(() => {
        })
      }
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
          const rtnObj = addOrgPosition(formData)
          rtnObj.then((res) => {
            if (res.code === 200) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
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
<style>
  /deep/ .ant-form label {
    font-size: 12px;
  }
</style>
