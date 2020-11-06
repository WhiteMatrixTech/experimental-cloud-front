import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Layout, Badge, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import classname from 'classnames';
import { MenuList } from 'utils/menu.js';
import styles from './index.less';

const { Header } = Layout;

class TopHeader extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getUserMenu = () => {
    return (<Menu theme="dark" onClick={this.handleUserMenuClick}>
      <Menu.Item key='loginOut'>
        退出账号
      </Menu.Item>
    </Menu>)
  }

  handleUserMenuClick = ({ key }) => {
    // 登出
    if (key === 'loginOut') {
      window.localStorage.clear();
      history.replace('/login');
    }
  }

  // 切换身份
  changeUserType = () => {
    const { userType } = this.props.Layout;
    // userType-- 2: 盟主; 3: 企业
    this.props.dispatch({
      type: 'Layout/getNewMenuList',
      payload: {
        userType: userType === 3 ? 2 : 3
      }
    })
  }

  // 查看消息
  onClickMessage = () => {
    const breadCrumbItem = MenuList.filter(item => item.menuHref.indexOf('/about/message') > -1);
    this.props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/message', breadCrumbItem }
    });
    const hashName = window.location.hash;
    if (hashName.indexOf('/about/message') === -1) {
      history.push('/about/message');
    }
  }

  render() {
    const { userType } = this.props.Layout;
    return (
      <Header className={styles.header}>
        <div className={styles['logo-sub']}>欢迎使用扬子江数字金融平台区块链BaaS服务</div>
        <div className={styles['header-right-info']}>
          {(userType === 3) && <div className={styles['header-menu-item']}>加入联盟</div>}
          <div className={classname(styles['header-menu-item'], { [styles.active]: true })} onClick={this.changeUserType}>{userType === 2 ? '切换至企业' : '切换至盟主'}</div>
          <Badge showZero count={100}>
            <div className={styles['header-menu-item']} style={{ paddingRight: '12px' }} onClick={this.onClickMessage}>消息</div>
          </Badge>
          <Dropdown placement="bottomCenter" overlay={this.getUserMenu()}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              yzjadmin <DownOutlined />
            </a>
          </Dropdown>
        </div >
      </Header >
    );
  }
}

export default connect(({ Layout }) => ({ Layout }))(TopHeader);
