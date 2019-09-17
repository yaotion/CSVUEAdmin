
const List = [
  {
    OilCode: 1000,
    OilName: '汽油',
    OilDensity: 0.32000,
    OilPrice: 2.300,
    OilEnabled: true
  },
  {
    OilCode: 1020,
    OilName: '92#汽油',
    OilDensity: 0.21000,
    OilPrice: 9.200,
    OilEnabled: true
  },
  {
    OilCode: 1040,
    OilName: '95#汽油',
    OilDensity: 0.35000,
    OilPrice: 9.500,
    OilEnabled: true
  },
  {
    OilCode: 2000,
    OilName: '柴油',
    OilDensity: 2.32000,
    OilPrice: 6.200,
    OilEnabled: true
  },
  {
    OilCode: 2001,
    OilName: '0#柴油',
    OilDensity: 0.00000,
    OilPrice: 0.000,
    OilEnabled: false
  },
  {
    OilCode: 3001,
    OilName: 'CNG',
    OilDensity: 0.00000,
    OilPrice: 0.000,
    OilEnabled: false
  },
  {
    OilCode: 3002,
    OilName: 'LNG',
    OilDensity: 0.00000,
    OilPrice: 0.000,
    OilEnabled: false
  },
  {
    OilCode: 4000,
    OilName: '电',
    OilDensity: 0.00000,
    OilPrice: 0.000,
    OilEnabled: false
  }
]

export default [
  {
    url: '/centerOil/centerOilDetailListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },

  {
    url: '/centerOil/centerOilAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/centerOil/centerOilUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/centerOil/centerOilDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

