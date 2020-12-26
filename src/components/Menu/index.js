import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import isEmpty from 'lodash/isEmpty';
import { MenuList } from 'utils/menu.js';
const { SubMenu } = Menu;

class LeftMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // 加载页面时，默认展示第一个菜单
    if (this.props.pathname.indexOf('/about/leagueDashboard') === -1) {
      history.push('/about/leagueDashboard');
    }
  }

  hashChange = menu => {
    this.props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: menu.menuHref }
    });
    if (this.props.pathname !== menu.menuHref) {
      history.push(menu.menuHref);
    }
  }

  getMenuItem = item => {
    const { userType } = this.props.Layout;
    if (item.isFeature && userType === 3) {
      return ''
    }
    if (isEmpty(item.menuVos)) {
      return (
        <Menu.Item key={item.menuHref} onClick={() => this.hashChange(item)}>
          <i className={`icon-menu-width KBass ${item.menuIcon}`}></i>
          <span>{item.menuName}</span>
        </Menu.Item>
      )
    } else {
      return (
        <SubMenu key={item.menuHref} title={<div className={styles.menuTtile}>
          <i className={`icon-menu-width KBass ${item.menuIcon}`}></i>
          <span>{item.menuName}</span>
        </div>}
        >
          {item.menuVos.map(subItem => (
            <Menu.Item key={subItem.menuHref} onClick={() => this.hashChange(subItem)}>
              <span style={{ paddingLeft: '8px' }}>{subItem.menuName}</span>
            </Menu.Item>
          ))}
        </SubMenu>
      )
    }
  }

  render() {
    const { selectedMenu } = this.props.Layout;
    return <div className={styles.leftMenu} >
      <Menu
        defaultSelectedKeys={[this.props.pathname]}
        selectedKeys={[selectedMenu]}
        mode="inline"
        theme="dark"
        defaultOpenKeys={[]}
      >
        {MenuList.map(item => this.getMenuItem(item))}
      </Menu>
    </div>
  }
}

export default connect(({ Layout }) => ({ Layout }))(LeftMenu);