import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { NetworkInfo } from '~/utils/networkStatus';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { DetailViewAttr } from '~/utils/types';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_CONTRACT_MY_CONSORTIUM'),
  menuHref: `/`
});
export interface MyLeagueInfoProps {
  User: ConnectState['User'];
  dispatch: Dispatch;
  qryLoading: boolean;
  MyInfo: ConnectState['MyInfo'];
}
function MyLeagueInfo(props: MyLeagueInfoProps) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myLeague }
  } = props;
  const { networkName } = User;

  const myLeagueInfo: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_CONSORTIUM_NAME'),
      value: myLeague && myLeague.leagueName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONSORTIUM_MASTER_NAME'),
      value: myLeague && myLeague.leaderCompanyName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_NETWORK_NAME'),
      value: myLeague && myLeague.networkName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_NETWORK_STATUS'),
      value: myLeague && myLeague.networkStatus ? NetworkInfo[myLeague.networkStatus] : ''
    },
    {
      label: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      value: myLeague && myLeague.createdTime ? moment(myLeague.createdTime).format('YYYY-MM-DD HH:mm:ss') : '- -'
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONSORTIUM_DESCRIPTION'),
      value: myLeague && myLeague.description
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyLeagueInfo',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard
            cardTitle={Intl.formatMessage('BASS_USER_INFO_CONSORTIUM_INFORMATION')}
            detailList={myLeagueInfo}
          />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }: ConnectState) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyLeagueInfo);
