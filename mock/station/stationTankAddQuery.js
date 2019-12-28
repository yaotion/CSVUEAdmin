import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    Tank_no: '00' + i,
    AddTime: '@datetime',
    RandID: '@integer(0, 2)',
    Oil_name: function() {
      return OilNameArray[this.RandID]
    },
    OilCode: function() {
      return OilCodeArray[this.RandID]
    },
    Start_oilh: '@float(200,2000,2,2)',
    Start_vol: '@float(200,2000,2,2)',
    Start_temp: '@float(200,2000,2,2)',
    Start_dens: '@float(200,2000,2,2)',
    Start_wt: '@float(200,2000,2,2)',
    End_oilh: '@float(200,2000,2,2)',
    End_vol: '@float(200,2000,2,2)',
    End_temp: '@float(200,2000,2,2)',
    End_dens: '@float(200,2000,2,2)',
    End_wt: '@float(200,2000,2,2)',

    Qty_vol: '@float(200,2000,2,2)',
    Qty_wt: '@float(200,2000,2,2)',

    Doc_vol: '@float(200,2000,2,2)',
    Doc_dens: '@float(200,2000,2,2)',
    Doc_wt: '@float(200,2000,2,2)',
    Lost_vol: '@float(200,2000,2,2)',
    Lost_wt: '@float(200,2000,2,2)',

    Start_time: '@datetime',
    End_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/station/stationTankAddQuery',
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

