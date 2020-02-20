<template>
  <div class="my_dialog" v-show="visible" :style="{zIndex: calcZIndex }">
    <!-- 遮罩层 -->
    <div class="my_dialog_mask"></div>
    <div class="my_dialog_box" v-drag :style="{width: calcWidth, height: calcHeight }">
      <!-- 标题 -->
      <div class="my_dialog_title" v-if="title ? true : false">
        {{title}}
        <span v-if="closable" class="my_dialog_close" @click="cancel">X</span>
      </div>
      <!-- 内容 -->
      <div class="my_dialog_content">
        <slot></slot>
      </div>
      <!-- 底部按钮 -->
      <div class="my_dialog_bottom">
        <a-button size="small" v-if="okButton" :type="okType" @click="confirm">{{okText}}</a-button>
        <a-button size="small" v-if="cancelButton" :type="calcelType" @click="cancel">{{cancelText}}</a-button>
      </div>
      <div class="my_dialog_bottom_border">
      </div>
      <div class="my_dialog_right_border">
      </div>
      <div class="my_dialog_right_bottom_border">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IDialog',
  props: {
    value: {},
    showTitle: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    // 标题属性
    title: {
      type: String,
      default: ''
    },
    cancelButton: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    calcelType: {
      type: String
    },
    okText: {
      type: String,
      default: '确定'
    },
    okType: {
      type: String,
      default: 'primary'
    },
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
    }
  },
  data () {
    return {
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
    cancel: function () {
      this.$emit('cancel')
    },
    confirm: function () {
    }
  },
  mounted () {
  },
  computed: {
    // 设置z-index
    calcZIndex: function () {
      return this.zIndex
    },
    // 计算宽度
    calcWidth: function () {
      return this.width + 'px'
    },
    // 计算高度
    calcHeight: function () {
      return this.height + 'px'
    },
    // 计算是否允许关闭
    calcCloable: function () {
      return this.closable
    }
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
        el.onmousedown = function () {
          if (event.target.className !== 'my_dialog_title') {
            return
          }
          // (clientX, clientY)点击位置距离当前可视区域的坐标(x，y)
          // offsetLeft, offsetTop 距离上层或父级的左边距和上边距
          // 获取鼠标在弹窗中的位置
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
        // 布局的过程中重复居中
        window.onresize = function () {
          vnode.style.left = '50%'
          vnode.style.top = '50%'
        }
      }
    },
    // 右边拖动事件
    rightDrag: {
      inserted: function (el, binding, vnode) {
        console.log('----right drag 执行执行了注册--------')
        vnode = vnode.elm
        el.onmousedown = function () {
          // 获取鼠标在弹窗中的位置
          const mouseX = event.clientX - vnode.offsetLeft
          const mouseY = event.clientY - vnode.offsetTop
          console.log('clientX：' + event.clientX)
          console.log('clientY：' + event.clientY)
          console.log('mouseX:' + mouseX + ';mouseY:' + mouseY)
          document.onmousemove = function (e) {
            console.log('------')
          }
        }
      }
    },
    // 底部拉动div的大小
    bottomDrag: {
      inserted: function (el, binding, vnode) {
        vnode = vnode.elm
        el.onmousedown = function (e) {
          const bottomBoard = document.getElementById('my_dialog_bottom_border')
          const mouseStart = {}
          const bottomStart = {}
          el.onmousedown = function (e) {
            const oEvent = e || event
            mouseStart.x = oEvent.clientX
            mouseStart.y = oEvent.clientY
            bottomStart.y = bottomBoard.offsetTop
            document.onmousemove = function (e) {
              const oEvent = e || event
              const t = oEvent.clientY - mouseStart.y + bottomStart.y
              const h = t + bottomBoard.offsetHeight
              console.log('h:' + h)
              // document.getElementById('my_dialog_content').style.height = h + 'px'
            }
            document.onmouseup = function (e) {
              document.onmousemove = null
              document.onmouseout = null
            }
          }
        }
      }
    }
  }
}
</script>
<style scoped>
  .my_dialog {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .my_dialog_mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #000;
    opacity: 0.5;
  }
  .my_dialog_box {
    position: absolute;
    background: #fff;
    top: 50%;
    left: 50%;
    max-width: 100%;
    border-radius: 3px;
    overflow: hidden;
    transform: translate(-50%, -50%);
  }
  .my_dialog_content {
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    padding: 8px;
    text-align: left;
    box-sizing: border-box;
    height: calc(100% - 74px);
  }
  .my_dialog_title {
    cursor: all-scroll;
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
  }
  .my_dialog_close {
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
  .my_dialog_close:hover {
    color: #409eff;
  }
  .my_dialog_bottom {
    margin: 0;
    padding: 0;
    text-align: center;
    height: 32px;
    line-height: 32px;
    /*border-top: 1px solid transparent;*/
    border-top: 1px solid #e7e8eb;
  }
  .my_dialog_bottom_border {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: calc(100% - 15px);
    height: 10px;
    cursor: s-resize;
  }
  .my_dialog_right_border {
    position: absolute;
    top: 0px;
    right: 0px;
    height: calc(100% - 15px);
    width: 4px;
    cursor: w-resize;
  }
  .my_dialog_right_bottom_border {
    position: absolute;
    right: 0px;
    bottom: 0px;
    height: 15px;
    width: 15px;
    cursor: se-resize;
  }
  .btn {
    min-width: 60px;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    padding: 5px 15px;
    border-radius: 3px;
    text-decoration: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .my_dialog_bottom .cancelBtn:focus,
  .my_dialog_bottom .cancelBtn:hover {
    color: #409eff;
    background: #ecf5ff;
    border: 1px solid #b3d8ff;
  }
  .my_dialog_bottom .confirmBtn:focus,
  .my_dialog_bottom .confirmBtn:hover {
    background: #66b1ff;
    border: 1px solid #66b1ff;
    color: #fff;
  }
  .my_dialog_bottom .confirm_btn .marginLeft {
    margin-left: 10px;
  }
  .cancelBtn {
    border: 1px solid #dcdfe6;
    background-color: #fff;
    color: #606266;
  }
  .confirmBtn {
    border: 1px solid #409eff;
    background-color: #409eff;
    color: #fff;
  }
  button + button {
    margin-left: 15px;
  }
</style>
