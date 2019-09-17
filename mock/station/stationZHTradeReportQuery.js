import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '1050', '2001']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    Terminal: '0' + i + '_1',

    TankNo: '0' + '@integer(1,4)',
    tempID: '@integer(0,3)',
    OilCode: function() {
      return OilCodeArray[this.tempID]
    },
    PumpStart: '@float(200,3000,2,2)',
    PumpEnd: '@float(200,3000,2,2)',
    Price: '@float(5,10,2,2)',
    Qtys: '@float(20,30,2,2)',
    Moneys: '@float(200,3000,2,2)'
  }))
}

export default [
  {
    url: '/station/stationZHTradeReportQuery',
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

