const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  dictMap: state => state.dict.dictMap,
  visitedViews: state => state.tagsView.visitedViews
}
export default getters
