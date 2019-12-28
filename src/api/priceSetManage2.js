import request from '@/utils/request'

export function priceSetListQuery(query) {
  return request({
    url: '/priceSet/priceSetListQuery',
    method: 'get',
    params: query
  })
}
export function priceContentListQuery(query) {
  return request({
    url: '/priceSet/priceContentListQuery',
    method: 'get',
    params: query
  })
}
export function priceStationListQuery(query) {
  return request({
    url: '/priceSet/priceStationListQuery',
    method: 'get',
    params: query
  })
}
export function priceStationSetStation(query) {
  return request({
    url: '/priceSet/priceStationSetStation',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceOilListQuery(query) {
  return request({
    url: '/priceSet/priceOilListQuery',
    method: 'get',
    params: query
  })
}
export function priceContentSetOil(query) {
  return request({
    url: '/priceSet/priceContentSetOil',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceSetAdd(query) {
  return request({
    url: '/priceSet/priceSetAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceSetUpdate(query) {
  return request({
    url: '/priceSet/priceSetUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceSetDelete(query) {
  return request({
    url: '/priceSet/priceSetDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceContentAdd(query) {
  return request({
    url: '/priceSet/priceContentAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceContentUpdate(query) {
  return request({
    url: '/priceSet/priceContentUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function priceContentDelete(query) {
  return request({
    url: '/priceSet/priceContentDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
