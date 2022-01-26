import request from '@/utils/request'

/**
 * 专业列表
 * @param query
 * @returns {AxiosPromise}
 */
export function majorList(query) {
  return request({
    url: '/major/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取专业信息
 * @param id  专业id
 * @returns {AxiosPromise}
 */
export function majorDetail(id) {
  return request({
    url: '/major/' + id,
    method: 'get'
  })
}

/**
 * 新增专业
 * @param data  专业信息
 * @returns {AxiosPromise}
 */
export function addMajor(data) {
  return request({
    url: '/major/add',
    method: 'post',
    data: data
  })
}

/**
 * 更新专业信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateMajor(data) {
  return request({
    url: '/major/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除专业
 * @param ids 专业id
 * @returns {AxiosPromise}
 */
export function delMajor(ids) {
  return request({
    url: '/major/del/' + ids,
    method: 'get'
  })
}

/**
 * 课程列表
 * @param courseDto
 * @returns {AxiosPromise}
 */
export function courseList(courseDto) {
  return request({
    url: '/course/list',
    method: 'get',
    params: courseDto
  })
}

/**
 * 新增/修改课程
 * @param course
 * @returns {AxiosPromise}
 */
export function saveCourse(course) {
  return request({
    url: '/course/save',
    method: 'post',
    data: course
  })
}

/**
 * 删除课程
 * @param ids
 * @returns {AxiosPromise}
 */
export function delCourse(ids) {
  return request({
    url: '/course/del/' + ids,
    method: 'get'
  })
}
