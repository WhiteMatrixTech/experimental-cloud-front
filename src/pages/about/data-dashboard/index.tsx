import React from 'react';
import { Tabs } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import styles from './index.less';
import { Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import {
  BalanceTransfer,
  FabricMetrics,
  GoMetrics,
  LedgerMetrics,
  OrdererMetrics,
  ChaincodeMetrics
} from './components';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';

const { TabPane } = Tabs;
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/data-dashboard');

function DataDashboard() {
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={cs(styles['data-dashboard'], 'page-content', 'page-content-shadow')}>
        <Tabs defaultActiveKey="FabricMetrics">
          <TabPane tab={Intl.formatMessage('BASS_DASHBOARD_SUPER_LEDGER')} key="FabricMetrics">
            <FabricMetrics />
          </TabPane>
          <TabPane tab={Intl.formatMessage('BASS_DASHBOARD_LEDGER')} key="LedgerMetrics">
            <LedgerMetrics />
          </TabPane>
          <TabPane tab={Intl.formatMessage('BASS_DASHBOARD_TRANSACTION')} key="BalanceTransfer">
            <BalanceTransfer />
          </TabPane>
          <TabPane tab={Intl.formatMessage('BASS_DASHBOARD_CHAINCODE')} key="ChaincodeMetrics">
            <ChaincodeMetrics />
          </TabPane>
          <TabPane tab={Intl.formatMessage('BASS_DASHBOARD_SORT_NODE')} key="OrdererMetrics">
            <OrdererMetrics />
          </TabPane>
          <TabPane tab="Go" key="GoMetrics">
            <GoMetrics />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default connect(({ User }: ConnectState) => ({ User }))(DataDashboard);
