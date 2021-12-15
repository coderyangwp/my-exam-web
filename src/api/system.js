import request from '@/utils/request'

/**
 * 字典列表
 * @param query
 * @returns {AxiosPromise}
 */
export function dictList(query) {
  return request({
    url: '/dict/list',
    method: 'get',
    params: query
  })
}

/**
 * 根据字典代码获取子数据
 * @param dict_code
 * @returns {AxiosPromise}
 */
export function dictDetail(dict_code) {
  return request({
    url: 'dict/' + dict_code,
    method: 'get'
  })
}

/**
 * 新增字典
 * @param dict
 * @returns {AxiosPromise}
 */
export function saveDict(dict) {
  return request({
    url: '/dict/save',
    method: 'post',
    data: dict
  })
}

/**
 * 新增字典子数据
 * @param dictDetail
 * @returns {AxiosPromise}
 */
export function addDictChild(dictDetail) {
  return request({
    url: '/dict/addChild',
    method: 'post',
    data: dictDetail
  })
}
