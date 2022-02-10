import request from '@/utils/request'

/**
 * 考试列表
 * @returns
 */
export function examList(examDto) {
  return request({
    url: '/exam/list',
    method: 'get',
    params: examDto
  })
}
/**
 * 新增/编辑考试信息
 * @param data
 * @returns
 */
export function saveExamInfo(data) {
  return request({
    url: '/exam/saveExamInfo',
    data: data,
    method: 'post'
  })
}
/**
 * 删除考试
 * @param {*} ids
 * @returns
 */
export function delExam(ids) {
  return request({
    url: '/exam/del/' + ids,
    method: 'get'
  })
}
/**
 * 维护考试课程
 * @param {*} data
 * @returns
 */
export function saveExamCourse(data) {
  return request({
    url: '/exam/saveArrangeCourse',
    data: data,
    method: 'post'
  })
}
/**
 * 根据考试id获取考试课程
 * @param {*} examId
 * @returns
 */
export function loadExamCourse(examId) {
  return request({
    url: '/exam/getExamCourse/' + examId,
    method: 'get'
  })
}

export function loadArrangeCourse(dto) {
  return request({
    url: '/exam/arrangeCourse',
    method: 'get',
    params: dto
  })
}
