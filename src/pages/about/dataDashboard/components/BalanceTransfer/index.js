import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function BalanceTransfer() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=40`}
            title="Ledger Height Per Channel"
            id="Ledger Height Per Channel"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=12`}
            title="Live Monitored Nodes"
            id="Live Monitored Nodes"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <div className={styles['col-span-12']}>
            <iframe
              src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=20`}
              title="Block Processing Time"
              id="Block Processing Time"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['col-span-12']}>
            <iframe
              src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=light&panelId=50`}
              title="Amount of Business Transactions per Channel"
              id="Amount of Business Transactions per Channel"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
      </Row>
    </div>
  );
}
