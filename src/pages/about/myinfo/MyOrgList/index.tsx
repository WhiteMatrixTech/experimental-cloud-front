import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { orgStatus } from '../../organizations/_config';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { DetailViewAttr } from '~/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: '组织信息',
  menuHref: `/`,
});
export interface MyOrgInfoProps {
  User: ConnectState['User'];
  dispatch: Dispatch;
  qryLoading: boolean;
  MyInfo: ConnectState['MyInfo'];
}
function MyOrgInfo(props: MyOrgInfoProps) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myOrgInfo },
  } = props;
  const { networkName } = User;

  const myOrgInfoList: DetailViewAttr[] = [
    {
      label: '组织名称',
      value: myOrgInfo && myOrgInfo.orgName,
    },
    {
      label: '组织别名',
      value: myOrgInfo && myOrgInfo.orgAliasName,
    },
    {
      label: '组织MSP',
      value: myOrgInfo && myOrgInfo.orgMspId,
    },
    {
      label: '组织地址',
      value: myOrgInfo && myOrgInfo.orgAddress,
    },
    {
      label: '组织状态',
      value: myOrgInfo && myOrgInfo.orgStatus ? orgStatus[myOrgInfo.orgStatus].text : '',
    },
    {
      label: '创建时间',
      value: myOrgInfo && myOrgInfo.createdAt ? moment(myOrgInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyOrgInfo',
      payload: { networkName },
    });
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="组织信息" detailList={myOrgInfoList} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }: ConnectState) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail'],
}))(MyOrgInfo);
