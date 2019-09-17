import Mock from 'mockjs'

const List = []
const count = 100
const StateNameArray = ['未返还', '已返还']
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    PreId: '@integer(0, 3)',
    Qty: '@float(20,30,2,2)',
    Money: '@float(120,220,2,2)',
    PreMoney: '@float(0,10,2,2)',
    PreTime: '@datetime',
    State: '@integer(0, 1)',
    StateName: function() {
      return StateNameArray[this.State]
    },
    stationno: '0000000' + '@string("number", 1, 1)',
    AccNo: '散户',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/cardPreQuery',
    type: 'get',
    response: config => {
      const { begintime, endtime, page = 1, limit = 20, preState } = config.query

      const mockList = List.filter(item => {
        if (begintime && item.PreTime < begintime) return false
        if (endtime && item.PreTime > endtime) return false
        if (preState && preState.toString() !== item.State.toString()) return false
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

