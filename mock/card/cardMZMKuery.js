import Mock from 'mockjs'

const List = []
const PreTypeNameArray = ['实时优惠', '返还优惠']
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    MasterName: '@cname',
    Qty: '@float(20,30, 4, 4)',
    Money: '@float(200,300, 4, 4)',
    PreMoney: '@float(10,40, 4, 4)',
    PreType: '@integer(0, 1)',
    PreTypeName: function() {
      return PreTypeNameArray[this.PreType]
    },
    MachTime: '@datetime',

    StationNo: '0000000' + '@string("number", 1, 1)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/cardMZMKuery',
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

