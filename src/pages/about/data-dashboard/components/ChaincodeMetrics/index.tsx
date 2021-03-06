import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function ChaincodeMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 12]}>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=15`}
            title="Chaincode Shim Requests"
            id="Chaincode Shim Requests"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=16`}
            title="Broadcast Enqueue"
            id="Broadcast Enqueue"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <div className={styles['fabric-panel']}>
            <iframe
              src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=28`}
              title="gRPC Closed Connections"
              id="gRPC Closed Connections"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['fabric-panel']}>
            <iframe
              src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=14`}
              title="Chaincode Launch Duration"
              id="Chaincode Launch Duration"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
      </Row>
    </div>
  );
}
