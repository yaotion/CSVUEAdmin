import Mock from 'mockjs'
const TradeTypeArray = ['正常', '试机', '逃卡', '补扣']

const OilNameArray = ['92#', '95#', '0#']
const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    stationno: '0000000' + '@string("number", 1, 1)',
    OilCode: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.OilCode]
    },
    OptNo: '@string("number", 4, 4)',
    machTime: '@datetime',
    TType: '@integer(0, 3)',
    TradeType: function() {
      return TradeTypeArray[this.TType]
    },
    Qty: '@float(20, 30,2 ,2)',

    Balance: '@float(200, 500,2 ,2)',
    Price: '@float(5, 9,2 ,2)',
    Money: function() {
      return (this.Qty * this.Price).toFixed(2)
    }
  }))
}

export default [
  {
    url: '/card/cardTradeQuery',
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

