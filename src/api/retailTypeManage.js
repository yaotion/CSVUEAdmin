import request from '@/utils/request'

export function retailTypeListQuery(query) {
  return request({
    url: '/retailType/retailTypeListQuery',
    method: 'get',
    params: query
  })
}

export function retailTypeAdd(query) {
  return request({
    url: '/retailType/retailTypeAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function retailTypeUpdate(query) {
  return request({
    url: '/retailType/retailTypeUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function retailTypeDelete(query) {
  return request({
    url: '/retailType/retailTypeDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

export function retailTypeUserCardListQuery(query) {
  return request({
    url: '/retailType/retailTypeUserCardListQuery',
    method: 'get',
    params: query
  })
}

export function retailTypeSetUserCard(query) {
  return request({
    url: '/retailType/retailTypeSetUserCard',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
