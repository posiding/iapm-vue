<template>
  <div class="i_dialog" v-show="visible" :style="{zIndex: this.zIndex }">
    <!-- 遮罩层 -->
    <div v-show="mask" v-bind:style="maskStyle"></div>
    <div class="i_dialog_box" v-drag="dragable" :style="{width: isNaN(this.dialogHeight) ? this.dialogWidth : this.dialogWidth + 'px', height: this.dialogHeight + 'px' }">
      <!-- 标题 -->
      <div class="i_dialog_title" v-if="title ? true : false" :style="{cursor: this.dragable ? 'all-scroll' : 'default'}">
        {{title}}
        <span v-if="closable" class="i_dialog_close" @click="cancel">X</span>
      </div>
      <!-- 内容 -->
      <div class="i_dialog_content">
        <slot></slot>
      </div>
      <!-- 底部按钮 -->
      <div class="i_dialog_bottom">
        <slot name="footer">
          <a-button size="small" v-if="okButton" :type="okType" @click="confirm">{{okText}}</a-button>
          <a-button size="small" v-if="cancelButton" :type="calcelType" @click="cancel">{{cancelText}}</a-button>
        </slot>
      </div>
      <div class="i_dialog_right_bottom_border" v-show="resizeable" v-resize="{ dragWidth: dragWidth, dragHeight: dragHeight }">
        <img src="@/views/system/image/resize.gif" class="i_bottom_border_image">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IDialog',
  props: {
    value: {},
    // 是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 标题内容
    title: {
      type: String,
      default: ''
    },
    // 是否打开取消按钮
    cancelButton: {
      type: Boolean,
      default: true
    },
    // 取消按钮文本框
    cancelText: {
      type: String,
      default: '取消'
    },
    // 取消按钮类型
    calcelType: {
      type: String,
      default: null
    },
    // 确定按钮文本框内容
    okText: {
      type: String,
      default: '确定'
    },
    // 确定按钮类型
    okType: {
      type: String,
      default: 'primary'
    },
    // 是否打开确定按钮
    okButton: {
      type: Boolean,
      default: true
    },
    // 宽度（类型为字符串或数字类型）
    width: {
      type: [String, Number],
      default: 520
    },
    // 设置弹出展示层div的高度
    height: {
      type: [String, Number],
      default: 300
    },
    // 设置zIndex
    zIndex: {
      type: Number,
      default: 1000
    },
    // 是否展示右上角关闭按钮 // TODO  待完善此变量
    closable: {
      type: Boolean,
      default: true
    },
    // 是否展示遮罩层
    mask: {
      type: Boolean,
      default: true
    },
    // 点击遮罩层是否允许关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    // 遮罩层样式内容
    maskStyle: {
      type: Object,
      default: () => {
        return {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          backgroundColor: '#000',
          opacity: 0.5
        }
      }
    },
    // 是否允许拖动
    dragable: {
      type: Boolean,
      default: true
    },
    // 是否允许拖动改变大小
    resizeable: {
      type: Boolean,
      default: true
    },
    // 重置大小之后是否自动居中
    autoCenter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogWidth: this.width,
      dialogHeight: this.height
    }
  },
  created () {
    document.onkeydown = function (e) {
      const e1 = e || event || window.event || arguments.callee.caller.arguments[0]
      if (e1 && e1.keyCode === 27) {
        console.log('---------------esc 事件---------------------')
      }
    }
  },
  methods: {
    // 拖动改变弹出层宽度
    dragWidth: function (width) {
      this.dialogWidth = width
    },
    // 拖动改变高度
    dragHeight: function (height) {
      this.dialogHeight = height
    },
    // 遮罩层是否允许关闭
    maskMange: function () {
      if (this.maskClosable) {
        this.cancel()
      }
    },
    // 关闭功能
    cancel: function () {
      // 关闭之后的回调功能
      this.$emit('cancel')
    },
    // 确定功能
    confirm: function () {
      this.$emit('ok')
    }
  },
  mounted () {
  },
  computed: {
  },
  watch: {
    value (newVal, oldVal) {
      this.visible = newVal
    },
    showMask (val) {
      this.$emit('input', val)
    }
  },
  directives: {
    drag: {
      inserted: function (el, binding, vnode) {
        vnode = vnode.elm
        const bindingValue = binding.value
        if (bindingValue) {
          el.onmousedown = function () {
            if (event.target.className !== 'i_dialog_title') {
              return
            }
            // (clientX, clientY)点击位置距离当前可视区域的坐标(x，y)
            // offsetLeft, offsetTop 距离上层或父级的左边距和上边距
            // 获取鼠标在弹窗中的位置
            console.log('当前点击X坐标' + event.clientX + ';offsetLeft:' + vnode.offsetLeft)
            const mouseX = event.clientX - vnode.offsetLeft
            const mouseY = event.clientY - vnode.offsetTop
            // 绑定移动和停止函数
            document.onmousemove = function () {
              let left, top
              // 获取新的鼠标位置(event.clientX, event.clientY)
              // 弹窗应该在的位置(left, top)
              left = event.clientX - mouseX
              top = event.clientY - mouseY
              // offsetWidth、offsetHeight 当前元素的宽度
              // innerWidth、innerHeight 浏览器可视区的宽度和高度
              // 获取弹窗在页面中距X轴的最小、最大 位置
              const minX = -vnode.offsetWidth / 2 + 100
              const maxX = window.innerWidth + vnode.offsetWidth / 2 - 100
              if (left <= minX) {
                left = minX
              } else if (left >= maxX) {
                left = maxX
              }
              // 获取弹窗在页面中距Y轴的最小、最大 位置
              const minY = vnode.offsetHeight / 2
              const maxY = window.innerHeight + vnode.offsetHeight / 2 - 100
              if (top <= minY) {
                top = minY
              } else if (top >= maxY) {
                top = maxY
              }
              // 赋值移动
              vnode.style.left = left + 'px'
              vnode.style.top = top + 'px'
            }
            document.onmouseup = function (e) {
              document.onmousemove = null
              document.onmouseup = null
            }
          }
        }
        // 布局的过程中重复居中
        window.onresize = function () {
          vnode.style.left = '50%'
          vnode.style.top = '50%'
        }
      }
    },
    resize: {
      inserted: function (el, binding, vnode) {
        vnode = vnode.elm
        const bindingValue = binding.value
        if (bindingValue) {
          console.log('--------resize---------------注册成功')
          el.onmousedown = function () {
            if (event.target.className !== 'i_bottom_border_image') {
              return
            }
            // (clientX, clientY)点击位置距离当前可视区域的坐标(x，y)
            // offsetLeft, offsetTop 距离上层或父级的左边距和上边距
            // 获取鼠标在弹窗中的位置
            // const mouseX = event.clientX - vnode.offsetLeft
            // const mouseY = event.clientY - vnode.offsetTop
            const startX = event.clientX
            const startY = event.clientY
            // 绑定移动和停止函数
            const boxOffsetWidth = document.querySelector('.i_dialog_box').offsetWidth
            const boxOffsetHeight = document.querySelector('.i_dialog_box').offsetHeight

            const maxWidth = document.body.clientWidth
            const maxHeight = document.body.clientHeight
            document.onmousemove = function (e) {
              e.preventDefault()
              const currentX = e.clientX
              const currentY = e.clientY
              console.log('maxWidth:' + maxWidth + 'maxHeight:' + maxHeight)
              // 控制宽度范围和最大范围
              let width = boxOffsetWidth + (currentX - startX)
              if (width <= 200) {
                width = 100
              } else if (width >= (maxWidth - 150)) {
                width = maxWidth - 150
              }
              binding.value.dragWidth(width)
              // 控制缩小高度范围和最大范围
              let height = boxOffsetHeight + (currentY - startY)
              if (height <= 150) {
                height = 100
              } else if (height >= (maxHeight - 100)) {
                height = maxHeight - 100
              }
              binding.value.dragHeight(height)
            }
            document.onmouseup = function (e) {
              document.onmousemove = null
              document.onmouseup = null
            }
          }
        }
      }
    }
  }
}
</script>
<style scoped>
  .i_dialog {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .i_dialog_mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #000;
    opacity: 0.5;
  }
  .i_dialog_box {
    position: absolute;
    background: #fff;
    top: 50%;
    left: 50%;
    max-width: 100%;
    border-radius: 3px;
    overflow: hidden;
    transform: translate(-50%, -50%);
    border: 1px solid #e7e8eb;
    -webkit-box-shadow: #666 0px 0px 10px;
    -moz-box-shadow: #666 0px 0px 10px;
    box-shadow: #666 0px 0px 10px;
  }
  .i_dialog_content {
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    padding: 8px;
    text-align: left;
    box-sizing: border-box;
    height: calc(100% - 82px);
  }
  .i_dialog_title {
    /*cursor: all-scroll;*/
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    top: 0;
    left: 0;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e7e8eb;
    color: #000;
    font-size: 16px;
    font-family: \5fae\8f6f\96c5\9ed1;
    padding: 0 31px 0 18px;
    text-align: left;
    user-select: none;
    font-weight: bold;
  }
  .i_dialog_close {
    cursor: pointer;
    position: absolute;
    top: 50%;
    margin-top: -8px;
    right: 20px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #ccc;
  }
  .i_dialog_close:hover {
    color: #409eff;
  }
  .i_dialog_bottom {
    margin: 0;
    padding: 0;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #e7e8eb;
  }
  .i_dialog_right_bottom_border {
    position: absolute;
    right: 0px;
    bottom: 0px;
    height: 15px;
    width: 15px;
    cursor: se-resize;
  }
  .i_dialog_bottom .confirm_btn .marginLeft {
    margin-left: 10px;
  }
  button + button {
    margin-left: 15px;
  }
  .i_bottom_border_image {
    position: absolute;
    margin-bottom: 0px;
    margin-right: 0px;
  }
</style>
