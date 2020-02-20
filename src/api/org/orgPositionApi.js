import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getOrgPositionData (parameter) {
  return axios({
    url: '/org/orgPosition/data',
    method: 'post',
    data: parameter
  })
}

export function addOrgRole (parameter) {
  return axios({
    url: '/org/orgPosition/save',
    method: 'post',
    data: parameter
  })
}

export function getOrgRole (parameter) {
  return axios({
    url: '/org/orgPosition/findById',
    method: 'get',
    params: parameter
  })
}

export function addOrgPosition (parameter) {
  return axios({
    url: '/org/orgPosition/save',
    method: 'post',
    data: parameter
  })
}

export function getOrgPosition (parameter) {
  return axios({
    url: '/org/orgPosition/findById',
    method: 'get',
    params: parameter
  })
}
