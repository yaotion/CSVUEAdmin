import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const PayWayArray = ['现金', '加油卡', '微信']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    FlowNo: '@increment',
    Terminal: '0' + '@integer(0, 2)' + '_1',
    RandID: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },
    Price: '@float(5,9,2,2)',
    Qty: '@float(20,200,2,2)',
    Money: '@float(200,2000,2,2)',
    MachTime: '@datetime',
    PayWay: function() {
      return PayWayArray[this.RandID]
    },
    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/stationShiftNowYYLDetailQuery',
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

