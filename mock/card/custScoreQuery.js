import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    AccNo: '000' + '@string("number", 1, 1)',
    AccName: '@cname',
    SavePoint: '@integer(300, 5000)',
    UsePoint: '@integer(300, 5000)',
    Bal: '@integer(300, 5000)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/custScoreQuery',
    type: 'get',
    response: config => {
      const { begintime, endtime, page = 1, limit = 20, stationNo } = config.query

      const mockList = List.filter(item => {
        if (begintime && item.OptTime < begintime) return false
        if (endtime && item.OptTime > endtime) return false
        if (stationNo && stationNo !== item.stationno) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

