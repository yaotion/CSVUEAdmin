import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',

    RandID: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },
    Price: '@float(5,9,2,2)',
    SJQtys: '@float(20,200,2,2)',
    SJMoneys: '@float(200,2000,2,2)',
    XJQtys: '@float(20,200,2,2)',
    XJMoneys: '@float(200,2000,2,2)',
    YPQtys: '@float(20,200,2,2)',
    YPMoneys: '@float(200,2000,2,2)',
    YHKQtys: '@float(20,200,2,2)',
    YHKMoneys: '@float(200,2000,2,2)',
    XYKQtys: '@float(20,200,2,2)',
    XYKMoneys: '@float(200,2000,2,2)',
    JZQtys: '@float(20,200,2,2)',
    JZMoneys: '@float(200,2000,2,2)',
    QTQtys: '@float(20,200,2,2)',
    QTMoneys: '@float(200,2000,2,2)',
    QT1Qtys: '@float(20,200,2,2)',
    QT1Moneys: '@float(200,2000,2,2)',
    WXQtys: '@float(20,200,2,2)',
    WXMoneys: '@float(200,2000,2,2)',
    ZFBQtys: '@float(20,200,2,2)',
    ZFBMoneys: '@float(200,2000,2,2)',
    YLQtys: '@float(20,200,2,2)',
    YLMoneys: '@float(200,2000,2,2)',
    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/stationDayReportByOilQuery',
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

