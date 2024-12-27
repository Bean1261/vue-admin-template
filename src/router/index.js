import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/系统管理',
    component: Layout,
    alwaysShow: true,
    name: 'system',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/sysUserList',
        name: 'sysUserList',
        component: () => import('@/views/system/sysUserList'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: '/sysRoleList',
        name: 'sysRoleList',
        component: () => import('@/views/system/sysRoleList'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: '/sysMenuList',
        name: 'sysMenuList',
        component: () => import('@/views/system/sysMenuList'),
        meta: { title: '菜单管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '流程申请', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/tree/index'),
        meta: { title: '安全管理', icon: 'table' },
        children: [
          {
            path: 'tree',
            name: 'Tree',
            component: () => import('@/views/table/tree/index'),
            meta: { title: '安全巡查添加', icon: 'tree' }
          },
          {
            path: 'form',
            name: 'Form',
            component: () => import('@/views/table/tree/index'),
            meta: { title: '安全巡查', icon: 'form' }
          }
        ]
      }
    ]
  },

  // 新增的流程管理模块
  {
    path: '/flow',
    component: Layout,
    alwaysShow: true,
    name: 'FlowManagement',
    meta: { title: '流程管理', icon: 'el-icon-rank' },
    children: [
      {
        path: 'design',
        name: 'FlowDesign',
        component: () => import('@/views/flow/FlowDesign'),
        meta: { title: '流程设计', icon: 'el-icon-edit' }
      },
      {
        path: 'approval',
        name: 'FlowApproval',
        component: () => import('@/views/flow/FlowApproval'),
        meta: { title: '流程审批', icon: 'el-icon-check' }
      },
      {
        path: 'logs',
        name: 'FlowLogs',
        component: () => import('@/views/flow/FlowLogs'),
        meta: { title: '流程日志', icon: 'el-icon-document' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
