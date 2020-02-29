export default {
  name: 'IDialog',
  props: {
    value: Boolean,
    mask: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: false },
    dragable: { type: Boolean, default: true },
    resizeable: { type: Boolean, default: true },
    zIndex: { type: [Number, String] },
    width: { type: [Number, String], default: '70%' },
    height: { type: [Number, String], default: '70%' },
    top: { type: [Number, String], default: '50%' },
    left: { type: [Number, String], default: '50%' },
    showHeader: { type: Boolean, default: true },
    title: { type: String, default: '' },
    showFooter: { type: Boolean, default: true },
    maxable: { type: Boolean, default: true },
    closeable: { type: Boolean, default: true },
    okButton: { type: Boolean, default: true },
    okType: { type: String, default: 'primary' },
    okText: { type: String, default: '确定' },
    cancelButton: { type: Boolean, default: true },
    cancelType: { type: String, default: '' },
    cancelText: { type: String, default: '取消' }
  },
  data () {
    return {
      visiable: false
    }
  },
  methods: {
    // 窗口关闭事件
    closeDialog: function () {
      this.close()
    },
    // 提交
    submitDialog: function () {
      this.$emit('ok')
    },
    // 关闭
    maskClosableClose: function () {
      if (this.maskClosable) {
        this.close()
      }
    },
    // 打开
    open: function () {
      this.visiable = true
    },
    // 关闭
    close: function (type) {
      const { events = {}, visiable } = this
      if (visiable) {
        setTimeout(() => {
          this.visiable = false
          // 同步刷新父窗口的数据
          if (!events.hide) {
            this.$emit('input', false)
          }
        }, 50)
      }
    },
    //  获取窗口函数
    getDocumentProperty: function () {
      const documentElement = document.documentElement
      const bodyElem = document.body
      const visibleHeight = documentElement.clientHeight || bodyElem.clientHeight
      const visibleWidth = documentElement.clientWidth || bodyElem.clientWidth
      return {
        visibleWidth: visibleWidth,
        visibleHeight: visibleHeight
      }
    },
    // 拖拽移动
    headerMouseDown: function (event) {
      // 判断是否允许移动
      if (this.dragable) {
        const { marginSize } = this
        const dialogBoxElem = this.$refs.dialogBox
        if (event.target.className === 'i_dialog_header') {
          event.preventDefault()
          const defaultMouseMove = document.onmousemove
          const defaultMouseUp = document.onmouseup
          const disX = event.clientX - dialogBoxElem.offsetLeft
          const disY = event.clientY - dialogBoxElem.offsetTop
          const { visibleHeight, visibleWidth } = this.getDocumentProperty()
          document.onmousemove = function (event) {
            event.preventDefault()
            const offsetWidth = dialogBoxElem.offsetWidth
            const offsetHeight = dialogBoxElem.offsetHeight
            const minX = marginSize
            const maxX = visibleWidth - offsetWidth - marginSize
            const minY = marginSize
            const maxY = visibleHeight - offsetHeight - marginSize
            let moveleft = event.clientX - disX
            let moveTop = event.clientY - disY
            if (moveleft > maxX) {
              moveleft = maxX
            }
            if (moveleft < minX) {
              moveleft = minX
            }
            if (moveTop > maxY) {
              moveTop = maxY
            }
            if (moveTop < minY) {
              moveTop = minY
            }
            dialogBoxElem.style.left = `${moveleft}px`
            dialogBoxElem.style.top = `${moveTop}px`
          }
          document.onmouseup = function () {
            document.onmousemove = defaultMouseMove
            document.onmouseup = defaultMouseUp
          }
        }
      }
    },
    getClassNameArrByClass: function (className) {
      const element = document.querySelector('.' + className)
      if (element != null) {
        const classNames = element.className
        if (classNames !== null && className !==  '' ) {
          return classNames.split(' ')
        }
      }
      return null
    },
    // 拖拽改变大小
    resizeEvent: function (event) {
      // 允许拖动的时候才允许触发事件
      if (this.resizeable) {
        event.preventDefault()
        const dialogBox = this.$refs.dialogBox
        const startX = event.clientX
        const startY = event.clientY
        const boxWidth = dialogBox.clientWidth
        const boxHeight = dialogBox.clientHeight
        const defaultMouseMove = document.onmousemove
        const defaultMouseUp = document.onmouseup

        // 移动的时候触发
        document.onmousemove = function (event) {
          const endX = event.clientX
          const endY = event.clientY
          const disX = endX - startX
          const disY = endY - startY
          const totalWidth = boxWidth + disX
          const totalHeight = boxHeight + disY
          dialogBox.style.width = totalWidth + 'px'
          dialogBox.style.height = totalHeight + 'px'
        }
        // 释放鼠标的时候触发
        document.onmouseup = function () {
          document.onmousemove = defaultMouseMove
          document.onmouseup = defaultMouseUp
        }
      }
    },
    // 判断是否为数字
    isNumber: function (value) {
      if (value === '' || value == null) {
        return false
      }
      if (!isNaN(value.toString())) {
        return true
      } else {
        return false
      }
    },
    // 判断是否存在百分比
    isPercentage: function (value) {
      if (value === '' || value == null) {
        return false
      }
      return value.toString().indexOf('%') !== -1
    }
  },
  computed: {
    // 计算宽度
    dialogWidth: function () {
    },
    // 计算高度
    dialogHeight: function () {
    },
    showTitle: function () {
      return this.title + '--' + this.visiable
    }
  },
  watch: {
    // 监听value的变化
    value (visiable) {
      this[visiable ? 'open' : 'close']()
    }
  },
  render (h) {
    const {
      $scopedSlots,
      slots = {}
    } = this
    const defaultSlot = $scopedSlots.default || slots.default
    const footerSlot = $scopedSlots.footer || slots.footer
    const headerSlot = $scopedSlots.header || slots.header
    let boxWidth = ''
    if (this.isNumber(this.width)) {
      boxWidth = this.width + 'px'
    } else {
      boxWidth = this.width
    }
    console.log('boxWidth:' + boxWidth)
    return h('div',
      {
        class: ['i_dialog_wrapper', {
          'is_active': this.visiable,
          'is_mask': this.mask
        }],
        style: {
          zIndex: this.zIndex
        },
        on: {
          click: this.maskClosableClose
        }
      },
      // 展示弹出窗口
      [
        h('div', {
          class: ['i_dialog_box', {
            'percent_transform': this.isPercentage(this.top.toString()) && this.isPercentage(this.left.toString())
          }],
          style: {
            zIndex: this.zIndex,
            top: this.top ? this.top : '50%',
            left: this.left ? this.left : '50%',
            width: boxWidth,
            height: this.isNumber(this.height) ? this.height + 'px' : this.height
          },
          ref: 'dialogBox'
        }, [
          // 绘制标题行
          this.showHeader ? headerSlot ? headerSlot.call(this, { $modal: this }, h) : h('div', {
            class: ['i_dialog_header'],
            on: {
              mousedown: this.headerMouseDown
            }
          }, [
            // 回写title
            h('span', { class: ['i_dialog_header_title'] }, this.showTitle),
            // 回写最大化窗口 //TODO(待完成)
            // 回写关闭按钮
            this.closeable ? h('span', { class: ['i_dialog_close'], on: { click: this.closeDialog } }, 'X') : null
          ]) : null,
          // 绘制内容行
          h('div', { class: ['i_dialog_main'] }, [defaultSlot ? defaultSlot.call(this, { $modal: this }, h) : '']),
          // 绘制footer行
          this.showFooter ? footerSlot ? footerSlot.call(this, { $modal: this }, h) : h('div', { class: ['i_dialog_footer'] }, [
            // 绘制确定按钮
            this.okButton ? h('a-button', { class: ['ant-btn', 'ant-btn-primary', 'ant-btn-sm'], on: { click: this.submitDialog } }, this.okText) : null,
            // 绘制取消按钮
            this.cancelButton ? h('a-button', { class: ['ant-btn', 'ant-btn-sm'], on: { click: this.closeDialog } }, this.cancelText) : null
          ]) : null,
          // 绘制拖拉拽内容
          this.resizeable ? h('span', { class: ['i_dialog_resize'] }, [
            // 东南方向改变大小
            h('span', {
              class: 'es-resize',
              attrs: {
                'data-type': 'es'
              },
              on: {
                mousedown: this.resizeEvent
              }
            }, '')
          ]) : null
        ])
      ]
    )
  }
}
