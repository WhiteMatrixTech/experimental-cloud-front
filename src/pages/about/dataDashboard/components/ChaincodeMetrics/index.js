import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function ChaincodeMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 12]}>
        <Col span={12}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=15"
            title="Chaincode Shim Requests"
            id="Chaincode Shim Requests"
            frameborder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=16"
            title="Broadcast Enqueue"
            id="Broadcast Enqueue"
            frameborder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <div className={styles['fabric-panel']}>
            <iframe
              src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=28"
              title="gRPC Closed Connections"
              id="gRPC Closed Connections"
              frameborder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['fabric-panel']}>
            <iframe
              src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=14"
              title="Chaincode Launch Duration"
              id="Chaincode Launch Duration"
              frameborder="0"
            ></iframe>
          </div>
        </Col>
      </Row>
    </div>
  );
}
