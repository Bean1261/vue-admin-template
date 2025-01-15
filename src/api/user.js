import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 用户登录信息 { phone, password }
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param {String} token - 用户的 token
 * @returns {Promise} - 返回用户信息，包含 roles、name、avatar 等
 */
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 搜索用户
 * @param {String} query - 搜索关键字
 * @returns {Promise} - 返回用户列表
 */
export function searchUsers(query) {
  return request({
    url: '/user/search',
    method: 'get',
    params: { query },
  });
}