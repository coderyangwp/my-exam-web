import request from '@/utils/request'

export function majorList(query) {
  console.log(query)
  return request({
    url: '/major/list',
    method: 'get',
    params: query
  })
}
