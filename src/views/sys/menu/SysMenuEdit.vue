<template>
  <i-dialog
    title="菜单信息"
    :width="640"
    :height="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="菜单类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group v-decorator="['menuType', {rules: [{required: true, message: '请远择菜单类型！'}]} ]">
            <a-radio :value="1">目录</a-radio>
            <a-radio :value="2">菜单</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="上级菜单" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <!--<a-input v-decorator="[ 'parentId' ]" placeholder="请选择上级菜单" />-->
          <a-tree-select
            style="width: 100%"
            :treeData="sysMenuTree"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            placeholder="请选择上级菜单"
            v-decorator="[ 'parentId' ]"
            :value="parentId"
            :showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder=""
          />
        </a-form-item>
        <a-form-item label="菜单名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'menuName', validatorRules.name ]" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item label="菜单路径" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'menuPath', {rules: [{required: true, message: '请输入菜单路径！'}]} ]" placeholder="请输入菜单路径" />
        </a-form-item>
        <a-form-item label="组件信息" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <!--<a-input v-decorator="['remark', {rules: [{required: true, min: 5, message: '请输入职级描述'}]}]" />-->
          <a-input v-decorator="[ 'menuComponent' ]" placeholder="请输入组件信息" />
        </a-form-item>
        <a-form-item label="是否外部链接" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group v-decorator="['externalLink' ]">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排序" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input-number :min="1" :max="10000" v-decorator="[ 'sort', validatorRules.sort ]" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="图标" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'menuIcon' ]" placeholder="请选择组件图标" >
            <a-icon slot="addonAfter" type="setting" @click="selectIcon" @choose="iconChange"/>
          </a-input>
        </a-form-item>
        <a-form-item label="是否缓存" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group v-decorator="['keepAlive' ]">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否显示" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group v-decorator="['hidden' ]">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
    <icon ref="iconSelect" @choose="iconChange"></icon>
  </i-dialog>
</template>
<script>
import { saveData, findById, sysMenuTree } from '@/api/sys/sysMenuApi'
import Icon from '@/components/IconSelector/Icon'
import IDialog from '@/views/system/component/IDialog'
import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
export default {
  components: {
    ARadioButton,
    Icon,
    IDialog
  },
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
        menuType: {
          rules: [
            { required: true, message: '请选择菜单类型!' }
          ]
        },
        name: {
          rules: [
            { required: true, message: '请输入菜单名称!' },
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
      id: null,
      sysMenuTree: []
    }
  },
  created () {
    sysMenuTree().then((res) => {
      console.log('-----------:' + res)
      this.sysMenuTree = res.result
    }).finally(() => {
      console.log('----------------系统数据获取异常-------------------')
    })
  },
  methods: {
    add () {
      this.visible = true
      // 编辑内容设置默认值
      this.form.resetFields()
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
      this.visible = true
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