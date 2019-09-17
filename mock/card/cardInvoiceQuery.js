import Mock from 'mockjs'

const List = []
const InvoiceTypeNameArray = ['未开', '已开']
const count = 20
const sum = {}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    MasterName: '@cname',
    Qty: '@float(10,30,2,2)',
    Money: '@float(200,2000,2,2)',
    MachTime: '@datetime',
    Amt: '@float(200,2000,2,2)',
    StationNo: '0000000' + '@string("number", 1, 1)',
    InvoiceType: '@integer(0,1)',
    InvoiceTypeName: function() {
      return InvoiceTypeNameArray[this.InvoiceType]
    },
    pageviews: '@integer(300, 5000)'
  }))
}

sum.UnInvoiced = 1000.00
sum.Invoiced = 2000.00
sum.All = 3000.00

export default [
  {
    url: '/card/cardInvoiceQuery',
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

