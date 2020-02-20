import Input from 'ant-design-vue/es/input/Input'

export default {
  name: 'QInput',
  props: Object.assign({}, Input.props, {
    opt: {
      validator: function (value) {
        return ['like', 'eq', 'gt', 'gte', 'lt', 'lte'].indexOf(value) !== -1
      }
    },
    name: {
      type: String,
      required: true
    },
    context: {
      type: Object
    }
  }),
  created: function () {
    // 如果存在默认值，此处需要考虑默认值设置
    this.$set(this.context, this.name, {
      opt: this.opt,
      values: []
    })
  },
  methods: {
    onChange: function (ele) {
      let tempVal = ''
      if (ele != null) {
        tempVal = ele.target.value
      }
      // 第一种写法
      this.$set(this.context, this.name, {
        opt: this.opt,
        values: [tempVal]
      })
    }
  },
  render () {
    const props = {}
    props['value'] = this.context[this.name].values[0]
    Object.keys(Input.props).forEach(k => {
      this[k] && (props[k] = this[k])
    })
    return (
      <a-input {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.onChange}>
          { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-input>
    )
  }
}
