<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu系统应用
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu系统应用>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
    ></side-menu>

    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh', background: '#E8EDF4', overflow: 'hidden', height: '100%' }">
      <div class="content-table-full">
        <div class="content-table-full-head">
          <global-header
            :mode="layoutMode"
            :theme="navTheme"
            :collapsed="collapsed"
            :device="device"
            @switch="switchModule"
            @toggle="toggle"
          />
        </div>
        <div class="content-table-full-content">
          <a-layout-content :style="{ height: '100%', paddingTop: '0px' , overflow: 'hidden', background: '#F9F9F9'}">
            <transition name="page-transition">
              <route-view />
            </transition>
          </a-layout-content>
        </div>
      </div>
      <!--<setting-drawer v-if="!production"></setting-drawer>-->
    </a-layout>
  </a-layout>

</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'
import RouteView from './RouteView'
import MultiTab from '@/components/MultiTab'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { BasicLayout, PageTable } from '@/layouts'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    MultiTab,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer,
    BasicLayout,
    PageTable
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      menus: []
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '200px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    console.log('---------------------------------------')
    console.table(this.menus)
    console.log('---------------------------------------')
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    switchModule (id) {
      const orgRoute = []
      if (id === 1) {
        orgRoute.push({
          path: '/org',
          name: 'org',
          component: import('@/layouts/BasicLayout'),
          meta: { title: '组织机构' },
          children: [{
            path: '/org/position',
            name: 'position',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: import('@/views/org/position/OrgPositionList'),
            meta: { title: '职级管理', keepAlive: true, permission: [ 'table' ] }
          }]
        })
      } else {
        orgRoute.push({
          path: '/sys',
          name: 'sys',
          component: import('@/layouts/BasicLayout'),
          meta: { title: '系统管理' },
          children: [{
            path: '/sys/menu',
            name: 'sysMenu',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: import('@/views/sys/menu/SysMenuList'),
            meta: { title: '菜单管理', keepAlive: true, permission: [ 'table' ] }
          }]
        })
      }
      this.menus = orgRoute
      // 主模块切换
      console.log('--------->:' + id)
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect () {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
@import url('../components/global.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.content-table-full{
  width: 100%;
  height: 100vh;
}
.content-table-full-head {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.content-table-full-content{
  width: 100%;
  height:calc(100vh - 50px);
  padding: 10px;
}
</style>
