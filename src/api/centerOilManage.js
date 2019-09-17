import request from '@/utils/request'

export function centerOilDetailListQuery(query) {
  return request({
    url: '/centerOil/centerOilDetailListQuery',
    method: 'get',
    params: query
  })
}
export function centerOilAdd(query) {
  return request({
    url: '/centerOil/centerOilAdd',
    method: 'post',
    params: query
  })
}
export function centerOilUpdate(query) {
  return request({
    url: '/centerOil/centerOilUpdate',
    method: 'post',
    params: query
  })
}
export function centerOilDelete(query) {
  return request({
    url: '/centerOil/centerOilDelete',
    method: 'post',
    params: query
  })
}

