import Mock from 'mockjs'
const List = []
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    EmpName: '@cname',
    AmtStart: '@float(200,3000,2,2)',
    AmtEnd: '@float(200,3000,2,2)',
    DepositMoneys: '@float(200,3000,2,2)',
    DeductMoneys: '@float(200,3000,2,2)',
    TradeMoneys: '@float(200,3000,2,2)'
  }))
}

export default [
  {
    url: '/station/stationEmpBillQuery',
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

