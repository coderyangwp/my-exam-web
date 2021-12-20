/**
 * 字典过滤器
 * @param data
 * @param options
 * @returns {null}
 */
export function dictFilter(data, options) {
  if (options.length > 0) {
    options.forEach(item => {
      if (item.code === data) {
        return item.name
      }
    })
  }else {
    return null
  }
}
