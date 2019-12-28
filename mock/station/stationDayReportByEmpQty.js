import Mock from 'mockjs'
const List = []

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '000' + '@integer(1,1)',
    Emp_No: '000' + '@integer(1,1)',
    Emp_Name: '@cname',
    RandID: '@integer(0, 2)',

    Sum_Qty: '@float(3000,20000,2,2)',
    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/stationDayReportByEmpQty',
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

