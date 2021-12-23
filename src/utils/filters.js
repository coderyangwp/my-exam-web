/**
 * 字典过滤器
 * @param data
 * @param options
 * @returns {null}
 */
export function dictFilter(data, options) {
  if (options.length > 0) {
    options.forEach(item => {
      if (Object.prototype.toString.call(data) === '[object Number]') {
        if (Number(item.code) === data) {
          return item.name
        }
      } else {
        if (item.code === data) {
          return item.name
        }
      }
    })
  } else {
    return null
  }
}
