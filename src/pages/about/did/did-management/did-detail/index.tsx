import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { isObject } from 'lodash';
import { Breadcrumb, DetailCard } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { ConnectState } from '@/models/connect';
import { DidSchema, Dispatch, Location } from 'umi';
import { DetailViewAttr } from '@/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  isLeftMenu: true,
  menuName: 'DID管理',
  menuHref: `/about/did/did-management`,
});
breadCrumbItem.push({
  menuName: 'DID详情',
  menuHref: `/`,
});
export interface DidDetailProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  User: ConnectState['User'];
  DID: ConnectState['DID'];
  location: Location<DidSchema>;
}
function DidDetail(props: DidDetailProps) {
  const { dispatch, qryLoading = false, location, DID, User } = props;
  const { didDetail } = DID;
  const { networkName } = User;

  const didDetailInfo: DetailViewAttr[] = [
    {
      label: 'DID',
      value: didDetail?.did || location?.state?.did,
    },
    {
      label: 'DID名称',
      value: didDetail?.idName || location?.state?.idName,
    },
    {
      label: 'DID类型',
      value: didDetail?.idType || location?.state?.idType,
    },
    {
      label: 'DID角色',
      value: didDetail?.role || location?.state?.role,
    },
    {
      label: '附加信息',
      showJson: isObject(didDetail?.additionalAttributes) ? true : false,
      value: didDetail?.additionalAttributes,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'DID/getDetailByDid',
      payload: { networkName, did: location?.state?.did },
    });
    return () => {
      dispatch({
        type: 'DID/common',
        payload: { didDetail: null },
      });
    };
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="DID详细信息" detailList={didDetailInfo} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, DID, loading }: ConnectState) => ({
  User,
  DID,
  qryLoading: loading.effects['DID/getDetailByDid'],
}))(DidDetail);
