import Mock from 'mockjs'

const List = []
const OilCodeArray = ['1020', '1040', '1010']
const OilNameArray = ['92#', '95#', '0#']
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@string("number", 1, 1)',
    Mach_Time: '@datetime',
    Terminal: '@cname',
    OldPrice: '@float(20,30, 2, 2)',
    NewPrice: '@float(20,30, 2, 2)',
    OilCodeIndex: '@integer(0, 2)',
    oil_code: function() {
      return OilCodeArray[this.OilCodeIndex]
    },
    oil_name: function() {
      return OilNameArray[this.OilCodeIndex]
    }
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

