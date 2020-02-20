import { axios } from '@/utils/request'

/* 获取数据字典列表信息 */
export function getDictTypeData (parameter) {
  return axios({
    url: '/sys/dict/sysDictType/data',
    method: 'post',
    data: parameter
  })
}

/* 保存数据字典列表信息 */
export function addDictType (parameter) {
  return axios({
    url: '/sys/dict/sysDictType/save',
    method: 'post',
    data: parameter
  })
}

/* 获取数据字典项信息 */
export function getDictItemData (parameter) {
  return axios({
    url: '/sys/dict/sysDictItem/data',
    method: 'post',
    data: parameter
  })
}

/* 保存数据字典项信息 */
export function addDictItem (parameter) {
  return axios({
    url: '/sys/dict/sysDictItem/save',
    method: 'post',
    data: parameter
  })
}
