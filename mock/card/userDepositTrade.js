import Mock from 'mockjs'
const paytype = ['试机', '现金', '油票', '银行卡', '信用卡', '记帐', '其他', '其他1', '无', '微信', '支付宝', '银联']
const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    stationno: '0000000' + '@string("number", 1, 1)',
    MasterName: '@cname',
    FrmId: 'M' + '@datetime("yMMdd HHmmss")',
    OptName: '@cname',
    OptNo: '@string("number", 4, 4)',
    OptTime: '@datetime',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    cardname: '@cname',
    SaveMoney: '@float(200, 500,2 ,2)',
    CardAmt: '@float(1000, 1500, 2,2)',
    BonusMoney: '@float(0, 50, 2,2)',
    DiscountMoney: function() {
      return (this.BonusMoney / this.SaveMoney).toFixed(2)
    },
    PAYTYPEID: '@integer(0, 1)',
    PAYTYPE: function() {
      return paytype[this.PAYTYPEID]
    },
    SaveMoneyBase: function() {
      return (this.SaveMoney - this.BonusMoney).toFixed(2)
    },
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/userDepositTrade',
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

