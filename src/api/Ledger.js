import request from '@/utils/request';

/**
 * 添加隐患排查治理台账记录
 * @param {Object} data - 台账表单数据
 * @returns {Promise}
 */
export function addLedgerEntry(data) {
  return request({
    url: '/ledger/add',
    method: 'post',
    data,
  });
}

/**
 * 更新隐患排查治理台账记录
 * @param {String} id - 台账记录的 ID
 * @param {Object} data - 更新的台账数据
 * @returns {Promise}
 */
export function updateLedgerEntry(id, data) {
  return request({
    url: `/ledger/update/${id}`,
    method: 'put',
    data,
  });
}

/**
 * 删除隐患排查治理台账记录
 * @param {String} id - 台账记录的 ID
 * @returns {Promise}
 */
export function deleteLedgerEntry(id) {
  return request({
    url: `/ledger/delete/${id}`,
    method: 'delete',
  });
}

/**
 * 获取隐患排查治理台账记录列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getLedgerEntries(params) {
  return request({
    url: '/ledger/list',
    method: 'get',
    params,
  });
}
