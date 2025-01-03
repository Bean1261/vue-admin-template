import axios from 'axios';

const API_BASE_URL = '/api/roles';

export default {
  // 获取所有角色
  getRoles() {
    return axios.get(API_BASE_URL);
  },

  // 获取单个角色
  getRoleById(id) {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  // 添加新角色
  addRole(roleData) {
    return axios.post(API_BASE_URL, roleData);
  },

  // 编辑角色
  updateRole(id, roleData) {
    return axios.put(`${API_BASE_URL}/${id}`, roleData);
  },

  // 删除角色
  deleteRole(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
