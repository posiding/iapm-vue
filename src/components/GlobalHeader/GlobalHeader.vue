<template>
  <transition name="showHeader">
    <div class="header-animat">
      <a-layout-header
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
        :style="{ padding: '0', background: '#001529', height: '50px', lineHeight: '50px'}">
        <div class="header" >
          <div class="appArea" style="width: 50px">
            <a-icon v-if="device==='mobile'" class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle"/>
            <a-icon v-else class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggle"/>
          </div>
          <!--<user-menu></user-menu>-->
          <div class="appArea active" @click="setModule(1)">组织机构</div>
          <div class="appArea" @click="setModule(2)">系统管理</div>
          <!--<span style="padding-left: 0px;width:100px;height: 50px;line-height: 50px;font-size: 14px;" title="点击展示所有的系统引用">系统应用</span>
          <span style="padding-left: 0px;width:100px;height: 50px;line-height: 50px;font-size: 14px;" title="点击展示所有的系统引用">组织机构</span>
          <span style="padding-left: 0px;width:100px;height: 50px;line-height: 50px;font-size: 14px;" title="点击展示所有的系统引用">系统管理</span>-->
        </div>
        <!--原始内容 modify by ivan 2019年11月14日-->
        <!--<div v-if="mode === 'sidemenu'" class="header">
          <a-icon v-if="device==='mobile'" class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle"/>
          <a-icon v-else class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggle"/>
          <user-menu></user-menu>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'"/>
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme" />
              <a-icon v-else class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle" />
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>-->
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data () {
    return {
      visible: true,
      oldScrollTop: 0
    }
  },
  mounted () {
    document.body.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  methods: {
    setModule (id) {
      this.$emit('switch', id)
    },
    handleScroll () {
      if (!this.autoHideHeader) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  },
  beforeDestroy () {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less">
.header-animat{
  position: relative;
  z-index: 2;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter, .showHeader-leave-to {
  opacity: 0;
}
.appArea{
  width: 100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  float: left;
  cursor: pointer;
}
.appArea:hover{
  background: #1890FF;
  font-size: 14px;
  color: #ffffff;
}

.active{
  background: #1890FF;
  font-size: 14px;
  color: #ffffff;
}
</style>
