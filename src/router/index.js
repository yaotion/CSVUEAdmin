import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/BussDetail',
    component: Layout,
    redirect: '/BussDetail/CardDetail/Deposit',
    meta: { title: '业务明细查询', icon: 'dashboard', affix: true },
    children: [
      {
        path: 'Sale',
        component: () => import('@/views/card/user_Sale_Trade'),
        name: 'Sale',
        meta: { title: '用户卡售卡情况查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'Recard',
        component: () => import('@/views/card/user_Sale_Recard'),
        name: 'Recard',
        meta: { title: '用户卡补卡记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'Losscard',
        component: () => import('@/views/card/user_Sale_Losscard'),
        name: 'Losscard',
        meta: { title: '卡挂失日志查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'UnLossCard',
        component: () => import('@/views/card/user_Sale_UnLosscard'),
        name: 'UnLossCard',
        meta: { title: '卡解挂日志查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardUnGreyLog',
        component: () => import('@/views/card/Card_Ungrey_Log'),
        name: 'UnGreyLog',
        meta: { title: '卡解灰日志查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'Deposit',
        component: () => import('@/views/card/user_Deposit_Trade'),
        name: 'Deposit',
        meta: { title: '散户卡储值纪录', icon: 'dashboard', affix: true }
      },
      {
        path: 'PayMoney',
        component: () => import('@/views/card/Cust_PayMoney_Query'),
        name: 'PayMoney',
        meta: { title: '单位客户存钱记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'ChangeMoney',
        component: () => import('@/views/card/Cust_ChangeMoney_Query'),
        name: 'ChangeMoney',
        meta: { title: '单位客户划账记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustDepositQuery',
        component: () => import('@/views/card/Cust_Deposit_Query'),
        name: 'CustDepositQuery',
        meta: { title: '客户卡储值交易', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustUnDepositQuery',
        component: () => import('@/views/card/Cust_UnDeposit_Query'),
        name: 'CustUnDepositQuery',
        meta: { title: '客户卡扣款纪录', icon: 'dashboard', affix: true }
      },
      {
        path: 'UserUnDepositQuery',
        component: () => import('@/views/card/user_UnDeposit_Trade'),
        name: 'UserUnDepositQuery',
        meta: { title: '散户卡扣款纪录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustCreateQuery',
        component: () => import('@/views/card/Cust_Create_Query'),
        name: 'CustCreateQuery',
        meta: { title: '单位客户开户记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustDestroyQuery',
        component: () => import('@/views/card/Cust_Destroy_Query'),
        name: 'CustDestroyQuery',
        meta: { title: '单位客户销户记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardChangePinQuery',
        component: () => import('@/views/card/Card_ChangePin_Query'),
        name: 'CardChangePinQuery',
        meta: { title: '卡密码修改日志', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardReloadQuery',
        component: () => import('@/views/card/Card_Reload_Query'),
        name: 'CardReloadQuery',
        meta: { title: '重装卡密码日志', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardUpdateQuery',
        component: () => import('@/views/card/Card_Update_Query'),
        name: 'CardUpdateQuery',
        meta: { title: '卡信息修改记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardReturnQuery',
        component: () => import('@/views/card/Card_Return_Query'),
        name: 'CardReturnQuery',
        meta: { title: '用户卡退卡记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardReturnWCQuery',
        component: () => import('@/views/card/Card_ReturnWC_Query'),
        name: 'CardReturnWCQuery',
        meta: { title: '有卡退卡申请', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardReturnNCQuery',
        component: () => import('@/views/card/Card_ReturnNC_Query'),
        name: 'CardReturnNCQuery',
        meta: { title: '无卡退卡申请', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardInfoQuery',
        component: () => import('@/views/card/Card_Info_Query'),
        name: 'CardInfoQuery',
        meta: { title: '用户卡信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustInfoQuery',
        component: () => import('@/views/card/Cust_Info_Query'),
        name: 'CustInfoQuery',
        meta: { title: '单位客户信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardBillQuery',
        component: () => import('@/views/card/Card_Bill_Query'),
        name: 'CardBillQuery',
        meta: { title: '用户卡对账单', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustBillQuery',
        component: () => import('@/views/card/Cust_Bill_Query'),
        name: 'CustBillQuery',
        meta: { title: '单位客户对账单', icon: 'dashboard', affix: true }
      }, {
        path: 'CardTradeQuery',
        component: () => import('@/views/card/Card_Trade_Query'),
        name: 'CardTradeQuery',
        meta: { title: '用户卡消费信息', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardScoreBillQuery',
        component: () => import('@/views/card/Card_ScoreBill_Query'),
        name: 'CardScoreBillQuery',
        meta: { title: '用户卡积分账单', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardScorePayQuery',
        component: () => import('@/views/card/Card_ScorePay_Query'),
        name: 'CardScorePayQuery',
        meta: { title: '用户卡兑奖明细查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardSaleStationSum',
        component: () => import('@/views/card/Card_SaleStation_Sum'),
        name: 'CardSaleStationSum',
        meta: { title: '发卡点清算汇总表', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustChangeLimitQuery',
        component: () => import('@/views/card/Cust_ChangeLimit_Query'),
        name: 'CustChangeLimitQuery',
        meta: { title: '限制账户划账记录', icon: 'dashboard', affix: true }
      }

    ]
  },

  {
    path: '/CenterReport',
    component: Layout,
    redirect: '/BussDetail/CardDetail/Deposit',
    meta: { title: '结算中心报表', icon: 'dashboard', affix: true },
    children: [
      {
        path: 'markcard-query',
        component: () => import('@/views/card/make_Card'),
        name: 'markcard',
        meta: { title: '制卡纪录查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardWhiltelistQuery',
        component: () => import('@/views/card/Card_Whitelist_Query'),
        name: 'CardWhiltelistQuery',
        meta: { title: '白名单卡查询', icon: 'dashboard', affix: true }
      }, {
        path: 'CardPSAMQuery',
        component: () => import('@/views/card/Card_PSAM_Query'),
        name: 'CardPSAMQuery',
        meta: { title: 'PSAM卡信息', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardOilStationSum',
        component: () => import('@/views/card/Card_OilStation_Sum'),
        name: 'CardOilStationSum',
        meta: { title: '油站清存结算查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardPreQuery',
        component: () => import('@/views/card/Card_Pre_Query'),
        name: 'CardPreQuery',
        meta: { title: '优惠记录查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardMZMKQuery',
        component: () => import('@/views/card/Card_MZMK_Query'),
        name: 'CardMZMKQuery',
        meta: { title: '明折明扣优惠记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardChangePriceQuery',
        component: () => import('@/views/card/Card_ChangePrice_Query'),
        name: 'CardChangePriceQuery',
        meta: { title: '调价记录查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardTradeTransferQuery',
        component: () => import('@/views/card/Card_TradeTransfer_Query'),
        name: 'CardTradeTransferQuery',
        meta: { title: '最后传输时间查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardBlacklistQuery',
        component: () => import('@/views/card/Card_BlackList_Query'),
        name: 'CardBlacklistQuery',
        meta: { title: '黑名单查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardBlackListCheckQuery',
        component: () => import('@/views/card/Card_BlackListCheck_Query'),
        name: 'CardBlackListCheckQuery',
        meta: { title: '黑名单校验记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardOperatorSum',
        component: () => import('@/views/card/Card_Operator_Sum'),
        name: 'CardOperatorSum',
        meta: { title: '操作员日志查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustMoneyQuery',
        component: () => import('@/views/card/Cust_Money_Query'),
        name: 'CustMoneyQuery',
        meta: { title: '单位账户信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustScoreQuery',
        component: () => import('@/views/card/Cust_Score_Query'),
        name: 'CustScoreQuery',
        meta: { title: '单位积分信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardInoutQuery',
        component: () => import('@/views/card/Card_Inout_Query'),
        name: 'CardInoutQuery',
        meta: { title: '卡片出入库查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardChequeQuery',
        component: () => import('@/views/card/Card_Cheque_Query'),
        name: 'CardChequeQuery',
        meta: { title: '支票信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardDaySettleSum',
        component: () => import('@/views/card/Card_DaySettle_Sum'),
        name: 'CardDaySettleSum',
        meta: { title: '日结信息', icon: 'dashboard', affix: true }
      },
      {
        path: 'CustDeductQuery',
        component: () => import('@/views/card/Cust_Deduct_Query'),
        name: 'CustDeductQuery',
        meta: { title: '扣款额度修改查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardBalanceQuery',
        component: () => import('@/views/card/Card_Balance_Query'),
        name: 'CardBalanceQuery',
        meta: { title: '用户卡平衡表', icon: 'dashboard', affix: true }
      },
      {
        path: 'ReportSaleSectionQuery',
        component: () => import('@/views/card/Report_SaleSection_Query'),
        name: 'ReportSaleSectionQuery',
        meta: { title: '油品销售区间报表', icon: 'dashboard', affix: true }
      },
      {
        path: 'CardInvoiceQuery',
        component: () => import('@/views/card/Card_Invoice_Query'),
        name: 'CardInvoiceQuery',
        meta: { title: '开票查询', icon: 'dashboard', affix: true }
      }

    ]
  },

  {
    path: '/Station',
    component: Layout,
    redirect: '/Station/TankMonitor',
    meta: { title: '油站报表', icon: 'dashboard', affix: true },
    children: [
      {
        path: 'StationTankMonitorQuery',
        component: () => import('@/views/station/Station_TankMonitor_Query'),
        name: 'StationTankMonitorQuery',
        meta: { title: '油站监控记录', icon: 'dashboard', affix: true }
      }, {
        path: 'StationDayReportQuery',
        component: () => import('@/views/station/Station_DayReport_Query'),
        name: 'StationDayReportQuery',
        meta: { title: '油站报表查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationTankAddQuery',
        component: () => import('@/views/station/Station_TankAdd_Query'),
        name: 'StationTankAddQuery',
        meta: { title: '油罐卸油记录', icon: 'dashboard', affix: true }
      },

      {
        path: 'StationOilChangeQuery',
        component: () => import('@/views/station/Station_OilChange_Query'),
        name: 'StationOilChangeQuery',
        meta: { title: '油品修改记录查询', icon: 'dashboard', affix: true }
      },

      {
        path: 'StationMachineQuery',
        component: () => import('@/views/station/Station_Machine_Query'),
        name: 'StationMachineQuery',
        meta: { title: '油机信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationTankChangeQuery',
        component: () => import('@/views/station/Station_TankChange_Query'),
        name: 'StationTankChangeQuery',
        meta: { title: '油罐信息查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationOptLogQuery',
        component: () => import('@/views/station/Station_OptLog_Query'),
        name: 'StationOptLogQuery',
        meta: { title: '油站操作日志查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationTankStoreQuery',
        component: () => import('@/views/station/Station_TankStore_Query'),
        name: 'StationTankStoreQuery',
        meta: { title: '油罐库存查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationShiftNoYYLQuery',
        component: () => import('@/views/station/Station_ShiftNoYYL_Query'),
        name: 'StationShiftNoYYLQuery',
        meta: { title: '本班营业量查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationTankAlarmQuery',
        component: () => import('@/views/station/Station_TankAlarm_Query'),
        name: 'StationTankAlarmQuery',
        meta: { title: '油罐报警记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationTradeQuery',
        component: () => import('@/views/station/Station_Trade_Query'),
        name: 'StationTradeQuery',
        meta: { title: '油站加油记录', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationZHDayReportQuery',
        component: () => import('@/views/station/Station_ZHDayReport_Query'),
        name: 'StationZHDayReportQuery',
        meta: { title: '综合日报查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationEmpCardQuery',
        component: () => import('@/views/station/Station_EmpCard_Query'),
        name: 'StationEmpCardQuery',
        meta: { title: '员工卡查询', icon: 'dashboard', affix: true }
      },
      {
        path: 'StationEmpBillQuery',
        component: () => import('@/views/station/Station_EmpBill_Query'),
        name: 'StationEmpBillQuery',
        meta: { title: '员工卡对账单', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/SysSet',
    component: Layout,
    redirect: '/SysSet/StationManage',
    meta: { title: '系统设置', icon: 'dashboard', affix: true },
    children: [
      {
        path: 'StationManage',
        component: () => import('@/views/SysSet/Station_Manage'),
        name: 'StationManage',
        meta: { title: '网点信息设置', icon: 'dashboard', affix: true }
      }, {
        path: 'PayWayManage',
        component: () => import('@/views/SysSet/PayWay_Manage'),
        name: 'PayWayManage',
        meta: { title: '结算方式设置', icon: 'dashboard', affix: true }
      }, {
        path: 'CenterOilManage',
        component: () => import('@/views/SysSet/CenterOil_Manage'),
        name: 'CenterOilManage',
        meta: { title: '常用油品设置', icon: 'dashboard', affix: true }
      },
      {
        path: 'OperatorManage',
        component: () => import('@/views/SysSet/Operator_Manage'),
        name: 'OperatorManage',
        meta: { title: '操作员管理', icon: 'dashboard', affix: true }
      },

      {
        path: 'DepositManage',
        component: () => import('@/views/SysSet/Deposit_Manage'),
        name: 'DepositManage',
        meta: { title: '储值赠送管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'DiscountManage',
        component: () => import('@/views/SysSet/Discount_Manage'),
        name: 'DiscountManage',
        meta: { title: '明折明扣管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'RetailTypeManage',
        component: () => import('@/views/SysSet/RetailType_Manage'),
        name: 'RetailTypeManage',
        meta: { title: '散户类型管理', icon: 'dashboard', affix: true }
      },
      {
        path: '价格体系管理',
        component: () => import('@/views/SysSet/PriceSet_Manage'),
        name: 'PriceSetManage',
        meta: { title: '价格体系管理', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
