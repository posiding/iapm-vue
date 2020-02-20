<template>
  <a-modal
    :title= "title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    centered
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="节点名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'nodeName', validatorRules.name ]" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="节点IP" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'nodeIp', {rules: [{required: true, message: '请输入节点IP！'}]} ]" placeholder="请输入节点IP" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { saveData, findById } from '@/api/sys/sysClusterNodeApi'
import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
export default {
  components: {
    ARadioButton
  },
  data () {
    return {
      title: '',
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
        menuType: {
          rules: [
            { required: true, message: '请选择节点类型!' }
          ]
        },
        name: {
          rules: [
            { required: true, message: '请输入节点名称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
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
    console.log('----------------created方法执行了-------------------')
  },
  methods: {
    add () {
      this.visible = true
      this.id = null
      this.title = '新增节点信息' + this.id
      // 编辑内容设置默认值
      this.form.resetFields()
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    edit (id) {
      this.visible = true
      this.title = '编辑节点信息' + this.id
      if (id) {
        this.id = id
        findById({ id: id }).then((resp) => {
          this.$nextTick(() => {
            this.form.setFieldsValue(resp.result)
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
          const rtnObj = saveData(formData)
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
