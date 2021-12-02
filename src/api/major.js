import request from '@/utils/request'

export function majorList(query) {
  return request({
    url: '/major/list',
    method: 'get',
    params: query
  })
}

export function majorDetail(code) {
  return request({
    url: '/major/' + code,
    method: 'get'
  })
}

export function addMajor(data) {
  console.log(data)
  return request({
    url: '/major/save',
    method: 'post',
    data: data
  })
}
