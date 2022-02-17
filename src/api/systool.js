import request from '@/utils/request'
import { formatDates } from '@/utils/date'

/**
 * 获取当前数据库所有表
 * @param {*} dto
 * @returns
 */
export function tableList(dto) {
  return request({
    url: '/generator/getTables',
    method: 'get',
    params: dto
  })
}
/**
 * 获取表的字段信息
 * @param {*} tableName
 * @returns
 */
export function columnList(tableName) {
  return request({
    url: '/generator/table/' + tableName,
    method: 'get'
  })
}
/**
 * 维护表字段信息
 * @param {*} data
 * @returns
 */
export function saveColumn(data) {
  return request({
    url: '/generator/saveColumn',
    method: 'post',
    data: data
  })
}
/**
 * 维护表代码生成配置信息
 * @param {*} data
 * @returns
 */
export function saveConfig(data) {
  return request({
    url: '/generator/saveConfig',
    method: 'post',
    data: data
  })
}
/**
 * 获取表配置信息
 * @param {*} tableName
 * @returns
 */
export function tableConfig(tableName) {
  return request({
    url: '/generator/config/' + tableName,
    method: 'get'
  })
}
/**
 * 代码生成
 * @param {*} tableName
 * @returns
 */
export function genCode(tableName) {
  return request({
    url: '/generator/code/' + tableName,
    method: 'get'
  })
}
/**
 * 生成代码压缩包
 * @param {*} tableName
 * @returns
 */
export function packageFile(tableName) {
  return request({
    url: 'generator/download/' + tableName,
    method: 'post',
    responseType: 'blob'
  })
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = formatDates(new Date(), 'yyyy-MM-dd') + '-' + name + '.' + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function preview(tableName) {
  return request({
    url: '/generator/preview/' + tableName,
    method: 'get'
  })
}
