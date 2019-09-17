import request from '@/utils/request'

export function stationDetailListQuery(query) {
  return request({
    url: '/station/stationDetailListQuery',
    method: 'get',
    params: query
  })
}
export function stationAdd(query) {
  return request({
    url: '/station/stationAdd',
    method: 'post',
    params: query
  })
}
export function stationUpdate(query) {
  return request({
    url: '/station/stationAdd',
    method: 'post',
    params: query
  })
}
export function stationDelete(query) {
  return request({
    url: '/station/stationAdd',
    method: 'post',
    params: query
  })
}

