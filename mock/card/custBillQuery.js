import Mock from 'mockjs'

const List = []
const TradeTypeArray = ['存钱', '冲正', '划账', '反划账', '优惠', '储值', '扣款', '退卡', '消费']
const count = 20
const sum = {}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    OptTime: '@datetime',
    stationno: '0000000' + '@string("number", 1, 1)',
    StationName: '0000000' + '@string("number", 1, 1)' + '站',
    OptNo: '@string("number", 4, 4)',
    IsSave: '@integer(0, 8)',
    TypeId1: '@integer(1, 11)',

    PayAMN: function() {
      if (this.IsSave in [0, 1]) { return TradeTypeArray[this.IsSave] }
      return '-'
    },
    PayType: function() {
      if (this.IsSave in [0, 1]) { return TradeTypeArray[this.IsSave] }
      return '-'
    },
    AccBalance: function() {
      if (this.IsSave in [0, 1]) { return '@float(10,30,2,2)' }
      return '-'
    },
    CardNo: function() {
      if (this.IsSave > 1) { return '@string("number", 6, 6)' }
      return '-'
    },

    AccName: function() {
      if (this.IsSave > 1) { return '@string("number", 8, 8)' }
      return '-'
    },
    ChangeAMN: function() {
      if ((this.IsSave === 2) || (this.IsSave === 3)) { return '@float(10,30,2,2)' }
      return '-'
    },
    ChangeType: function() {
      if ((this.IsSave === 2) || (this.IsSave === 3)) { return TradeTypeArray[this.IsSave] }
      return '-'
    },
    AccBalance2: function() {
      if ((this.IsSave === 2) || (this.IsSave === 3)) { return '@float(10,30,2,2)' }
      return '-'
    },
    Master: function() {
      if (this.IsSave > 1) { return '@cname' }
      return ''
    },
    DepositMoney: function() {
      if ((this.IsSave === 4) || (this.IsSave === 5) ||
      (this.IsSave === 6) || (this.IsSave === 7)) { return '@float(10,30,2,2)' }
      return ''
    },
    DepositType: function() {
      if ((this.IsSave === 4) || (this.IsSave === 5) ||
      (this.IsSave === 6) || (this.IsSave === 7) || (this.IsSave === 8)) { return TradeTypeArray[this.IsSave] }
      return '-'
    },
    TradeMoney: function() {
      if ((this.IsSave === 8)) { return '@float(10,30,2,2)' }
      return '-'
    },
    Balance: function() {
      if ((this.IsSave === 4) || (this.IsSave === 5) ||
      (this.IsSave === 6) || (this.IsSave === 7) || (this.IsSave === 8)) { return '@float(10,30,2,2)' }
      return '-'
    },
    pageviews: '@integer(300, 5000)'
  }))
}
function FloatAdd(arg1, arg2) {
  var r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

sum.SaveMoneys = 0
sum.PreMoneys = 0
sum.ReSaveMoneys = 0
sum.ChangeMoneys = 0
sum.ReChangeMoneys = 0

sum.DepositMoneys = 0
sum.ReDepositMoneys = 0
sum.ReturnMoneys = 0
sum.TradeMoneys = 0
export default [
  {
    url: '/card/custBillQuery',
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

