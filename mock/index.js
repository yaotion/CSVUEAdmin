import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

import user from './user'
import role from './role'
import article from './article'
import markCard from './card/markCard'
import userDepositTrade from './card/userDepositTrade'
import userSaleTrade from './card/userSaleTrade'
import userRecardTrade from './card/userRecardTrade'
import userLosscardTrade from './card/userLosscardTrade'
import userUnLosscardTrade from './card/userUnLosscardTrade'

import cardUngreyLog from './card/cardUngreyLog'
import custPayMoneyQuery from './card/custPayMoneyQuery'
import custChangeMoneyQuery from './card/custChangeMoneyQuery'
import custDepositQuery from './card/custDepositQuery'
import custCreateQuery from './card/custCreateQuery'
import custDestroyQuery from './card/custDestroyQuery'
import cardChangePinQuery from './card/cardChangePinQuery'
import cardReloadQuery from './card/cardReloadQuery'
import cardUpdateQuery from './card/cardUpdateQuery'
import cardReturnQuery from './card/cardReturnQuery'
import cardReturnWCQuery from './card/cardReturnWCQuery'
import cardReturnNCQuery from './card/cardReturnNCQuery'
import cardInfoQuery from './card/cardInfoQuery'
import cardInfoFind from './card/cardInfoFind'
import custInfoQuery from './card/custInfoQuery'
import custInfoFind from './card/custInfoFind'
import custCardQuery from './card/custCardQuery'
import cardBillQuery from './card/cardBillQuery'
import custBillQuery from './card/custBillQuery'
import cardTradeQuery from './card/cardTradeQuery'
import cardScoreBillQuery from './card/cardScoreBillQuery'
import cardScorePayQuery from './card/cardScorePayQuery'
import cardSaleStationSum from './card/cardSaleStationSum'
import custChangeLimitQuery from './card/custChangeLimitQuery'
import cardWhitelistQuery from './card/cardWhitelistQuery'
import cardPSAMQuery from './card/cardPSAMQuery'
import cardOilStationSum from './card/cardOilStationSum'
import cardFuzzySearch from './card/cardFuzzySearch'
import cardPreQuery from './card/cardPreQuery'
import cardMZMKuery from './card/cardMZMKuery'
import cardChangePriceQuery from './card/cardChangePriceQuery'
import cardBlackListQuery from './card/cardBlackListQuery'
import cardBlackListCheckQuery from './card/cardBlackListCheckQuery'
import cardOperatorSum from './card/cardOperatorSum'
import custMoneyQuery from './card/custMoneyQuery'
import custScoreQuery from './card/custScoreQuery'
import cardInoutQuery from './card/cardInoutQuery'
import cardChequeQuery from './card/cardChequeQuery'
import cardDaySettleSum from './card/cardDaySettleSum'
import custDeductQuery from './card/custDeductQuery'
import cardBalanceQuery from './card/cardBalanceQuery'
import reportSaleSectionQuery from './report/reportSaleSectionQuery'
import cardInvoiceQuery from './card/cardInvoiceQuery'
import stationTankMonitorQuery from './station/stationTankMonitorQuery'
import stationDayReportByTerminalQuery from './station/stationDayReportByTerminalQuery'
import stationDayReportByOilQuery from './station/stationDayReportByOilQuery'
import stationDayReportByTankQuery from './station/stationDayReportByTankQuery'
import stationDayReportByOptQuery from './station/stationDayReportByOptQuery'
import stationDayReportByCashierQuery from './station/stationDayReportByCashierQuery'
import stationTankAddQuery from './station/stationTankAddQuery'
import stationOilChangeQuery from './station/stationOilChangeQuery'
import stationMachineQuery from './station/stationMachineQuery'
import stationTankChangeQuery from './station/stationTankChangeQuery'
import stationOptLogQuery from './station/stationOptLogQuery'
import stationTankStoreQuery from './station/stationTankStoreQuery'
import stationShiftNowYYLByTerminalQuery from './station/stationShiftNowYYLByTerminalQuery'
import stationShiftNowYYLByOilQuery from './station/stationShiftNowYYLByOilQuery'
import stationShiftNowYYLDetailQuery from './station/stationShiftNowYYLDetailQuery'
import stationTankAlarmQuery from './station/stationTankAlarmQuery'
import stationTradeListQuery from './station/stationTradeListQuery'
import sumTradeByTradeTypeQuery from './station/sumTradeByTradeTypeQuery'
import sumTradeByCardQuery from './station/sumTradeByCardQuery'

