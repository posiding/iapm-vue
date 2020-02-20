import { axios } from '@/utils/request'

export function getData (parameter) {
  return axios({
    url: '/sys/sysMenu/data',
    method: 'post',
    data: parameter
  })
}

export function saveData (parameter) {
  return axios({
    url: '/sys/sysMenu/save',
    method: 'post',
    data: parameter
  })
}

export function findById (parameter) {
  return axios({
    url: '/sys/sysMenu/findById',
    method: 'get',
    params: parameter
  })
}

export function sysMenuTree () {
  return axios({
    url: '/sys/sysMenu/sysMenuSelect',
    method: 'get'
  })
}
