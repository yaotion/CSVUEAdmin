import request from '@/utils/request'

export function discountActDetailListQuery(query) {
  return request({
    url: '/discount/discountActDetailListQuery',
    method: 'get',
    params: query
  })
}
export function discountContentDetailListQuery(query) {
  return request({
    url: '/discount/discountContentDetailListQuery',
    method: 'get',
    params: query
  })
}
export function discountActAdd(query) {
  return request({
    url: '/discount/discountActAdd',
    method: 'post',
    params: query
  })
}
export function discountActUpdate(query) {
  return request({
    url: '/discount/discountActUpdate',
    method: 'post',
    params: query
  })
}
export function discountActDelete(query) {
  return request({
    url: '/discount/discountActDelete',
    method: 'post',
    params: query
  })
}
export function discountContentAdd(query) {
  return request({
    url: '/discount/discountContentAdd',
    method: 'post',
    params: query
  })
}
export function discountContentUpdate(query) {
  return request({
    url: '/discount/discountContentUpdate',
    method: 'post',
    params: query
  })
}
export function discountContentDelete(query) {
  return request({
    url: '/discount/discountContentDelete',
    method: 'post',
    params: query
  })
}

