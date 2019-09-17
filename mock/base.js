import Mock from 'mockjs'

const List = []
const count = 5

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    stationno: '0000000' + (i + 1),
    stationname: function() {
      return this.stationno + '发卡点'
    }
  }))
}
const PreIdList = [
  {
    preId: 99,
    preName: '明折明扣'
  },
  {
    preId: 1,
    preName: '优惠返还'
  },
  {
    preId: 2,
    preName: '圈存'
  }
]
const ShiftListQuery = [
  {
    shiftNo: 1
  },
  {
    shiftNo: 2
  },
  {
    shiftNo: 3
  }
]
const OilCodeList = [
  {
    oilCode: 1020,
    oilName: '92#汽油'
  },
  {
    oilCode: 1040,
    oilName: '95#汽油'
  },
  {
    oilCode: 2001,
    oilName: '0#柴油'
  }
]

const TerminalList = [
  {
    terminal: '01_1',
    terminalName: '01_1'
  },
  {
    terminal: '02_1',
    terminalName: '02_1'
  },
  {
    terminal: '03_1',
    terminalName: '03_1'
  },
  {
    terminal: '04_1',
    terminalName: '04_1'
  },
  {
    terminal: '05_1',
    terminalName: '05_1'
  }

]

const TradeTypeList = [
  {
    tradeType: '0',
    tradeTypeName: '正常'
  },
  {
    tradeType: '1',
    tradeTypeName: '逃卡'
  },
  {
    tradeType: '2',
    tradeTypeName: '解扣'
  }
]
const CardTypeList = [
  {
    cardType: '1',
    cardTypeName: '员工卡'
  },
  {
    cardType: '2',
    cardTypeName: '客户卡'
  }
]
const PaywayList = [
  {
    payway: '1',
    paywayName: '现金'
  }, {
    payway: '2',
    paywayName: '加油卡'
  }, {
    payway: '3',
    paywayName: '微信'
  }
]

const OptList = [
  {
    optNo: '01',
    optName: '张三'
  },
  {
    optNo: '02',
    optName: '李四'
  }
]

const GoodsList = [
  {
    goodsCode: '1020',
    goodsName: '可乐'
  },
  {
    goodsCode: '1040',
    goodsName: '洗衣粉'
  }
]

const RetailTypeList = [
  {
    retailTypeID: 0,
    retailTypeName: '普通会员'
  }, {
    retailTypeID: 1,
    retailTypeName: '银卡会员'
  }, {
    retailTypeID: 2,
    retailTypeName: '金卡会员'
  }, {
    retailTypeID: 3,
    retailTypeName: '钻石会员'
  }
]
const cardStateList = [
  {
    cardState: 1,
    cardStateName: '制卡'
  },
  {
    cardState: 2,
    cardStateName: '已售卡'
  },
  {
    cardState: 3,
    cardStateName: '正常'
  },
  {
    cardState: 4,
    cardStateName: '挂失'
  },
  {
    cardState: 5,
    cardStateName: '退卡'
  },
  {
    cardState: 6,
    cardStateName: '补卡'
  },

  {
    cardState: 7,
    cardStateName: '丢失已补'
  }

]
const cardStateCompList = [
  {
    'sortID': 1,
    'sortName': '组合状态',
    'sortData': [
      {
        'cardState': 100,
        'cardStateName': '未发售'
      },
      {
        'cardState': 100,
        'cardStateName': '已发售'
      }
    ]
  },
  {
    'sortID': 2,
    'sortName': '详细状态',
    'sortData': [
      {
        'cardState': 1,
        'cardStateName': '制卡'
      },
      {
        'cardState': 2,
        'cardStateName': '已售卡'
      },
      {
        'cardState': 3,
        'cardStateName': '正常'
      },
      {
        'cardState': 4,
        'cardStateName': '挂失'
      },
      {
        'cardState': 5,
        'cardStateName': '退卡'
      },
      {
        'cardState': 6,
        'cardStateName': '补卡'
      },
      {
        'cardState': 7,
        'cardStateName': '丢失已补'
      }
    ]
  }]
export default [
  {
    url: '/base/stationList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: List
        }
      }
    }
  },
  {
    url: '/base/preIdListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: PreIdList
        }
      }
    }
  },
  {
    url: '/base/shiftListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: ShiftListQuery
        }
      }
    }
  },
  {
    url: '/base/oilCodeListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: OilCodeList
        }
      }
    }
  },
  {
    url: '/base/terminalListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {

          items: TerminalList
        }
      }
    }
  },
  {
    url: '/base/tradeTypeListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {

          items: TradeTypeList
        }
      }
    }
  },
  {
    url: '/base/cardTypeListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {

          items: CardTypeList
        }
      }
    }
  },
  {
    url: '/base/paywayListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: PaywayList
        }
      }
    }
  },
  {
    url: '/base/optListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: OptList
        }
      }
    }
  },
  {
    url: '/base/goodsListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: GoodsList
        }
      }
    }
  },
  {
    url: '/base/retailTypeListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: RetailTypeList
        }
      }
    }
  },
  {
    url: '/base/cardStateListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: cardStateList
        }
      }
    }
  },
  {
    url: '/base/cardStateCompListQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items: cardStateCompList
        }
      }
    }
  }

]

