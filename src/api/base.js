import request from '@/utils/request'

export function stationListQuery(query) {
  return request({
    url: '/base/stationList',
    method: 'get',
    params: query
  })
}
export function preIdListQuery(query) {
  return request({
    url: '/base/preIdListQuery',
    method: 'get',
    params: query
  })
}
export function paywayListQuery(query) {
  return request({
    url: '/base/paywayListQuery',
    method: 'get',
    params: query
  })
}
export function shiftListQuery(query) {
  return request({
    url: '/base/shiftListQuery',
    method: 'get',
    params: query
  })
}
export function oilCodeListQuery(query) {
  return request({
    url: '/base/oilCodeListQuery',
    method: 'get',
    params: query
  })
}
export function terminalListQuery(query) {
  return request({
    url: '/base/terminalListQuery',
    method: 'get',
    params: query
  })
}
export function tradeTypeListQuery(query) {
  return request({
    url: '/base/tradeTypeListQuery',
    method: 'get',
    params: query
  })
} export function cardTypeListQuery(query) {
  return request({
    url: '/base/cardTypeListQuery',
    method: 'get',
    params: query
  })
}
export function optListQuery(query) {
  return request({
    url: '/base/optListQuery',
    method: 'get',
    params: query
  })
}
export function empListQuery(query) {
  return request({
    url: '/base/empListQuery',
    method: 'get',
    params: query
  })
}

export function cardListQuery(query) {
  return request({
    url: '/base/cardListQuery',
    method: 'get',
    params: query
  })
}

export function goodsListQuery(query) {
  return request({
    url: '/base/goodsListQuery',
    method: 'get',
    params: query
  })
}

export function retailTypeListQuery(query) {
  return request({
    url: '/base/retailTypeListQuery',
    method: 'get',
    params: query
  })
}

export function cardStateListQuery(query) {
  return request({
    url: '/base/cardStateListQuery',
    method: 'get',
    params: query
  })
}
export function cardStateCompListQuery(query) {
  return request({
    url: '/base/cardStateCompListQuery',
    method: 'get',
    params: query
  })
}
