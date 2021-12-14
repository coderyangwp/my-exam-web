import request from '@/utils/request'

export function majorList(query) {
  return request({
    url: '/major/list',
    method: 'get',
    params: query
  })
}

export function majorDetail(id) {
  return request({
    url: '/major/' + id,
    method: 'get'
  })
}

export function addMajor(data) {
  return request({
    url: '/major/add',
    method: 'post',
    data: data
  })
}

export function updateMajor(data) {
  return request({
    url: '/major/update',
    method: 'post',
    data: data
  })
}
