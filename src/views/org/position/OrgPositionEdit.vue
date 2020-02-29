<template>
  <a-modal
    title="编辑职级"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-decorator="[ 'name', validatorRules.name ]" placeholder="请输入职级名称" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="编码" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-decorator="[ 'code', validatorRules.code ]" placeholder="请输入职级编码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="排序" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input-number :min="1" :max="10000" style="width: 100%" v-decorator="[ 'sort', validatorRules.sort ]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <!--<a-input v-decorator="['remark', {rules: [{required: true, min: 5, message: '请输入职级描述'}]}]" />-->
              <a-textarea placeholder="请输入职级" :rows="2"  v-decorator="[ 'remark', validatorRules.remark ]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addOrgPosition, getOrgPosition } from '@/api/org/orgPositionApi'
export default {
  data () {
    return {
      resizeable: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
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
            { required: true, message: '请输入职级名称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ]
        },
        code: {
          rules: [
            { required: true, message: '请输入职级编码' },
            { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
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
