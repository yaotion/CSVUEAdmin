import request from '@/utils/request'

export function stationDetailListQuery(query) {
  return request({
    url: '/stationInfo/stationDetailListQuery',
    method: 'get',
    params: query
  })
}
export function stationAdd(query) {
  return request({
    url: '/stationInfo/stationAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function stationUpdate(query) {
  return request({
    url: '/stationInfo/stationUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function stationDelete(query) {
  return request({
    url: '/stationInfo/stationDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function stationInit(query) {
  return request({
    url: '/stationInfo/stationInit',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

