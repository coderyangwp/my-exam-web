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
export function saveDictChild(dictDetail) {
  return request({
    url: '/dict/saveChild',
    method: 'post',
    data: dictDetail
  })
}
/**
 * 删除字典
 * @param ids
 * @returns
 */
export function delDict(ids) {
  return request({
    url: '/dict/del/' + ids,
    method: 'get'
  })
}
/**
 * 删除字典数据
 * @param ids
 * @returns
 */
export function deleteDictChild(ids) {
  return request({
    url: '/dict/child/' + ids,
    method: 'get'
  })
}

export function dictAll() {
  return request({
    url: '/dict/listAll',
    method: 'get'
  })
}
