import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    TankNo: '00' + i,
    OptName: '@cname',
    OptTime: '@datetime',
    RandID: '@integer(0, 2)',
    OilName: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },
    StartHeight: '@float(200,2000,2,2)',
    StartQty: '@float(200,2000,2,2)',
    StartTemp: '@float(200,2000,2,2)',
    StartDensity: '@float(200,2000,2,2)',
    StartWeight: '@float(200,2000,2,2)',
    EndHeight: '@float(200,2000,2,2)',
    EndQty: '@float(200,2000,2,2)',
    EndTemp: '@float(200,2000,2,2)',
    EndDensity: '@float(200,2000,2,2)',
    EndWeight: '@float(200,2000,2,2)',

    Qty: '@float(200,2000,2,2)',
    Density: '@float(200,2000,2,2)',
    Weight: '@float(200,2000,2,2)',
    ZMQty: '@float(200,2000,2,2)',
    ZMWeight: '@float(200,2000,2,2)',

    BillQty: '@float(200,2000,2,2)',
    BillDensity: '@float(200,2000,2,2)',
    BillWeight: '@float(200,2000,2,2)',

    LossWeight: '@float(200,2000,2,2)',

    StartPump: '@float(200,2000,2,2)',
    EndPump: '@float(200,2000,2,2)',
    PumpDiff: '@float(200,2000,2,2)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/station/stationTankStoreQuery',
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

