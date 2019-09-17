import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    TankNo: '@integer(0, 2)',
    RandID: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },

    StartQty: '@float(20,200,2,2)',
    AddQty: '@float(200,2000,2,2)',
    TradeQty: '@float(20,200,2,2)',
    EndQty: '@float(200,2000,2,2)',
    DiffQty: '@float(20,200,2,2)',

    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/stationDayReportByTankQuery',
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

