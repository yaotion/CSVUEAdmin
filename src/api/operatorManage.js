import request from '@/utils/request'

export function operatorDetailListQuery(query) {
  return request({
    url: '/operator/operatorDetailListQuery',
    method: 'get',
    params: query
  })
}
export function systemFunctionList(query) {
  return request({
    url: '/operator/systemFunctionList',
    method: 'get',
    params: query
  })
}
export function optFunctionList(query) {
  return request({
    url: '/operator/optFunctionList',
    method: 'get',
    params: query
  })
}
export function optFunctionUpdate(query) {
  return request({
    url: '/operator/optFunctionUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

export function operatorAdd(query) {
  return request({
    url: '/operator/operatorAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function operatorUpdate(query) {
  return request({
    url: '/operator/operatorUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function operatorDelete(query) {
  return request({
    url: '/operator/operatorDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function operatorUpdatePassword(query) {
  return request({
    url: '/operator/operatorUpdatePassword',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

