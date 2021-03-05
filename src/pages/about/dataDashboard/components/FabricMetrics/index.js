import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function FabricMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 12]}>
        <Col span={4}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=2"
            id="Fabric Version"
            title="Fabric Version"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={4}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=11"
            id="Go Version"
            title="Go Version"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={4}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=36"
            id="Ledger Block Height"
            title="Ledger Block Height"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={4}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=37"
            id="Ledger Transaction Count"
            title="Ledger Transaction Count"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={4}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=19"
            id="Endorsement Proposal Requests"
            title="Endorsement Proposal Requests"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={4}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=10"
            id="Endorsement Proposal Successful"
            title="Endorsement Proposal Successful"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={24}>
          <iframe
            src="http://52.80.73.208:9000/d-solo/ashcreated/fabric-baas-backend-dashboard?orgId=1&refresh=5s&theme=light&panelId=32"
            id="Couch DB Processing Time"
            title="Couch DB Processing Time"
            frameBorder="0"
          ></iframe>
        </Col>
      </Row>
    </div>
  );
}