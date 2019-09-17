import Mock from 'mockjs'
const List = []
const OilNameArray = ['92#汽油', '95#汽油', '0#柴油']
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    OilCode: '@integer(0,2)',
    OilName: function() {
      return OilNameArray[this.OilCode]
    },
    Price: '@float(5,9,2,2)',
    CashQty: '@float(100,300,2,2)',
    CashMoney: '@float(500,2700,2,2)',
    BankQty: '@float(100,300,2,2)',
    BankMoney: '@float(500,2700,2,2)',
    NetQty: '@float(100,300,2,2)',
    NetMoney: '@float(500,2700,2,2)',
    CardQty: '@float(100,300,2,2)',
    CardMoney: '@float(500,2700,2,2)',
    CustQty: '@float(100,300,2,2)',
    CustMoney: '@float(500,2700,2,2)',
    BookQty: '@float(100,300,2,2)',
    BookMoney: '@float(500,2700,2,2)',
    SumQty: '@float(100,300,2,2)',
    SumMoney: '@float(500,2700,2,2)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/report/reportSaleSectionQuery',
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