import sumTradeByCardTypeQuery from './station/sumTradeByCardTypeQuery'
import sumTradeByOilQuery from './station/sumTradeByOilQuery'
import sumTradeByOptQuery from './station/sumTradeByOptQuery'
import sumTradeByTerminalQuery from './station/sumTradeByTerminalQuery'
import sumTradeByPayWayQuery from './station/sumTradeByPayWayQuery'
import stationZHDayReportQuery from './station/stationZHDayReportQuery'
import stationEmpCardQuery from './station/stationEmpCardQuery'
import stationZHTradeReportQuery from './station/stationZHTradeReportQuery'
import stationEmpBillQuery from './station/stationEmpBillQuery'

import stationGoodsTradeListQuery from './station/stationGoodsTradeListQuery'
import sumGoodsTradeByCardQuery from './station/sumGoodsTradeByCardQuery'
import sumGoodsTradeByGoodsQuery from './station/sumGoodsTradeByGoodsQuery'
import sumGoodsTradeByOptQuery from './station/sumGoodsTradeByOptQuery'
import sumGoodsTradeByPayWayQuery from './station/sumGoodsTradeByPayWayQuery'
import stationManage from './stationManage'
import payWayManage from './payWayManage'
import centerOilManage from './centerOilManage'
import operatorManage from './operatorManage'
import depositManage from './depositManage'
import discountManage from './discountManage'
import retailTypeManage from './retailTypeManage'
import priceSetManage from './priceSetManage'

import search from './remote-search'
import base from './base'

const mocks = [
  ...user,
  ...role,
  ...article,
  ...markCard,
  ...userDepositTrade,
  ...userSaleTrade,
  ...userRecardTrade,
  ...userLosscardTrade,
  ...userUnLosscardTrade,
  ...cardUngreyLog,
  ...custPayMoneyQuery,
  ...custChangeMoneyQuery,
  ...custDepositQuery,
  ...custCreateQuery,
  ...custDestroyQuery,
  ...cardChangePinQuery,
  ...cardReloadQuery,
  ...cardUpdateQuery,
  ...cardReturnQuery,
  ...cardReturnWCQuery,
  ...cardReturnNCQuery,
  ...cardInfoQuery,
  ...cardInfoFind,
  ...custInfoQuery,
  ...custInfoFind,
  ...custCardQuery,
  ...cardBillQuery,
  ...custBillQuery,
  ...cardTradeQuery,
  ...cardScoreBillQuery,
  ...cardScorePayQuery,
  ...cardSaleStationSum,
  ...custChangeLimitQuery,
  ...cardWhitelistQuery,
  ...cardPSAMQuery,
  ...cardOilStationSum,
  ...cardFuzzySearch,
  ...cardPreQuery,
  ...cardMZMKuery,
  ...cardChangePriceQuery,
  ...cardBlackListQuery,
  ...cardBlackListCheckQuery,
  ...cardOperatorSum,
  ...custMoneyQuery,
  ...custScoreQuery,
  ...cardInoutQuery,
  ...cardChequeQuery,
  ...cardDaySettleSum,
  ...custDeductQuery,
  ...cardBalanceQuery,
  ...reportSaleSectionQuery,
  ...cardInvoiceQuery,
  ...stationTankMonitorQuery,
  ...stationDayReportByTerminalQuery,
  ...stationDayReportByOilQuery,
  ...stationDayReportByTankQuery,
  ...stationDayReportByOptQuery,
  ...stationDayReportByCashierQuery,
  ...stationTankAddQuery,
  ...stationOilChangeQuery,
  ...stationMachineQuery,
  ...stationTankChangeQuery,
  ...stationOptLogQuery,
  ...stationTankStoreQuery,
  ...stationShiftNowYYLByTerminalQuery,
  ...stationShiftNowYYLByOilQuery,
  ...stationShiftNowYYLDetailQuery,
  ...stationTankAlarmQuery,
  ...stationTradeListQuery,
  ...sumTradeByTradeTypeQuery,
  ...sumTradeByCardQuery,
  ...sumTradeByCardTypeQuery,
  ...sumTradeByOilQuery,
  ...sumTradeByOptQuery,
  ...sumTradeByTerminalQuery,
  ...sumTradeByPayWayQuery,
  ...stationZHDayReportQuery,
  ...stationEmpCardQuery,
  ...stationZHTradeReportQuery,
  ...stationEmpBillQuery,
  ...stationGoodsTradeListQuery,
  ...sumGoodsTradeByCardQuery,
  ...sumGoodsTradeByGoodsQuery,
  ...sumGoodsTradeByOptQuery,
  ...sumGoodsTradeByPayWayQuery,
  ...base,
  ...stationManage,
  ...payWayManage,
  ...centerOilManage,
  ...operatorManage,
  ...depositManage,
  ...discountManage,
  ...retailTypeManage,
  ...priceSetManage,
  ...search
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
