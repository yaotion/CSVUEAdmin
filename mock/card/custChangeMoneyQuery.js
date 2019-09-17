import Mock from 'mockjs'
const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    stationno: '0000000' + '@string("number", 1, 1)',
    OptName: '@cname',
    OptNo: '@string("number", 4, 4)',
    OptTime: '@datetime',
    ChangeMoney: '@float(50, 200,2 ,2)',
    SrcAccNo: '@string("number", 4, 4)',
    SrcAccName: '@cname',
    DesAccNo: '@string("number", 4, 4)',
    SrcAccNoAmt: '@float(200, 500,2 ,2)',
    DesAccNoAmt: '@float(200, 500,2 ,2)',
    AccNoAmt: function() {
      return (this.SaveMoney + this.BonusMoney).toFixed(2)
    },
    Master: '@cname',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/custChangeMoneyQuery',
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

