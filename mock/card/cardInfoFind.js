import Mock from 'mockjs'
const HolderCerTypeArray = ['护照', '身份证']
const BoolArray = ['否', '是']
const OilTypeTypeArray = ['92#', '95#', '0#']
const CardStateNameArray = ['初始化', '储值', '售卡', '正常', '挂失', '退卡']
const HolderRetailTypeNameArray = ['普通会员', '银卡会员', '金卡会员', '钻石会员']
const mockCardResponse = Mock.mock({

  id: '',
  // 卡号
  CardNo: '01000111100000' + '@string("number", 4, 4)',
  // 姓名
  HolderName: '@cname',
  // 生日
  Birthday: '@datetime',
  // 手机号
  Mobile: '138' + '@string("number", 8, 8)',
  // 提示问题
  PWDHint: '',
  // 回答
  PWDAnswer: '',
  // 邮件地址
  // 卡账余额
  AccMoney: '@float(0, 50 ,2 ,2)',
  // 卡余额
  Moneys: '@float(200, 500,2 ,2)',
  // 账户名称
  AccName: '散户',
  // //////////////////////
  // 职务
  HolderJob: '会计',
  // 公司名称
  HolderCompanyName: 'XXX公司',
  // 公司地址
  HolderCompanyAddr: '河南郑州XX有限股份公司',
  // 公司电话
  HolderCompanyTelephone: '0371_' + '@string("number", 7, 7)',
  // 公司传真
  HolderCompanyFax: '0371_' + '@string("number", 7, 7)',
  // 油耗(100升以上、100升一下)
  // 接收邮件
  AllowEmail: '@integer(0, 1)',
  // 有效期
  BeginDate: '@date("yyyyMMdd")',
  EndDate: '@date("yyyyMMdd")',
  // 积分

  // 发型时间
  MakeTime: '@datetime("yyyy-MM-dd")',

  LimitCar: '豫A' + '@string("number", 5, 5)',
  LimitOilID: '@integer(0, 1,2)',
  LimitOil: function() {
    return OilTypeTypeArray[this.LimitOilID]
  },
  // 证件类型
  HolderCerType: '@integer(0, 1)',
  // 证件类型名称
  HolderCerTypeName: function() {
    return HolderCerTypeArray[this.HolderCerType]
  },
  // // 散户卡类型
  RetailTypeID: '@integer(0, 1,2,3)',
  // // 散户卡类型
  RetailTypeName: function() {
    return HolderRetailTypeNameArray[this.RetailTypeID]
  },
  // 证件号码
  HolderCerNo: '41000111100000' + '@string("number", 4, 4)',
  // 是否会卡
  IsGreyID: '@integer(0, 1)',
  // 是否会卡文字
  IsGrey: function() {
    return BoolArray[this.IsGreyID]
  },
  // 卡状态
  CardState: '@integer(0,1,2,3,4)',
  // 卡状态说明
  CardStateName: function() {
    return CardStateNameArray[this.CardState]
  },
  // 是否有密码
  HasPWD: '@integer(0, 1)',
  HasPWDName: function() {
    return BoolArray[this.HasPWD]
  }
})

export default [
  {
    url: '/card/cardInfoFind',
    type: 'get',
    response: config => {
      const { CardNo } = config.query
      mockCardResponse.CardNo = CardNo
      return {
        code: 20000,
        data: mockCardResponse
      }
    }
  }
]

