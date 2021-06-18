import React, { useMemo } from 'react';
import { connect } from 'dva';
import { Breadcrumb, DetailCard } from '~/components';
import { Input, Result, Empty } from 'antd';
import classnames from 'classnames';
import { isObject } from 'lodash';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';

const { Search } = Input;

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  menuName: 'DID查询验证',
  menuHref: `/`,
});
export interface DidQueryVerifyProps {
  dispatch: Dispatch;
  DID: ConnectState['DID'];
  User: ConnectState['User'];
}
function DidQueryVerify(props: DidQueryVerifyProps) {
  const { dispatch, DID, User } = props;
  const { didDetail } = DID;
  const { networkName } = User;

  const onSearch = (value: string) => {
    dispatch({
      type: 'DID/getDetailByDid',
      payload: { networkName, did: value },
    });
  };

  const didDetailInfo: DetailViewAttr[] = useMemo(() => {
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
        showJson: isObject(didDetail?.additionalAttributes) ? true : false,
        value: didDetail?.additionalAttributes,
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
            <DetailCard cardTitle="DID详细信息" detailList={didDetailInfo} />
          </div>
        ) : (
          <Result icon={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} subTitle="没有查询到相应的DID记录" />
        )}
      </div>
    </div>
  );
}

export default connect(({ User, DID, loading }: ConnectState) => ({
  User,
  DID,
  qryLoading: loading.effects['DID/getDetailByDid'],
}))(DidQueryVerify);
