import Mock from 'mockjs'

const List = []
const StationTypeNameArray = ['加油站', '发卡点']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + i,
    SecCode: '@string("number", 6, 6)',
    BriefName: i + '站',
    StationName: 'XXXXX' + i + '站',

    Master: '@cname',
    TelNo: '138' + '@string("number", 8, 8)',
    TaxCode: '@string("number", 17,20)',
    TaxRate: '0.17',
    BankName: '@county(true)',
    BankAccNo: '@string("number", 10,14)',
    Address: '@county(true)',
    Memo: '@cparagraph(1, 3)',
    StationType: '@integer(0,1)',
    StationTypeName: function() {
      return StationTypeNameArray[this.StationType]
    }
  }))
}

export default [
  {
    url: '/station/stationDetailListQuery',
    type: 'get',
    response: config => {
      const { stationNo, stationType } = config.query

      const mockList = List.filter(item => {
        if (stationNo && item.StationNo !== stationNo) return false
        if (stationType && item.StationType !== stationType) return false
        return true
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  },

  {
    url: '/station/stationAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

