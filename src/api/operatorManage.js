import request from '@/utils/request'

export function operatorDetailListQuery(query) {
  return request({
    url: '/operator/operatorDetailListQuery',
    method: 'get',
    params: query
  })
}
export function operatorAdd(query) {
  return request({
    url: '/operator/operatorAdd',
    method: 'post',
    params: query
  })
}
export function operatorUpdate(query) {
  return request({
    url: '/operator/operatorUpdate',
    method: 'post',
    params: query
  })
}
export function operatorDelete(query) {
  return request({
    url: '/operator/operatorDelete',
    method: 'post',
    params: query
  })
}
export function operatorUpdatePassword(query) {
  return request({
    url: '/operator/operatorUpdatePassword',
    method: 'post',
    params: query
  })
}

