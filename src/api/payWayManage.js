import request from '@/utils/request'

export function payWayDetailListQuery(query) {
  return request({
    url: '/PaywayInfo/payWayDetailListQuery',
    method: 'get',
    params: query
  })
}
export function payWayAdd(query) {
  return request({
    url: '/PaywayInfo/payWayAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function payWayUpdate(query) {
  return request({
    url: '/PaywayInfo/payWayUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function payWayDelete(query) {
  return request({
    url: '/PaywayInfo/payWayDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

