import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#汽油', '95#汽油', '0#柴油']
const OilShortNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@integer(1,9)',
    RandID: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },
    OilShortName: function() {
      return OilShortNameArray[this.RandID]
    },

    // const filterVal = ['index', 'StationNo', 'BatID', 'OilCode',
    // 'OilName', 'OilShortName', 'Density', 'Price', 'UpdateTime']

    BatID: '0001111111' + '@integer(1,9)',

    Density: '@float(0,1,2,2)',
    Price: '@float(5,10,2,2)',
    UpdateTime: '@datetime',
    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/stationOilChangeQuery',
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

