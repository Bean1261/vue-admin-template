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
    token: getToken(), // 从本地存储中获取Token
    name: '', // 用户名称
    avatar: '', // 用户头像
    roles: [] // 用户角色列表
  }
}

// 定义初始状态
const state = getDefaultState()

/**
 * 定义状态变更函数
 */
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    const rolesArray = Array.isArray(roles) ? roles : [roles] // 确保 roles 为数组
    state.roles = rolesArray
  }
}

/**
 * 定义异步操作函数
 */
const actions = {
  /**
   * 用户登录
   * @param {Object} commit Vuex的commit函数，用于调用mutation
   * @param {Object} userInfo 用户登录信息，包含手机号和密码
   * @returns {Promise} 返回一个Promise对象
   */
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password }).then(response => {
        console.log('Login API response:', response) // 检查返回数据
        const { data } = response
        if (!data || !data.token) {
          reject('登录失败，未返回有效的 Token')
          return
        }
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        console.error('Login API Error:', error) // 捕获异常
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
      getInfo(state.token).then(response => {
        const data = response.data
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { roles = [], name = '', avatar = '' } = data || {}
        if (!roles || roles.length === 0) {
          reject('getInfo: roles must be a non-empty array!')
          return
        }

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        addRoutes()
        resolve(data)
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
        removeToken()
        resetRouter()
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
      removeToken()
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
