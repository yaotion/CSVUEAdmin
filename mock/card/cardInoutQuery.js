import Mock from 'mockjs'
const List = []
const CardTypeNameArray = ['员工卡', '客户卡']
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@string("number", 1, 1)',
    StationName: '@cname',
    OptName: '@cname',
    OptNo: '@string("number", 4, 4)',
    InOutDate: '@datetime',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    CardType: '@integer(0, 1)',
    CardTypeName: function() {
      return CardTypeNameArray[this.CardType]
    },
    CardCount: '@integer(1, 5)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/cardInoutQuery',
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

