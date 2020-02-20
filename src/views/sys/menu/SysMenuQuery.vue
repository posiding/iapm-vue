<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-container">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    // 类型包括 defalut 默认， danger 危险， confirm 确认，
    type: {
      type: String,
      default: 'default'
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    dangerText: {
      type: String,
      default: '删除'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      showMask: false,
      name: '',
      code: ''
    }
  },
  methods: {
    closeMask () {
      this.showMask = false
    },
    closeBtn () {
      this.$emit('cancel')
      this.closeMask()
    },
    dangerBtn () {
      this.$emit('danger')
      this.closeMask()
    },
    confirmBtn () {
      this.$emit('confirm')
      this.closeMask()
    }
  },
  mounted () {
    this.showMask = this.value
  },
  watch: {
    value (newVal, oldVal) {
      this.showMask = newVal
    },
    showMask (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>
  .dialog{
    position: fixed;
    top: 136px;
    bottom: 10px;
    left: 210px;
    right: 10px;
    background-color: #000;
    background: rgba(0, 0, 0, 0.5);
    z-index: 888;
    .dialog-container{
      z-index: 999;
      border-top: 1px solid #e8e8e8;
      // border: 1px solid #C9C9C9;
      width: 100%;
      background-color: #F9F9F9;
      opacity:1;
      position: relative;
      top: 0px;
      right: 0px;
      float: right;
      border-radius: 2px;
      position: relative;
      .dialog-title{
        width: 100%;
        height: 60px;
        font-size: 18px;
        color: #696969;
        font-weight: 600;
        padding: 16px 50px 0 20px;
        box-sizing: border-box;
      }
      .content{
        color: #797979;
        line-height: 26px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      .inp{
        margin: 10px 0 0 20px;
        width: 200px;
        height: 40px;
        padding-left: 4px;
        border-radius: 4px;
        border: none;
        background: #efefef;
        outline: none;
        &:focus{
          border: 1px solid #509EE3;
        }
      }
      .btns{
        width: 100%;
        height: 60px;
        // line-height: 60px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: right;
        padding: 0 16px;
        box-sizing: border-box;
        & > div{
          display: inline-block;
          height: 40px;
          line-height: 40px;
          padding: 0 14px;
          color: #ffffff;
          background: #f1f1f1;
          border-radius: 8px;
          margin-right: 12px;
          cursor: pointer;
        }
        .default-btn{
          color: #787878;
          &:hover{
            color: #509EE3;
          }
        }
        .danger-btn{
          background: #EF8C8C;
          &:hover{
            background: rgb(224, 135, 135);
          }
          &:active{
            background: #EF8C8C;
          }
        }
        .confirm-btn{
          color: #ffffff;
          background: #509EE3;
          &:hover{
            background: #6FB0EB;
          }
        }
      }
      .close-btn{
        position: absolute;
        top: 16px;
        right: 16px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        &:hover{
          font-weight: 600;
        }
      }
    }
  }
</style>
