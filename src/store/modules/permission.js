import { asyncRoutes, constantRoutes } from '@/router';

/**
 * 根据用户角色过滤异步路由
 * @param {Array} routes 异步路由数组
 * @param {Array} roles 用户角色数组
 * @returns {Array} 过滤后的路由
 */
function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

/**
 * 判断用户是否有访问该路由的权限
 * @param {Array} roles 用户角色数组
 * @param {Object} route 路由对象
 * @returns {Boolean}
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  return true;
}

const state = {
  routes: [], // 完整路由（包含基础路由和动态路由）
  addRoutes: [] // 动态生成的路由
};

const mutations = {
  SET_ROUTES(state, routes) {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes); // 基础路由和动态路由合并
  }
};

const actions = {
  /**
   * 根据角色生成可访问路由
   * @param {Function} commit Vuex 提交方法
   * @param {Array} roles 用户角色数组
   * @returns {Promise} 生成后的路由
   */
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes;
      if (roles.includes('admin')) {
        // 如果是管理员，拥有全部路由权限
        accessedRoutes = asyncRoutes || [];
      } else {
        // 根据角色过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
};
