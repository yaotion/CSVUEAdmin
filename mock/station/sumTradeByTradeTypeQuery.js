import Mock from 'mockjs'
const List = []

const TradeTypeNameArray = ['正常', '逃卡', '扣款']

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    RandID: '@integer(0, 2)',
    TradeTypeName: function() {
      return TradeTypeNameArray[this.RandID]
    },
    SumQty: '@float(200,2000,2,2)',
    SumMoney: '@float(200,2000,2,2)',
    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/sumTradeByTradeTypeQuery',
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

