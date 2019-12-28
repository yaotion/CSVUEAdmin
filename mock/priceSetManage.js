import Mock from 'mockjs'

const List = []

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    PriceSetName: '测试策略' + i,
    UseTime: '@datetime',
    PriceUse: 1,
    PriceList: [
      {
        OilCode: '1020',
        OilName: '92#汽油',
        OilPrice: 7.25
      },
      {
        OilCode: '1040',
        OilName: '95#汽油',
        OilPrice: 8.10
      }
    ]
  }))
}

export default [
  {
    url: '/priceSet/priceSetListQuery',
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
    url: '/priceSet/priceSetAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/priceSet/priceSetUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/priceSet/priceSetDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/priceSet/oilPriceAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/priceSet/oilPriceUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/priceSet/oilPriceDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
