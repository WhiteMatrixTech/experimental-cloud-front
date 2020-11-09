import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

/**
 * @详细信息卡片
 * @param {String} cardTitle 信息卡片标题
 * @param {Array} detailList 信息卡片展示的栏目列表
 * @param {Number} columnsNum 每一行栏目数
 * @param {String} boxShadow 卡片阴影
 */
export default function DetailCard({ cardTitle, detailList, columnsNum = 2, boxShadow = '0 4px 12px 0 rgba(0,0,0,.05)' }) {

  return (
    <Fragment>
      <div className={styles['detail-card-wrapper']} style={{ boxShadow }}>
        <div className={styles['detail-card-title']}>
          <span className={styles['detail-title-border']}></span>
          <span className={styles['detail-title-content']}>{cardTitle}</span>
        </div>
        <div className={styles['detail-info-wrapper']}>
          {columnsNum === 2 ?
            <Row>
              {detailList.map(item =>
                <Col key={item.label} span={item.fullRow ? 24 : 12} className={styles['detail-info-item']}>
                  <label style={{ width: item.fullRow ? '15%' : '30%' }}>{item.label}</label>
                  <div style={{ width: item.fullRow ? '85%' : '70%' }}>{item.value}</div>
                </Col>
              )}
            </Row>
            :
            <Row>
              {detailList.map(item =>
                <Col key={item.label} span={item.fullRow ? 24 : 8} className={styles['detail-info-item']}>
                  <label style={{ width: item.fullRow ? '10%' : '30%' }}>{item.label}</label>
                  <div style={{ width: item.fullRow ? '90%' : '70%' }}>{item.value}</div>
                </Col>
              )}
            </Row>
          }
        </div>
      </div>
    </Fragment>
  )
}
