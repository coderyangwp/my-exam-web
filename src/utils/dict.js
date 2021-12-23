import store from '@/store'

/**
 * 获取指定字典
 * 首选判断vuex中是否有该数据
 * 若没有，则从接口获取
 * @param code
 * @returns {*}
 */
export function dict(code) {
  return new Promise((resolve, reject) => {
    let data = null
    const dictMap = store.getters.dictMap
    if (dictMap[code]) {
      resolve(dictMap[code].items)
    } else {
      store.dispatch('dict/getDict', code).then(() => {
        data = store.getters.dictMap[code].items
        resolve(data)
      })
    }
  })
}
