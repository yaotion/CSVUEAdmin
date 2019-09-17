import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#汽油', '95#汽油', '0#柴油']

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    BussDate: '@date',
    ShiftNo: '1',
    Terminal: '0' + '@integer(0,9)' + '_1',
    CardNo: '01000111100000' + '@string("number", 4, 4)',

    StationNo: '0000000' + '@integer(1,9)',
    RandID: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },
    Price: '@float(5,10,2,2)',
    Qty: '@float(5,20,2,2)',
    Money: '@float(100,300,2,2)',
    MoneySale: '@float(100,300,2,2)',
    Bal: '@float(50,1000,2,2)',
    TradeTypeName: '正常',
    PayWayName: '现金',
    OptNo: '0' + '@integer(0, 2)',
    OptName: '@cname',
    MachTime: '@datetime',
    AccNo: '散户'
  }))
}

export default [
  {
    url: '/station/stationTradeListQuery',
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

