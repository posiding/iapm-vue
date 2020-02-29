// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView, PageTable } from '@/layouts'
/*import { bxAnaalyse } from '@/core/icons'*/

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/user/login',
    children: [
      // org
      {
        path: '/org',
        name: 'org',
        component: PageTable,
        meta: { title: '组织机构', keepAlive: true, icon: 'contacts' },
        children: [
          {
            path: 'test',
            name: 'test',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/org/unit/OrgUnitTest'),
            meta: { title: '组件测试', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: 'unit',
            name: 'unit',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/org/unit/OrgUnitList'),
            meta: { title: '单位管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: 'department',
            name: 'department',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/org/department/OrgDepartmentList'),
            meta: { title: '部门管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: 'position',
            name: 'position',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/org/position/OrgPositionList'),
            meta: { title: '职级管理', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      },
      // system
      {
        path: '/sys',
        name: 'sys',
        component: PageTable,
        meta: { title: '系统管理', keepAlive: true, icon: 'build' },
        children: [
          {
            path: 'menu',
            name: 'sysMenu',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/sys/menu/SysMenuList'),
            meta: { title: '菜单管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: 'dict',
            name: 'sysDict',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/sys/dict/SysDictList'),
            meta: { title: '数据字典', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: 'cluster',
            name: 'sysClusterNode',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/sys/cluster/SysClusterNodeList'),
            meta: { title: '集群节点', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
