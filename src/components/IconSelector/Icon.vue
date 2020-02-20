<template>
  <a-modal
    :visible="iconShow"
    :width="900"
    :keyboard=false
    :closable=false
    :centered=true
    :maskClosable="maskClosable"
    :mask="mask"
    @ok="selectIcon"
    @cancel="hiddenSelect"
    >
    <a-tabs>
      <a-tab-pane v-for="(v, i) in icons" :tab="v.title" :key="i">
        <ul>
          <li v-for="(icon, key) in v.icons" :key="`${v.title}-${key}`" :class="{ 'active': selectedIcon==icon }">
            <a-icon :type="icon" :style="{ fontSize: '36px' }" @click="handleSelectedIcon(icon)" />
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import icons from './icons'

export default {
  name: 'IconSelect',
  data () {
    return {
      iconShow: false,
      maskClosable: false,
      mask: true,
      selectedIcon: '',
      icons
    }
  },
  computed: {
    visable: {
      get: function () {
        return this.iconSelectVisiable
      },
      set: function () {
      }
    }
  },
  methods: {
    show (defaultIcon) {
      this.iconShow = true
      // 设置默认选中的icon图标
      if (defaultIcon && defaultIcon != null && defaultIcon !== '') {
        this.selectedIcon = defaultIcon
      }
    },
    selectIcon () {
      this.$emit('choose', this.selectedIcon)
      this.iconShow = false
    },
    hiddenSelect () {
      this.iconShow = false
    },
    handleSelectedIcon (icon) {
      this.selectedIcon = icon
    }
  }
}
</script>

<style lang="less" scoped>
  ul{
    list-style: none;
    padding: 0;
    overflow-y: scroll;
    height: 250px;
    li{
      display: inline-block;
      padding:5px;
      margin:5px;
      &:hover {
        cursor: pointer;
      }
      &.active{
        box-shadow: 0px 0px 5px 2px #888888;
      }
    }
  }

  .ant-tabs-tab{
    margin: 0 8px 0 0;
    padding: 10px;
  }
</style>
