import Mock from 'mockjs'
const List = []
const count = 100
// const filterVal = ['index', 'CardNo', 'MasterName', 'AccName', 'StartAmt', 'DepositMoney',
// 'PreMoney', 'TradeMoney', 'ReDepositMoney', 'ReturnMoney', 'RemarkMoney', 'EndAmt', 'DiffMoney']
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    HolderName: '@cname',
    AccName: '@cname',
    Balance1: '@float(200,2000,2,2)',

    Deposit: '@float(200,2000,2,2)',
    Pre: '@float(200,2000,2,2)',
    Consume: '@float(200,2000,2,2)',
    Undeposit: '@float(200,2000,2,2)',
    Return: '@float(200,2000,2,2)',
    Refund: '@float(200,2000,2,2)',
    Balance2: '@float(200,2000,2,2)',
    Difference: '@float(200,2000,2,2)',

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

