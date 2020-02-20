import { axios } from '@/utils/request'

export function getData (parameter) {
  return axios({
    url: '/sys/sysClusterNode/data',
    method: 'post',
    data: parameter
  })
}

export function saveData (parameter) {
  return axios({
    url: '/sys/sysClusterNode/save',
    method: 'post',
    data: parameter
  })
}

export function findById (parameter) {
  return axios({
    url: '/sys/sysClusterNode/findById',
    method: 'get',
    params: parameter
  })
}

export function deleteById (parameter) {
  return axios({
    url: '/sys/sysClusterNode/delete',
    method: 'get',
    params: parameter
  })
}
