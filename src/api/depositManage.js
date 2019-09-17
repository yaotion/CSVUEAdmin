import request from '@/utils/request'

export function depositActDetailListQuery(query) {
  return request({
    url: '/deposit/depositActDetailListQuery',
    method: 'get',
    params: query
  })
}
export function depositContentDetailListQuery(query) {
  return request({
    url: '/deposit/depositContentDetailListQuery',
    method: 'get',
    params: query
  })
}
export function depositActAdd(query) {
  return request({
    url: '/deposit/depositActAdd',
    method: 'post',
    params: query
  })
}
export function depositActUpdate(query) {
  return request({
    url: '/deposit/depositActUpdate',
    method: 'post',
    params: query
  })
}
export function depositActDelete(query) {
  return request({
    url: '/deposit/depositActDelete',
    method: 'post',
    params: query
  })
}
export function depositContentAdd(query) {
  return request({
    url: '/deposit/depositContentAdd',
    method: 'post',
    params: query
  })
}
export function depositContentUpdate(query) {
  return request({
    url: '/deposit/depositContentUpdate',
    method: 'post',
    params: query
  })
}
export function depositContentDelete(query) {
  return request({
    url: '/deposit/depositContentDelete',
    method: 'post',
    params: query
  })
}

