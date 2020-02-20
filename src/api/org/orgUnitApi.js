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
