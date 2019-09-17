import Mock from 'mockjs'

const List = []
const IsNameArray = ['否', '是']
const count = 20
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@string("number", 1, 1)',

    OptName: '@cname',

    OptNo: '@string("number", 4, 4)',
    AccNo: '000' + '@string("number", 1, 1)',
    AccName: '@cname',
    ChequeNo: '0000000' + '@string("number", 3, 3)',
    ChequeMoney: '@float(2000,6000,2,2)',
    ReceiveDate: '@datetime',

    IsID: '@integer(0, 1,2)',
    IsEffctiveName: function() {
      return IsNameArray[this.IsID]
    },
    IsReturnName: function() {
      return IsNameArray[this.IsID]
    },

    pageviews: '@integer(300, 5000)'
  }))
}
const sum = Mock.mock({
  AllCount: '@integer(300, 5000)',
  EffectiveCount: '@integer(300, 5000)',
  InEffectiveCount: '@integer(300, 5000)',
  ReturnCount: '@integer(300, 5000)'
})

export default [
  {
    url: '/card/cardChequeQuery',
    type: 'get',
    response: config => {
      const { begintime, endtime, cardNo } = config.query

      const mockList = List.filter(item => {
        if (begintime && item.OptTime < begintime) return false
        if (endtime && item.OptTime > endtime) return false
        if (cardNo) return false
        return true
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList,
          sum: sum
        }
      }
    }
  }
]

