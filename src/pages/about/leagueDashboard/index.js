import React, { Component } from 'react';
import { Row, Col } from 'antd';

import styles from './index.less';

class FileManagement extends Component {

  render() {
    return (
      <div className={styles.fileManageWrap}>
        <Row gutter={12}>
          <Col span={6}>
            1111
          </Col>
          <Col span={18} className={styles.rightContent}>
            2222
          </Col>
        </Row>
      </div>
    );
  }
}

export default FileManagement
