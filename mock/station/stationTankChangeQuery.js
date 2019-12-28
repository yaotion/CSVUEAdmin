import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#汽油', '95#汽油', '0#柴油']

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@integer(1,9)',
    RandID: '@integer(0, 2)',
    Oil_Name: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },

    TransOrder: '0001111111' + '@integer(1,9)',

    Tank_No: '@integer(0, 6)',
    Tank_Diameter: '@float(5,10,2,2)',

    Tank_Length: '@float(5,10,2,2)',
    Max_Volume: '@float(5,10,2,2)',

    High_Oil: '@float(5,10,2,2)',
    High_High_Oil: '@float(5,10,2,2)',

    Low_Oil: '@float(5,10,2,2)',
    Low_Low_Oil: '@float(5,10,2,2)',
    High_Water: '@float(5,10,2,2)',
    High_Temp: '@float(5,10,2,2)',
    Low_Temp: '@float(5,10,2,2)',

    Oil_Offset: '@float(5,10,2,2)',
    Water_Offset: '@float(5,10,2,2)',

    UpdateTime: '@datetime',
    pageviews: '@integer(300, 5000)'

  }))
}

export default [
  {
    url: '/station/stationTankChangeQuery',
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

