import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import { TopHeader } from 'components';
import styles from './index.less';

class LeaguePageLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
      <Layout className="layout-style">
        <TopHeader />
        <Layout>
          <div className={styles.appLayout}>
            <div id="league-list-layout" className={styles.rightPart}>
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
}))(LeaguePageLayout);
