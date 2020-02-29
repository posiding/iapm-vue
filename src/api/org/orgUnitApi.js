import { axios } from '@/utils/request'

const api = {}

export default api

export function orgUnitTree (parameter) {
  return axios({
    url: '/org/orgUnit/orgUnitTree',
    method: 'get',
    params: parameter
  })
}
// 查找所有的数据
export function getOrgUnitData (parameter) {
  return axios({
    url: '/org/orgUnit/data',
    method: 'post',
    data: parameter
  })
}
// 通过ID查找指定的数据
export function findById (parameter) {
  return axios({
    url: '/org/orgUnit/findById',
    method: 'get',
    params: parameter
  })
}
// 保存机构数据
export function saveData (parameter) {
  return axios({
    url: '/org/orgUnit/save',
    method: 'post',
    data: parameter
  })
}
