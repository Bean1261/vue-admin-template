import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'  // 引入 Vuex

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    path: '/example',
    component: Layout,
    redirect: '/example/security',
    name: 'Example',
    meta: { title: '流程申请', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'security',
        name: 'SecurityManagement',
        component: () => import('@/views/table/tree/index'),
        meta: { title: '安全管理', icon: 'table', roles: ['admin', 'editor'] },
      },
      {
        path: 'inspection',
        name: 'SafetyInspection',
        component: () => import('@/views/table/tree/index'),
        meta: { title: '安全巡查', icon: 'tree', roles: ['admin', 'editor'] },
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    alwaysShow: true,
    name: 'system',
    meta: { title: '系统管理', icon: 'el-icon-s-help', roles: ['admin'] },
    children: [
      {
        path: 'sysUserList',
        name: 'sysUserList',
        component: () => import('@/views/system/sysUserList'),
        meta: { title: '用户管理', icon: 'table', roles: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

// 根据角色动态加载路由
export function addRoutes() {
  const roles = store.getters['user/roles'];  // 获取当前用户的角色
  console.log('User roles:', roles); // 输出用户角色

  const accessibleRoutes = filterRoutes(asyncRoutes, roles);  // 根据角色过滤路由
  console.log('Filtered Accessible Routes:', accessibleRoutes); // 输出过滤后的路由

  router.addRoutes([...accessibleRoutes, { path: '*', redirect: '/404', hidden: true }]); // 动态添加路由
  console.log('Router options after addRoutes:', router.options.routes); // 输出完整路由配置
}


/**
 * 根据角色过滤路由
 * @param {Array} routes - 路由配置数组
 * @param {Array} roles - 当前用户的角色数组
 * @returns {Array} 返回过滤后的路由配置数组
 */
function filterRoutes(routes, roles) {
  if (!Array.isArray(routes)) {
    console.error('filterRoutes: routes must be an array:', routes);
    return [];
  }

  if (!Array.isArray(roles) || roles.length === 0) {
    console.error('filterRoutes: roles must be a non-empty array:', roles);
    return [];
  }

  const res = [];
  routes.forEach(route => {
    // 深拷贝避免修改原始路由配置
    const tmp = { ...route };

    console.log('Processing route:', tmp);

    // 检查当前路由是否有权限
    if (hasPermission(roles, tmp)) {
      console.log('Route permitted:', tmp.name);

      // 如果有子路由，递归过滤子路由
      if (tmp.children && Array.isArray(tmp.children)) {
        tmp.children = filterRoutes(tmp.children, roles);
      }

      // 将过滤后的路由添加到结果中
      res.push(tmp);
    } else {
      console.log('Route denied:', tmp.name);
    }
  });

  console.log('Filtered routes:', res);
  return res;
}

// 检查角色是否有权限访问该路由
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))  // 判断角色是否有权限
  }
  return true
}

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
