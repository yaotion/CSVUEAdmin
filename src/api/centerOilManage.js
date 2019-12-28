import request from '@/utils/request'

export function centerOilDetailListQuery(query) {
  return request({
    url: '/centerOil/centerOilDetailListQuery',
    method: 'get',
    params: query
  })
}
export function centerOilAdd(query) {
  return request({
    url: '/centerOil/centerOilAdd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function centerOilUpdate(query) {
  return request({
    url: '/centerOil/centerOilUpdate',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}
export function centerOilDelete(query) {
  return request({
    url: '/centerOil/centerOilDelete',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(query)
  })
}

