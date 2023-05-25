import { Tabs } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import styles from './index.less';
import { PageTitle } from '~/components';
import {
  BalanceTransfer,
  FabricMetrics,
  GoMetrics,
  LedgerMetrics,
  OrdererMetrics,
  ChaincodeMetrics
} from './components';
import { ConnectState } from '~/models/connect';

const { TabPane } = Tabs;

function DataDashboard() {
  return (
    <div className="page-wrapper">
      <PageTitle label="仪表盘" />
      <div className={cs(styles['data-dashboard'], 'page-content', 'page-content-shadow')}>
        <Tabs defaultActiveKey="FabricMetrics">
          <TabPane tab="超级账本" key="FabricMetrics">
            <FabricMetrics />
          </TabPane>
          <TabPane tab="账本" key="LedgerMetrics">
            <LedgerMetrics />
          </TabPane>
          <TabPane tab="交易" key="BalanceTransfer">
            <BalanceTransfer />
          </TabPane>
          <TabPane tab="链码" key="ChaincodeMetrics">
            <ChaincodeMetrics />
          </TabPane>
          <TabPane tab="排序节点" key="OrdererMetrics">
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


// function Dashboard() {
//   return (
//     <iframe
//       style={{
//         width: '100%',
//         height: '100%'
//       }}
//       src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s`}
//       title="Dashboard"
//       id="Dashboard"
//       frameBorder="0"></iframe>
//   );
// }
// export default Dashboard;
