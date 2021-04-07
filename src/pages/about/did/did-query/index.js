import React from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'components';
import { Input, Result, Empty } from 'antd';
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
  const { dispatch } = props;
  const { networkName } = props.User;
  const onSearch = (value) => {
    dispatch({
      type: 'DID/getDetailByDid',
      payload: { networkName, did: value },
    });
  };

  return (
    <div className="page-wrapper" style={{ height: '100%' }}>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={classnames('page-content', 'page-content-shadow', styles['did-query-verify'])}>
        <h3>DID查询验证</h3>
        <Search placeholder="输入DID" allowClear enterButton="查询" size="large" onSearch={onSearch} />
        <Result
          icon={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          title="暂无结果!"
          subTitle="没有查询到相应的DID记录"
        />
      </div>
    </div>
  );
}

export default connect(({ User, DID, loading }) => ({
  User,
  DID,
  qryLoading: loading.effects['DID/getDetailByDid'],
}))(DidQueryVerify);
