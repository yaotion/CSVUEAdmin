import Mock from 'mockjs'

const List = []
const OilTypeTypeArray = ['92#', '95#', '0#']
const TradeTypeArray = ['加油', '扣款', '储值', '优惠']
const count = 20
const sum = {}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    stationno: '0000000' + '@string("number", 1, 1)',
    TypeID: '@integer(0, 3)',
    TypeName: function() {
      return TradeTypeArray[this.TypeID]
    },
    OptName: '@cname',
    Qty: '@float(10,30,2,2)',
    OptNo: '@string("number", 4, 4)',
    OptTime: '@datetime',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    Price: '@float(5,9,2,2)',

    Amn: function() {
      return (this.Price * this.Qty).toFixed(2)
    },
    Bal: '@float(1000,3000,2,2)',
    OilCode: '@integer(0, 1,2)',
    OilName: function() {
      return OilTypeTypeArray[this.OilCode]
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

sum.TradeQtys = 0
sum.DeSaveMoneys = 0
sum.TradeMoneys = 0
sum.SaveMoneys = 0
sum.PreMoneys = 0
for (let i = 0; i < count; i++) {
  if (List[i].TypeID === 0) {
    sum.TradeQtys = FloatAdd(sum.TradeQtys, List[i].Qtys)
    sum.TradeMoneys = FloatAdd(sum.TradeMoneys, List[i].Moneys)
  }
  if (List[i].TypeID === 1) {
    sum.DeSaveMoneys = FloatAdd(sum.DeSaveMoneys, List[i].Moneys)
  }
  if (List[i].TypeID === 2) {
    sum.SaveMoneys = FloatAdd(sum.SaveMoneys, List[i].Moneys)
  }
  if (List[i].TypeID === 3) {
    sum.PreMoneys = FloatAdd(sum.PreMoneys, List[i].Moneys)
  }
}

export default [
  {
    url: '/card/cardBillQuery',
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

