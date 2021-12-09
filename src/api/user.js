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
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
