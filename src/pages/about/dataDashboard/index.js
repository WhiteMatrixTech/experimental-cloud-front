import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import cs from 'classnames';
import { history } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
import { Roles } from 'utils/roles';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { FabricMetrics, GoMetrics, LedgerMetrics, OrdererMetrics, ChaincodeMetrics } from './components';

const { TabPane } = Tabs;
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/dataDashboard');

function DataDashboard(props) {
  const { User } = props;
  const { userRole } = User;

  useEffect(() => {
    if (userRole !== Roles.NetworkAdmin) {
      history.push('/403');
    }
  }, [userRole]);
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={cs(styles['data-dashboard'], 'page-content', 'page-content-shadow')}>
        <Tabs defaultActiveKey="FabricMetrics">
          <TabPane tab="Hyperledger Fabric Metrics" key="FabricMetrics">
            <FabricMetrics />
          </TabPane>
          <TabPane tab="Go Metrics" key="GoMetrics">
            <GoMetrics />
          </TabPane>
          <TabPane tab="Ledger Metrics" key="LedgerMetrics">
            <LedgerMetrics />
          </TabPane>
          <TabPane tab="Orderer Metrics" key="OrdererMetrics">
            <OrdererMetrics />
          </TabPane>
          <TabPane tab="Chaincode Metrics" key="ChaincodeMetrics">
            <ChaincodeMetrics />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default connect(({ User }) => ({ User }))(DataDashboard);
