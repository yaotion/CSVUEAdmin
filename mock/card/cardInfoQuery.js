import Mock from 'mockjs'
const HolderCerTypeArray = ['护照', '身份证']
const AccNoArray = ['散户', '客户']
const BoolArray = ['否', '是']
const OilTypeTypeArray = ['92#', '95#', '0#']
const CardStateNameArray = ['初始化', '储值', '售卡', '正常', '挂失', '退卡']
const RetailTypeNameArray = ['无', '银卡', '金卡', '钻石', '自尊', '天王']

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    HolderCerType: '@integer(0, 1)',
    HolderCerTypeName: function() {
      return HolderCerTypeArray[this.HolderCerType]
    },
    HolderCerNo: '41000111100000' + '@string("number", 4, 4)',
    AccType: function() {
      return AccNoArray[this.HolderCerType]
    },
    BeginDate: '@date("yyyyMMdd HH:mm:ss")',
    EndDate: '@date("yyyyMMdd HH:mm:ss")',
    HolderName: '@cname',
    Mobile: '138' + '@string("number", 8, 8)',
    LimitCar: '豫A' + '@string("number", 5, 5)',
    LimitOilID: '@integer(0, 1,2)',
    LimitOil: function() {
      return OilTypeTypeArray[this.LimitOilID]
    },
    Moneys: '@float(200, 500,2 ,2)',
    IsGreyID: '@integer(0, 1)',
    IsGrey: function() {
      return BoolArray[this.IsGreyID]
    },
    CardState: '@integer(0,1,2,3,4)',
    CardStateName: function() {
      return CardStateNameArray[this.CardState]
    },
    RetailTypeName: function() {
      return RetailTypeNameArray[this.CardState]
    },
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/cardInfoQuery',
    type: 'post',
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

