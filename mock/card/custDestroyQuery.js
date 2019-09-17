import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    stationno: '0000000' + '@string("number", 1, 1)',
    MasterName: '@cname',
    FrmId: 'M' + '@datetime("yMMdd HHmmss")',
    OptName: '@cname',
    OptNo: '@string("number", 4, 4)',
    OptTime: '@datetime',
    BankName: '@county(true)',
    DestroyAccNo: '0100' + '@string("number", 4, 4)',
    DestroyAccName: '@cname',
    ReturnMoney: '@float(1000, 1500, 2,2)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/custDestroyQuery',
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

