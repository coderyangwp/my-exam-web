import { dictDetail } from '@/api/system'

const getDefaultState = () => {
  return {
    dictMap: {}
  }
}

const state = getDefaultState()

const mutations = {
  SAVE_DICT: (state, data) => {
    const obj = {}
    obj[data.code] = data
    state.dictMap = Object.assign({}, state.dictMap, obj)
  },
  DELETE_DICT: (state, codes) => {
    codes.filter(code => {
      delete state.dictMap[code]
    })
  },
  DELETE_ONE_DICT: (state, code) => {
    delete state.dictMap[code]
  }
}

const actions = {
  getDict({ commit }, code) {
    if (code) {
      dictDetail(code).then(res => {
        commit('SAVE_DICT', res.data)
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
