import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';

import styles from './index.less';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.onClickLogin = this.onClickLogin.bind(this)
  }

  onClickLogin() {
    localStorage.setItem('isLogin', true);
    history.push('/about/leagueDashboard');
    this.props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/leagueDashboard' }
    });
  }

  render() {
    return (
      <div className={styles.fileManageWrap}>
        <Row gutter={12}>
          <Col span={6}>
            <Button onClick={this.onClickLogin}>login in</Button>
          </Col>
          <Col span={18} className={styles.rightContent}>
            login out
          </Col>
        </Row>
      </div>
    );
  }
}
export default connect(({ Layout }) => ({ Layout }))(Login);
