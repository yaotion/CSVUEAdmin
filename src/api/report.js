import request from '@/utils/request'

export function reportSaleSectionQuery(query) {
  return request({
    url: '/report/reportSaleSectionQuery',
    method: 'get',
    params: query
  })
}
