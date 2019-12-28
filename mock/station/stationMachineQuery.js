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
    // const filterVal = ['index', 'StationNo', 'BatID', 'Terminal', 'MachNo',
    // 'Port', 'MachType', 'TankNo', 'OilName', 'UpdateTime']
    Terminal: '0' + '@integer(0,9)' + '_1',
    Mach_No: '0' + '@integer(0,9)',
    Port_No: '0',
    Mach_Type: 'censtar',
    Tank_No: '01',
    ChangeTime: '@datetime'
  }))
}

export default [
  {
    url: '/station/stationMachineQuery',
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

