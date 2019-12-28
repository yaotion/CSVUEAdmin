import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#', '95#', '0#']
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    Tank_No: '00' + i,
    Emp_Name: '@cname',
    AddTime: '@datetime',
    RandID: '@integer(0, 2)',
    Oil_Name: function() {
      return OilNameArray[this.RandID]
    },
    Oil_Code: function() {
      return OilCodeArray[this.RandID]
    },
    Start_Oilh: '@float(200,2000,2,2)',
    Start_Vol: '@float(200,2000,2,2)',
    Start_Temp: '@float(200,2000,2,2)',
    Start_Dens: '@float(200,2000,2,2)',
    Start_Wt: '@float(200,2000,2,2)',
    End_Oilh: '@float(200,2000,2,2)',
    End_Vol: '@float(200,2000,2,2)',
    End_Temp: '@float(200,2000,2,2)',
    End_Dens: '@float(200,2000,2,2)',
    End_Wt: '@float(200,2000,2,2)',

    Doc_Vol: '@float(200,2000,2,2)',
    Doc_Dens: '@float(200,2000,2,2)',
    Doc_Wt: '@float(200,2000,2,2)',

    Acco_Vol: '@float(200,2000,2,2)',
    Acco_Wt: '@float(200,2000,2,2)',

    Qty_Vol: '@float(200,2000,2,2)',
    Qty_Dens: '@float(200,2000,2,2)',
    Qty_Wt: '@float(200,2000,2,2)',

    Loss_Wt: '@float(200,2000,2,2)',

    Start_Pump: '@float(200,2000,2,2)',
    End_Pump: '@float(200,2000,2,2)',
    Diff_Pump: '@float(200,2000,2,2)',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/station/stationTankShiftQuery',
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

