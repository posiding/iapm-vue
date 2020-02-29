<template>
  <!--<div class="i_dialog_wrapper is_active is_mask">
    <div class="i_dialog_box">
      <div class="i_dialog_header">
        {{title}}
        <span v-if="closable" class="i_dialog_close">X</span>
      </div>
      <div class="i_dialog_main">
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
        中间内容<br>
      </div>
      <div class="i_dialog_footer" v-if="footer">
        <a-button size="small" :type="okType">确定</a-button>
        <a-button size="small" >取消</a-button>
      </div>
      <span class="i_dialog_resize">
        <span data-type="es" class="es-resize">
          <img src="@/views/system/image/resize.gif">
        </span>
        <span data-type="er" class="er-resize" v-drag>
        </span>
      </span>
    </div>
  </div>-->
  <div>
    <a-button @click="showDialog">dialog=={{this.visiable}}==</a-button>
    <i-dialog v-model="visiable" :dragable="dragable" :title="title" :maskClosable="maskClosable" :showFooter="showFooter" :closeable="closeable" @ok="submitDialog" @cancel="closeDialog">
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
  </div>
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
</style>
