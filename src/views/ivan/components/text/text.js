export default {
  name: 'IText',
  props: {
    id: {
      type: Number,
      default: 1,
      foo: true
    },
    divStyle: {
      type: Object,
      default: () => {
        return {
          width: '100px',
          height: '100px',
          border: '1px solid red'
        }
      }
    }
  },
  methods: {
    localClick: function () {
      alert('local click')
    },
    parentClick: function () {
      this.$emit('click')
    }
  },
  render (h) {
    const divText = `<h${this.id}>${this.$slots.default[0].text}</h>`
    return (
      <div style={this.divStyle} class={{ foo: this.foo}}>
        <div domPropsInnerHTML={divText} onclick={this.parentClick}>nihao</div>
        <button onclick={this.localClick}>按钮</button>
      </div>
    )
  }
}