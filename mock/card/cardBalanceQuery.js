import Mock from 'mockjs'
const List = []
const count = 100
// const filterVal = ['index', 'CardNo', 'MasterName', 'AccName', 'StartAmt', 'DepositMoney',
// 'PreMoney', 'TradeMoney', 'ReDepositMoney', 'ReturnMoney', 'RemarkMoney', 'EndAmt', 'DiffMoney']
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    MasterName: '@cname',
    AccName: '@cname',
    StartAmt: '@float(200,2000,2,2)',

    DepositMoney: '@float(200,2000,2,2)',
    PreMoney: '@float(200,2000,2,2)',
    TradeMoney: '@float(200,2000,2,2)',
    DeDepositMoney: '@float(200,2000,2,2)',
    ReturnMoney: '@float(200,2000,2,2)',
    RemarkMoney: '@float(200,2000,2,2)',
    EndAmt: '@float(200,2000,2,2)',
    DiffMoney: '@float(200,2000,2,2)',

    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/cardBalanceQuery',
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

