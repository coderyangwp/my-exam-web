import request from '@/utils/request'

export function list(dto) {
  return request({
    url: '/role/list',
    method: 'get',
    params: dto
  })
}

export function save(data) {
  return request({
    url: 'role/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/role/del/' + ids,
    method: 'delete'
  })
}

export function detail(id) {
  return request({
    url: '/role/detail' + id,
    method: 'put'
  })
}
