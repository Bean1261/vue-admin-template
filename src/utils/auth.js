import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

// 从Cookie中获取token令牌
export function getToken() {
  return Cookies.get(TokenKey)
}

// 保存token令牌到Cookie中
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除Cookie中的token令牌
export function removeToken() {
  return Cookies.remove(TokenKey)
}
