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
      <!--<a-form :form="form">
        <a-form-item
          label="描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['desc', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
      </a-form>-->
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <!--<a-form-item label="名称">
              <a-input v-decorator="['name', {rules: [{required: true, min: 5, message: '请输入至少五个字符的名称！'}]}]" />
            </a-form-item>-->
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
              <a-input-number v-model="sort" :min="1" :max="10000" style="width: 100%" v-decorator="[ 'sort', validatorRules.sort ]" />
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
import { addOrgRole, getOrgRole } from '@/api/org/orgPositionApi'
export default {
  data () {
    return {
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
      }
    }
  },
  created () {
  },
  methods: {
    add () {
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    edit (id) {
      this.visible = true
      if (id) {
        getOrgRole({ id: id }).then((resp) => {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              name: '国家主席',
              code: 'zx',
              sort: 1,
              remark: '国家主席职位描述'
            })
          })
        }).finally(() => {
          alert('执行完成，隐藏数据加载中选项')
        })
      }
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      var that = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          const formData = Object.assign(this.model, values)
          const rtnObj = addOrgRole(formData)
          console.log(formData)
          console.log(rtnObj)
          rtnObj.then((res) => {
            if (res.code === '200') {
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
