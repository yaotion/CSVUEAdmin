import request from '@/utils/request'

export function priceSetListQuery(query) {
  return request({
    url: '/priceSet/priceSetListQuery',
    method: 'get',
    params: query
  })
}
export function priceSetAdd(query) {
  return request({
    url: '/priceSet/priceSetAdd',
    method: 'post',
    params: query
  })
}
export function priceSetUpdate(query) {
  return request({
    url: '/priceSet/priceSetUpdate',
    method: 'post',
    params: query
  })
}
export function priceSetDelete(query) {
  return request({
    url: '/priceSet/priceSetDelete',
    method: 'post',
    params: query
  })
}
export function oilPriceAdd(query) {
  return request({
    url: '/priceSet/oilPriceAdd',
    method: 'post',
    params: query
  })
}
export function oilPriceUpdate(query) {
  return request({
    url: '/priceSet/oilPriceUpdate',
    method: 'post',
    params: query
  })
}
export function oilPriceDelete(query) {
  return request({
    url: '/priceSet/oilPriceDelete',
    method: 'post',
    params: query
  })
}
