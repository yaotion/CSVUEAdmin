import Mock from 'mockjs'

const List = []

const count = 10
const depositContentList = []
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    ActID: '000' + i,
    ActName: '@ctitle(8)',
    StartTM: '@datetime',
    EndTM: '@datetime',
    Enabled: true
  }))
}
const RetailTypeNameArray = ['普通会员', '银卡会员', '金卡会员', '钻石会员']
for (let i = 0; i < count; i++) {
  depositContentList.push(Mock.mock({
    index: '@increment',
    ActID: '000' + i,
    ContentID: '000' + i,
    DepositMin: '@float(0,10,2,2)',
    DepositMax: '@float(100,200,2,2)',
    StartTM: '@datetime',
    EndTM: '@datetime',
    AccNo: '000' + i,
    AccName: '@ctitle(8)',
    bonusType: '@integer(0,1)',
    bonusTypeName: function() {
      return (this.bonusType === 0) ? '按金额' : '按百分比'
    },
    RetailTypeID: '@integer(0,3)',
    RetailTypeName: function() {
      return RetailTypeNameArray[this.RetailTypeID]
    },
    OilCode: '1020|1040',
    DepositBonus: '@float(0,10,2,2)'
  }))
}

export default [
  {
    url: '/deposit/depositActDetailListQuery',
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
    url: '/deposit/depositContentDetailListQuery',
    type: 'get',
    response: config => {
      const { stationNo, stationType } = config.query

      const mockList = depositContentList.filter(item => {
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
    url: '/deposit/depositActAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/deposit/depositActUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/deposit/depositActDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/deposit/depositContentAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/deposit/depositContentUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/deposit/depositContentDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
