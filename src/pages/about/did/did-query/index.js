import React from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'components';
import { Input } from 'antd';
import classnames from 'classnames';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const { Search } = Input;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  menuName: 'DID查询验证',
  menuHref: `/`,
});

function DidQueryVerify(props) {
  const onSearch = (value) => console.log(value);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className={classnames('page-content-shadow', styles['did-query-verify'])}>
          <h3>DID查询验证</h3>
          <Search placeholder="输入DID" allowClear enterButton="查询" size="large" onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
}

export default connect(({ User, Organization, Layout, FabricRole, loading }) => ({
  User,
  Organization,
  Layout,
  FabricRole,
  qryLoading: loading.effects['FabricRole/getFabricRoleList'],
}))(DidQueryVerify);
