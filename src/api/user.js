import request from '@/utils/request'

export function captcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

export function login(loginDto) {
  return request({
    url: '/user/login',
    method: 'post',
    data: loginDto
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
