import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

/**
 * @详细信息卡片
 */
export default function DetailCard({ cardTitle, detailList }) {

  return (
    <Fragment>
      <div className={styles['detail-card-wrapper']}>
        <div className={styles['detail-card-title']}>
          <span className={styles['detail-title-border']}></span>
          <span className={styles['detail-title-content']}>{cardTitle}</span>
        </div>
        <div className={styles['detail-info-wrapper']}>
          <Row>
            {detailList.map(item =>
              <Col key={item.label} span={item.fullRow ? 24 : 12} className={styles['detail-info-item']}>
                <label style={{ width: item.fullRow ? '15%' : '30%' }}>{item.label}</label>
                <div style={{ width: item.fullRow ? '85%' : '70%' }}>{item.value}</div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </Fragment>
  )
}
