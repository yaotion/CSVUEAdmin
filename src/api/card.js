import request from '@/utils/request'

export function makelist(query) {
  return request({
    url: '/card/makelist',
    method: 'get',
    params: query
  })
}
export function userDepositTrade(query) {
  return request({
    url: '/card/userDepositTrade',
    method: 'get',
    params: query
  })
}
export function userSaleTrade(query) {
  return request({
    url: '/card/userSaleTrade',
    method: 'get',
    params: query
  })
}
export function userRecardTrade(query) {
  return request({
    url: '/card/userRecardTrade',
    method: 'get',
    params: query
  })
}
export function userLosscardTrade(query) {
  return request({
    url: '/card/userLosscardTrade',
    method: 'get',
    params: query
  })
}
export function userUnLosscardTrade(query) {
  return request({
    url: '/card/userUnLosscardTrade',
    method: 'get',
    params: query
  })
}
export function cardUngreyLog(query) {
  return request({
    url: '/card/cardUngreyLog',
    method: 'get',
    params: query
  })
}
export function custPayMoneyQuery(query) {
  return request({
    url: '/card/custPayMoneyQuery',
    method: 'get',
    params: query
  })
}
export function custChangeMoneyQuery(query) {
  return request({
    url: '/card/custChangeMoneyQuery',
    method: 'get',
    params: query
  })
}
export function custDepositQuery(query) {
  return request({
    url: '/card/custDepositQuery',
    method: 'get',
    params: query
  })
}
export function custUnDepositQuery(query) {
  return request({
    url: '/card/custUnDepositQuery',
    method: 'get',
    params: query
  })
}
export function userUnDepositTrade(query) {
  return request({
    url: '/card/userUnDepositTrade',
    method: 'get',
    params: query
  })
}

export function custCreateQuery(query) {
  return request({
    url: '/card/custCreateQuery',
    method: 'get',
    params: query
  })
}
export function custDestroyQuery(query) {
  return request({
    url: '/card/custDestroyQuery',
    method: 'get',
    params: query
  })
}
export function cardChangePinQuery(query) {
  return request({
    url: '/card/cardChangePinQuery',
    method: 'get',
    params: query
  })
}
export function cardReloadQuery(query) {
  return request({
    url: '/card/cardReloadQuery',
    method: 'get',
    params: query
  })
}
export function cardUpdateQuery(query) {
  return request({
    url: '/card/cardUpdateQuery',
    method: 'get',
    params: query
  })
}
export function cardReturnQuery(query) {
  return request({
    url: '/card/cardReturnQuery',
    method: 'get',
    params: query
  })
}
export function cardReturnWCQuery(query) {
  return request({
    url: '/card/cardReturnWCQuery',
    method: 'get',
    params: query
  })
}
export function cardReturnNCQuery(query) {
  return request({
    url: '/card/cardReturnNCQuery',
    method: 'get',
    params: query
  })
}
export function cardInfoQuery(query) {
  return request({
    url: '/card/cardInfoQuery',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params: JSON.stringify(query),
    data: JSON.stringify(query)
  })
}
export function cardInfoFind(query) {
  return request({
    url: '/card/cardInfoFind',
    method: 'get',
    params: query
  })
}
export function custInfoQuery(query) {
  return request({
    url: '/card/custInfoQuery',
    method: 'get',
    params: query
  })
}
export function custInfoFind(query) {
  return request({
    url: '/card/custInfoFind',
    method: 'get',
    params: query
  })
}
export function custCardQuery(query) {
  return request({
    url: '/card/custCardQuery',
    method: 'get',
    params: query
  })
}
export function cardBillQuery(query) {
  return request({
    url: '/card/cardBillQuery',
    method: 'get',
    params: query
  })
}
export function custBillQuery(query) {
  return request({
    url: '/card/custBillQuery',
    method: 'get',
    params: query
  })
}
export function cardTradeQuery(query) {
  return request({
    url: '/card/cardTradeQuery',
    method: 'get',
    params: query
  })
}
export function cardScoreBillQuery(query) {
  return request({
    url: '/card/cardScoreBillQuery',
    method: 'get',
    params: query
  })
}

export function cardScorePayQuery(query) {
  return request({
    url: '/card/cardScorePayQuery',
    method: 'get',
    params: query
  })
}
export function cardSaleStationSum(query) {
  return request({
    url: '/card/cardSaleStationSum',
    method: 'get',
    params: query
  })
}
export function custChangeLimitQuery(query) {
  return request({
    url: '/card/custChangeLimitQuery',
    method: 'get',
    params: query
  })
}

export function cardWhitelistQuery(query) {
  return request({
    url: '/card/cardWhitelistQuery',
    method: 'get',
    params: query
  })
}
export function cardPSAMQuery(query) {
  return request({
    url: '/card/cardPSAMQuery',
    method: 'get',
    params: query
  })
}
export function cardOilStationSum(query) {
  return request({
    url: '/card/cardOilStationSum',
    method: 'get',
    params: query
  })
} export function cardFuzzySearch(query) {
  return request({
    url: '/card/cardFuzzySearch',
    method: 'get',
    params: query
  })
}
export function cardPreQuery(query) {
  return request({
    url: '/card/cardPreQuery',
    method: 'get',
    params: query
  })
}
export function cardMZMKQuery(query) {
  return request({
    url: '/card/cardMZMKQuery',
    method: 'get',
    params: query
  })
}
export function cardChangePriceQuery(query) {
  return request({
    url: '/card/cardChangePriceQuery',
    method: 'get',
    params: query
  })
}
export function cardStationRecTime(query) {
  return request({
    url: '/card/cardStationRecTime',
    method: 'get',
    params: query
  })
}

export function cardBlackListQuery(query) {
  return request({
    url: '/card/cardBlackListQuery',
    method: 'get',
    params: query
  })
}

export function cardBlackListCheckQuery(query) {
  return request({
    url: '/card/cardBlackListCheckQuery',
    method: 'get',
    params: query
  })
}

export function cardOperatorSum(query) {
  return request({
    url: '/card/cardOperatorSum',
    method: 'get',
    params: query
  })
}
export function custMoneyQuery(query) {
  return request({
    url: '/card/custMoneyQuery',
    method: 'get',
    params: query
  })
}
export function custScoreQuery(query) {
  return request({
    url: '/card/custScoreQuery',
    method: 'get',
    params: query
  })
}
export function cardInoutQuery(query) {
  return request({
    url: '/card/cardInoutQuery',
    method: 'get',
    params: query
  })
}
export function cardChequeQuery(query) {
  return request({
    url: '/card/cardChequeQuery',
    method: 'get',
    params: query
  })
}
export function cardDaySettleSum(query) {
  return request({
    url: '/card/cardDaySettleSum',
    method: 'get',
    params: query
  })
}
export function custDeductQuery(query) {
  return request({
    url: '/card/custDeductQuery',
    method: 'get',
    params: query
  })
}
export function cardBalanceQuery(query) {
  return request({
    url: '/card/cardBalanceQuery',
    method: 'get',
    params: query
  })
}
export function cardInvoiceQuery(query) {
  return request({
    url: '/card/cardInvoiceQuery',
    method: 'get',
    params: query
  })
}

export function reportSaleSectionQuery(query) {
  return request({
    url: '/card/reportSaleSectionQuery',
    method: 'get',
    params: query
  })
}
