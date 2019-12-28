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
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function depositActUpdate(query) {
  return request({
    url: '/deposit/depositActUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function depositActDelete(query) {
  return request({
    url: '/deposit/depositActDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function depositContentAdd(query) {
  return request({
    url: '/deposit/depositContentAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function depositContentUpdate(query) {
  return request({
    url: '/deposit/depositContentUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function depositContentDelete(query) {
  return request({
    url: '/deposit/depositContentDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

