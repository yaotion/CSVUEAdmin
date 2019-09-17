
const List = [
  {
    PayWay: 1,
    PayWayName: '现金'
  }, {
    PayWay: 2,
    PayWayName: '信用卡'
  }, {
    PayWay: 3,
    PayWayName: '微信'
  }, {
    PayWay: 4,
    PayWayName: '支付宝'
  }, {
    PayWay: 5,
    PayWayName: '电子钱包'
  }
]

export default [
  {
    url: '/payWay/payWayDetailListQuery',
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
    url: '/payWay/payWayAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/payWay/payWayUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/payWay/payWayDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

