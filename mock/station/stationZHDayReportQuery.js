import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#汽油', '95#汽油', '0#柴油']

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@integer(1,9)',
    RandID: '@integer(0, 2)',
    Oil_Name: function() {
      return OilNameArray[this.RandID]
    },
    Oil_Code: function() {
      return OilCodeArray[this.RandID]
    },
    Buss_Date: '@date',
    Price: '@float(5,10,2,2)',
    SJMoneys: '@float(200,1000,2,2)',
    XJMoneys: '@float(200,1000,2,2)',
    YPMoneys: '@float(200,1000,2,2)',
    YHKMoneys: '@float(200,1000,2,2)',
    XYKMoneys: '@float(200,1000,2,2)',
    JZMoneys: '@float(200,1000,2,2)',
    QTMoneys: '@float(200,1000,2,2)',
    QT1Moneys: '@float(200,1000,2,2)',
    TotalQtys: '@float(200,1000,2,2)',

    MonthQtys: '@float(200,1000,2,2)',
    TotalMoneys: '@float(200,1000,2,2)',
    End_li: '@float(200,1000,2,2)',
    CanAdd: '%' + '@float(1,99,2,2)'
  }))
}

export default [
  {
    url: '/station/stationZHDayReportQuery',
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

