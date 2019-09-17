import request from '@/utils/request'

export function payWayDetailListQuery(query) {
  return request({
    url: '/payWay/payWayDetailListQuery',
    method: 'get',
    params: query
  })
}
export function payWayAdd(query) {
  return request({
    url: '/payWay/payWayAdd',
    method: 'post',
    params: query
  })
}
export function payWayUpdate(query) {
  return request({
    url: '/payWay/payWayUpdate',
    method: 'post',
    params: query
  })
}
export function payWayDelete(query) {
  return request({
    url: '/payWay/payWayDelete',
    method: 'post',
    params: query
  })
}

