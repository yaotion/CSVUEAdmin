import Mock from 'mockjs'

const List = []
const OilCodeArray = ['1020', '1040', '1010']
const OilNameArray = ['92#', '95#', '0#']
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@string("number", 1, 1)',
    OptTime: '@datetime',
    Terminal: '@cname',
    OldPrice: '@float(20,30, 2, 2)',
    NewPrice: '@float(20,30, 2, 2)',
    OilCodeIndex: '@integer(0, 2)',
    OilCode: function() {
      return OilCodeArray[this.OilCodeIndex]
    },
    OilName: function() {
      return OilNameArray[this.OilCodeIndex]
    },

    QtySum: '@float(1000,20000, 2, 2)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/cardChangePriceQuery',
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

