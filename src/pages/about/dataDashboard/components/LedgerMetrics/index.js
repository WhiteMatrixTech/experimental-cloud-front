import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default function LedgerMetrics() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=34`}
            title="Ledger Block Processing Time"
            id="Ledger Block Processing Time"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={12}>
          <iframe
            src={`${process.env.FABRIC_BAAS_DASHBOARD}?orgId=1&refresh=5s&theme=dark&panelId=35`}
            title="StateDB Commit Time"
            id="StateDB Commit Time"
            frameBorder="0"
          ></iframe>
        </Col>
      </Row>
    </div>
  );
}
