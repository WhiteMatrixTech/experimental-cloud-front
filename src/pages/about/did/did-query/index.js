import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'dva';
import { Breadcrumb, DetailCard } from 'components';
import { Input, Result, Empty } from 'antd';
import classnames from 'classnames';
import { isObject } from 'lodash';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const { Search } = Input;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  menuName: 'DID查询验证',
  menuHref: `/`,
});

function DidQueryVerify(props) {
  const { dispatch, DID, User } = props;
  const { didDetail } = DID;
  const { networkName } = User;

  const onSearch = (value) => {
    dispatch({
      type: 'DID/getDetailByDid',
      payload: { networkName, did: value },
    });
  };

  const didDetailInfo = useMemo(() => {
    return [
      {
        label: 'DID',
        value: didDetail?.did,
      },
      {
        label: 'DID名称',
        value: didDetail?.idName,
      },
      {
        label: 'DID类型',
        value: didDetail?.idType,
      },
      {
        label: 'DID角色',
        value: didDetail?.role,
      },
      {
        label: '附加信息',
        value: isObject(didDetail?.additionalAttributes)
          ? JSON.stringify(didDetail?.additionalAttributes)
          : didDetail?.additionalAttributes,
      },
    ];
  }, [didDetail]);

  return (
    <div className="page-wrapper" style={{ height: '100%' }}>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={classnames('page-content', 'page-content-shadow', styles['did-query-verify'])}>
        <h3>DID查询验证</h3>
        <Search placeholder="输入DID" allowClear enterButton="查询" size="large" onSearch={onSearch} />
        {didDetail?.did ? (
          <div className={styles['did-detail']}>
            <DetailCard textAlign="left" columnsNum={3} cardTitle="DID详细信息" detailList={didDetailInfo} />
          </div>
        ) : (
          <Result icon={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} subTitle="没有查询到相应的DID记录" />
        )}
      </div>
    </div>
  );
}

export default connect(({ User, DID, loading }) => ({
  User,
  DID,
  qryLoading: loading.effects['DID/getDetailByDid'],
}))(DidQueryVerify);
