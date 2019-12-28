import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    Terminal: '00' + i,
    RandID: '@integer(0, 2)',
    Oil_Name: function() {
      return OilNameArray[this.RandID]
    },
    Oil_Code: function() {
      return OilCodeArray[this.RandID]
    },
    Pump_Qty1: '@float(200,2000,2,2)',
    Pump_Qty2: '@float(200,2000,2,2)',
    Sum_Qty: '@float(200,2000,2,2)',
    Sum_Money: '@float(200,2000,2,2)',

    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/station/stationDayReportByTerminalQuery',
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

