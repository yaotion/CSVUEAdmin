import Mock from 'mockjs'
const List = []
const StateNameArray = ['正常', '高温']
const count = 100
// const filterVal = ['index', 'CardNo', 'MasterName', 'AccName', 'StartAmt', 'DepositMoney',
// 'PreMoney', 'TradeMoney', 'ReDepositMoney', 'ReturnMoney', 'RemarkMoney', 'EndAmt', 'DiffMoney']
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    tankNo: '00' + i,
    oilHeight: '@float(200,2000,2,2)',
    waterHeight: '@float(200,2000,2,2)',
    leftQty: '@float(200,2000,2,2)',
    nullQty: '@float(200,2000,2,2)',
    state: '@integer(0,1)',
    stateName: function() {
      return StateNameArray[this.state]
    },
    temp: '@float(200,2000,2,2)',

    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/station/stationTankMonitorQuery',
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

