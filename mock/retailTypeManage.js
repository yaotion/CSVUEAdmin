import Mock from 'mockjs'

const List = []

const count = 10
const userCardList = []

List.push(
  {
    RetailTypeID: 0,
    RetailTypeName: '普通会员'
  },
  {
    RetailTypeID: 1,
    RetailTypeName: '银卡会员'
  },
  {
    RetailTypeID: 2,
    RetailTypeName: '金卡会员'
  },
  {
    RetailTypeID: 3,
    RetailTypeName: '钻石会员'
  }
)

const RetailTypeNameArray = ['普通会员', '银卡会员', '金卡会员', '钻石会员']

for (let i = 0; i < count; i++) {
  userCardList.push(Mock.mock({
    index: '@increment',
    RetailTypeID: '@integer(0,3)',
    RetailTypeName: function() {
      return RetailTypeNameArray[this.RetailTypeID]
    },

    CardNo: '01000111100000' + '@string("number", 4, 4)',
    HolderName: '@cname',
    Mobile: '138' + '@string("number", 8, 8)'
  }))
}

export default [
  {
    url: '/retailType/retailTypeListQuery',
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
    url: '/retailType/retailTypeUserCardListQuery',
    type: 'get',
    response: config => {
      const { stationNo, stationType } = config.query

      const mockList = userCardList.filter(item => {
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
    url: '/retailType/retailTypeAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/retailType/retailTypeUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/retailType/retailTypeDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/retailType/retailTypeSetUserCard',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
