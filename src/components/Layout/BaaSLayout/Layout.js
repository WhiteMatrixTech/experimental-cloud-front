import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import { LeftMenu, TopHeader } from 'components';
import styles from './Layout.less';

class BaaSLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, pathname } = this.props;
    return (
      <Layout className="layout-style">
        <TopHeader />
        <Layout>
          <div className={styles.appLayout}>
            <div className={styles.leftMenu}>
              <LeftMenu pathname={pathname} />
            </div>
            <div id="app-layout" className={styles.rightPart}>
              {children}
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ Layout }) => ({
  Layout,
}))(BaaSLayout);
