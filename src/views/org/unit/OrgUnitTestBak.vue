<template>
  <div class="i_dialog_wrapper is_active is_mask">
    <div class="i_dialog_box">
      neirong
    </div>
  </div>
  <!--<div>
    <a-button @click="showDialog">dialog=={{this.visiable}}==</a-button>
    <i-dialog v-model="visiable" :dragable="dragable" :title="title" :maskClosable="maskClosable" :width="dialogWidth" :showFooter="showFooter" :closeable="closeable" @ok="submitDialog" @cancel="closeDialog">
      <div class="i_dialog_header" slot="header1">
        表头内容
      </div>
      <div>
        中间内容展示区域
      </div>
      <div class="i_dialog_footer" slot="footer1">
        <a-button size="small" :type="okType">确4定</a-button>
        <a-button size="small" >取4消</a-button>
      </div>
    </i-dialog>
  </div>-->
</template>
<script>
import IDialog from '@/views/ivan/components/dialog/dialog'
export default {
  name: 'OrgUnitList',
  components: {
    IDialog
  },
  data () {
    return {
      id: 2,
      showFooter: true,
      maskClosable: false,
      closeable: true,
      dragable: true,
      okType: 'primary',
      visiable: false,
      title: '测试部门信息',
      dialogWidth: 1000,
      closable: true,
      footer: true,
      // 具体样式的传递
      divStyle: {
        width: '200px',
        border: '2px solid black'
      }
    }
  },
  created () {
  },
  methods: {
    clickMe: function () {
      alert('parent click')
    },
    submitDialog: function () {
      alert('parent submitDialog')
    },
    closeDialog: function () {
      this.visible = false
    },
    showDialog: function () {
      this.visiable = true
    }
  },
  directives: {
    drag: {
      inserted: function (el, binding, vnode) {
        console.log('-----------drag inserted----------------')
        vnode = vnode.elm
        const dialogBox = document.querySelector('.i_dialog_box')
        el.onmousedown = function (e) {
          console.log('-----------drag down----------------')
          e.preventDefault()
          const startX = event.clientX
          const boxWidth = dialogBox.clientWidth
          const bodyMouseMove = document.onmousemove
          const bodyMouseUp = document.onmouseup
          document.onmousemove = function (event) {
            console.log('-----------drag move----------------')
            event.preventDefault()
            const endX = event.clientX
            const disX = endX - startX
            const totalWidth = boxWidth + disX
            console.log('startX:' + startX + ';endX:' + endX + ';disX:' + disX + ';boxWidth:' + boxWidth + ';totalWidth:' + totalWidth)
            dialogBox.style.width = totalWidth + 'px'
          }
          document.onmouseup = () => {
            this.zoomLocat = null
            document.onmousemove = bodyMouseMove
            document.onmouseup = bodyMouseUp
          }
        }
      }
    }
  }
}
</script>
<style lang="less">
  .i_dialog_wrapper{
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 20;
    &.is_mask {
      background-color: rgba(0, 0, 0, 0.5);
    }
    &.is_active {
      display: block;
    }
    .i_dialog_box{
      position: absolute;
      background: #fff;
      top: 50%;
      left: 50%;
      border-radius: 3px;
      overflow: hidden;
      transform: translate(-50%, -50%);
      border: 1px solid #e7e8eb;
      -webkit-box-shadow: #666 0px 0px 10px;
      -moz-box-shadow: #666 0px 0px 10px;
      box-shadow: #666 0px 0px 10px;
      width: 700px;
      height: 500px;
      display: flex;
      flex-direction:column;
      .i_dialog_header{
        cursor: move;
        width: 100%;
        height: 40px;
        font-size: 1.1em;
        font-weight: 700;
        padding: 0.6em 2.8em 0.6em 1em;
        background-color: #F8F8F8;
        .i_dialog_close{
          position: absolute;
          right: 8px;
          /*top: 20px;*/
          z-index: 1;
          color: #ccc;
          &:hover{
            color: #409eff;
            cursor: pointer;
          }
        }
      }
      .i_dialog_main {
        flex: 1;
        overflow-y: auto;
      }
      .i_dialog_footer{
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-top: 2px solid #F8F8F8;
        .ant-btn{
          margin-left: 8px;
        }
      }
      .i_dialog_resize{
        .es-resize{
          position: absolute;
          width: 15px;
          height: 15px;
          right: 0px;
          bottom: 0px;
          cursor: se-resize;
          img{
            position: absolute;
          }
        }
      }
    }
  }
</style>
