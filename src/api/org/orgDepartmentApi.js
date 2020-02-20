import { axios } from '@/utils/request'

export function getOrgDepartmentData (parameter) {
  return axios({
    url: '/org/orgDepartment/data',
    method: 'post',
    data: parameter
  })
}
