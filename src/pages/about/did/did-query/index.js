import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'dva';
import { Breadcrumb, DetailCard } from 'components';
import { Input, Result, Empty } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
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
  const { didList, didDetail } = DID;
  const { networkName } = User;

  const [searchedDid, setSearchedDid] = useState(null);

  const onSearch = (value) => {
    dispatch({
      type: 'DID/getDetailByDid',
      payload: { networkName, did: value },
    });
    const didInfo = didList.find((item) => item.did === value);
    if (didInfo) {
      setSearchedDid(didInfo);
    }
  };

  useEffect(() => {
    dispatch({
      type: 'DID/getDidList',
      payload: { paginator: 1, networkName },
    });
  }, []);

  const didDetailInfo = useMemo(() => {
    return [
      {
        label: 'DID',
        value: searchedDid?.did,
      },
      {
        label: 'DID名称',
        value: searchedDid?.idName,
      },
      {
        label: 'DID类型',
        value: searchedDid?.idType,
      },
      {
        label: 'DID角色',
        value: searchedDid?.role,
      },
      {
        label: '公司地址',
        value: searchedDid?.companyAddress,
      },
      {
        label: '联系人',
        value: searchedDid?.contactor,
      },
      {
        label: '附加信息',
        value: searchedDid?.additionalAttributes,
        fullRow: true,
      },
    ];
  }, [searchedDid]);

  return (
    <div className="page-wrapper" style={{ height: '100%' }}>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={classnames('page-content', 'page-content-shadow', styles['did-query-verify'])}>
        <h3>DID查询验证</h3>
        <Search placeholder="输入DID" allowClear enterButton="查询" size="large" onSearch={onSearch} />
        {searchedDid ? (
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
