import Mock from 'mockjs'

const List = []

const count = 10
const discountContentList = []
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    ActID: '000' + i,
    ActName: '@ctitle(8)',
    ActStartTime: '@datetime',
    ActEndTime: '@datetime',
    Enabled: true
  }))
}
const RetailTypeNameArray = ['普通会员', '银卡会员', '金卡会员', '钻石会员']
const DisObjectTypeNameArray = ['', '企业用户', '散户']
for (let i = 0; i < count; i++) {
  discountContentList.push(Mock.mock({
    index: '@increment',
    ActID: '000' + i,
    ContentID: '000' + i,
    DisObjectType: '@integer(1,2)',
    DisObjectTypeName: function() {
      return DisObjectTypeNameArray[this.DisObjectType]
    },
    DisObjectTypeID: '@integer(0,3)',
    DisObjectTypeIDName: function() {
      return RetailTypeNameArray[this.DisObjectTypeID]
    },
    ValidMinVol: '@float(1,20,2,2)',
    DCTMoney: '@float(2,10,2,2)',
    StationID: '00000001|00000002',
    StationName: '00000001站|00000002站',
    AccNo: '000' + i,
    AccName: '散户',

    OilCode: '1020|1040'
  }))
}

export default [
  {
    url: '/discount/discountActDetailListQuery',
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
    url: '/discount/discountContentDetailListQuery',
    type: 'get',
    response: config => {
      const { stationNo, stationType } = config.query

      const mockList = discountContentList.filter(item => {
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
    url: '/discount/discountActAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/discount/discountActUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/discount/discountActDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/discount/discountContentAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/discount/discountContentUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/discount/discountContentDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
