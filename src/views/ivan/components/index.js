import IText from './text/text'

const views = {
  IText
}
const install = function (Vue) {
  Object.keys(views).forEach((key) => {
    Vue.component(key, views[key])
  })
}
const IampComponent = {
  install
}
export default IampComponent
