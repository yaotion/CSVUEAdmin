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
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },

    BatID: '0001111111' + '@integer(1,9)',

    TankNo: '@integer(0, 6)',
    TankDiam: '@float(5,10,2,2)',

    TankLength: '@float(5,10,2,2)',
    TankVolume: '@float(5,10,2,2)',

    HighLevel: '@float(5,10,2,2)',
    HHightLevel: '@float(5,10,2,2)',

    LowLevel: '@float(5,10,2,2)',
    LLowLevel: '@float(5,10,2,2)',
    HighWater: '@float(5,10,2,2)',
    HighTemp: '@float(5,10,2,2)',
    LowTemp: '@float(5,10,2,2)',

    OilLevel: '@float(5,10,2,2)',
    WaterLevel: '@float(5,10,2,2)',

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

