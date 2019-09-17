import Mock from 'mockjs'
const HolderCerTypeArray = ['护照', '身份证']
const BoolArray = ['否', '是']
const OilTypeTypeArray = ['92#', '95#', '0#']
const CardStateNameArray = ['初始化', '储值', '售卡', '正常', '挂失', '退卡']
const List = []
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    HolderCerType: '@integer(0, 1)',
    HolderCerTypeName: function() {
      return HolderCerTypeArray[this.HolderCerType]
    },
    HolderCerNo: '41000111100000' + '@string("number", 4, 4)',

    BeginDate: '@date("yyyyMMdd")',
    EndDate: '@date("yyyyMMdd")',
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
    }
  }))
}

export default [
  {
    url: '/card/custCardQuery',
    type: 'get',
    response: config => {
      const mockList = List
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  }
]

