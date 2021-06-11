import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function FabricMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 12]}>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=2`}
            id="Fabric Version"
            title="Fabric Version"
            frameBorder="0"></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=11`}
            id="Go Version"
            title="Go Version"
            frameBorder="0"></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=36`}
            id="Ledger Block Height"
            title="Ledger Block Height"
            frameBorder="0"></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=37`}
            id="Ledger Transaction Count"
            title="Ledger Transaction Count"
            frameBorder="0"></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=19`}
            id="Endorsement Proposal Requests"
            title="Endorsement Proposal Requests"
            frameBorder="0"></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=10`}
            id="Endorsement Proposal Successful"
            title="Endorsement Proposal Successful"
            frameBorder="0"></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=54`}
            id="Average Block Time"
            title="Average Block Time"
            frameBorder="0"></iframe>
        </Col>
      </Row>
    </div>
  );
}
