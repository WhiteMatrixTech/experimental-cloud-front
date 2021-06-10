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
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_ORGANIZATION_INFORMATION'),
  menuHref: `/`
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
    MyInfo: { myOrgInfo }
  } = props;
  const { networkName } = User;

  const myOrgInfoList: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_ORGANIZATION_NAME'),
      value: myOrgInfo && myOrgInfo.orgName
    },
    {
      label: Intl.formatMessage('BASS_ORGANIZATION_ALIAS'),
      value: myOrgInfo && myOrgInfo.orgAliasName
    },
    {
      label: Intl.formatMessage('BASS_ORGANIZATION_MSP'),
      value: myOrgInfo && myOrgInfo.orgMspId
    },
    {
      label: Intl.formatMessage('BASS_ORGANIZATION_ADDRESS'),
      value: myOrgInfo && myOrgInfo.orgAddress
    },
    {
      label: Intl.formatMessage('BASS_ORGANIZATION_STATUS'),
      value: myOrgInfo && myOrgInfo.orgStatus ? orgStatus[myOrgInfo.orgStatus].text : ''
    },
    {
      label: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      value: myOrgInfo && myOrgInfo.createdAt ? moment(myOrgInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -'
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyOrgInfo',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle={Intl.formatMessage('BASS_ORGANIZATION_INFORMATION')} detailList={myOrgInfoList} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }: ConnectState) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyOrgInfo);
