import React from 'react';
import { Tabs } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import styles from './index.less';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import {
  BalanceTransfer,
  FabricMetrics,
  GoMetrics,
  LedgerMetrics,
  OrdererMetrics,
  ChaincodeMetrics,
} from './components';

const { TabPane } = Tabs;
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/dataDashboard');

function DataDashboard(props) {
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={cs(styles['data-dashboard'], 'page-content', 'page-content-shadow')}>
        <Tabs defaultActiveKey="BalanceTransfer">
          <TabPane tab="交易" key="BalanceTransfer">
            <BalanceTransfer />
          </TabPane>
          <TabPane tab="超级账本" key="FabricMetrics">
            <FabricMetrics />
          </TabPane>
          <TabPane tab="Go" key="GoMetrics">
            <GoMetrics />
          </TabPane>
          <TabPane tab="账本" key="LedgerMetrics">
            <LedgerMetrics />
          </TabPane>
          <TabPane tab="排序节点" key="OrdererMetrics">
            <OrdererMetrics />
          </TabPane>
          <TabPane tab="链码" key="ChaincodeMetrics">
            <ChaincodeMetrics />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default connect(({ User }) => ({ User }))(DataDashboard);
