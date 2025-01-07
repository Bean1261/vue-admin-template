// 引入登录、登出、获取用户信息的API函数
import { login, logout, getInfo } from '@/api/user'
// 引入获取、设置、移除Token的工具函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入重置路由的函数
import { resetRouter } from '@/router'
// 引入动态加载路由的函数
import { addRoutes } from '@/router'
/**
 * 获取默认状态
 * @returns {Object} 默认状态对象
 */
const getDefaultState = () => {
  return {
    // 从本地存储中获取Token
    token: getToken(),
    // 用户名称
    name: '',
    // 用户头像
    avatar: '',
    // 用户角色列表
    roles: [] // 新增 roles 属性，用来存储用户角色
  }
}

// 定义初始状态
const state = getDefaultState()

/**
 * 定义状态变更函数
 */
const mutations = {
  // 重置状态
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置Token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置用户名称
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 设置用户头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 设置用户角色
  SET_ROLES: (state, roles) => { // 新增 SET_ROLES mutation 来更新角色
    console.log('SET_ROLES called with:', roles); // 输出传入的数据
    const rolesArray = Array.isArray(roles) ? roles : [roles]; // 确保 roles 为数组
    state.roles = rolesArray;
    console.log('State.roles after SET_ROLES:', state.roles); // 输出最终 state.roles
  }
}

/**
 * 定义异步操作函数
 */
const actions = {
  /**
   * 用户登录
   * @param {Object} commit Vuex的commit函数，用于调用mutation
   * @param {Object} userInfo 用户登录信息，包含用户名和密码
   * @returns {Promise} 返回一个Promise对象
   */
  login({ commit }, userInfo) {
    // 解构赋值，从userInfo中提取username和password
    const { username, password } = userInfo
    // 返回一个Promise对象，用于处理异步操作
    return new Promise((resolve, reject) => {
      // 调用登录API，传入用户名和密码
      login({ username: username.trim(), password: password }).then(response => {
        // 从响应中提取数据
        const { data } = response
        // 调用mutation，设置token
        commit('SET_TOKEN', data.token)
        // 将token存储到本地存储
        setToken(data.token)
        // 操作成功，调用resolve函数
        resolve()
      // 捕获异常，打印错误信息，并调用reject函数
      }).catch(error => {
        console.error('Login Error:', error)
        reject(error)
      })
    })
  },


 /**
 * 获取用户信息
 * @param {Object} commit Vuex的commit函数，用于调用mutation
 * @param {Object} state Vuex的state对象
 * @returns {Promise} 返回一个Promise对象
 */
getInfo({ commit, state }) {
  return new Promise((resolve, reject) => {
    // 调用getInfo API获取用户信息，传入state中的token
    getInfo(state.token).then(response => {

      const data = response.data; // 确保解包正确
      if (!data) {
        return reject('Verification failed, please Login again.');
      }

      // 提取用户信息
      const { roles = [], name = '', avatar = '' } = data || {};
      console.log('Extracted roles:', roles); // 验证 roles 是否正确提取
      // 校验roles数据，确保为非空数组
      if (!roles || roles.length === 0) {
        reject('getInfo: roles must be a non-empty array!')
        return
      }
      
      // 调用mutation，设置name、avatar和roles
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_ROLES', roles)

      // 在获取用户信息并设置角色后，调用 addRoutes 动态加载路由
      addRoutes()
      // 操作成功，调用resolve函数并返回数据
      resolve(data)
    // 捕获异常，打印错误信息，并调用reject函数
    }).catch(error => {
      console.error('GetInfo Error:', error)
      reject(error)
    })
  })
},

  /**
   * 用户登出
   * @param {Object} commit Vuex的commit函数，用于调用mutation
   * @param {Object} state Vuex的state对象
   * @returns {Promise} 返回一个Promise对象
   */
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 先移除 token
        resetRouter() // 重置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        console.error('Logout Error:', error)
        reject(error)
      })
    })
  },

  /**
   * 重置Token
   * @param {Object} commit Vuex的commit函数，用于调用mutation
   * @returns {Promise} 返回一个Promise对象
   */
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先移除 token
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 导出模块，设置命名空间为true
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
