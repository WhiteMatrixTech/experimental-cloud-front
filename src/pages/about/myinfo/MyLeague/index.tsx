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

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: '我的联盟',
  menuHref: `/`,
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
    MyInfo: { myLeague },
  } = props;
  const { networkName } = User;

  const myLeagueInfo: DetailViewAttr[] = [
    {
      label: '联盟名称',
      value: myLeague && myLeague.leagueName,
    },
    {
      label: '盟主名称',
      value: myLeague && myLeague.leaderCompanyName,
    },
    {
      label: '网络名称',
      value: myLeague && myLeague.networkName,
    },
    {
      label: '网络状态',
      value: myLeague && myLeague.networkStatus ? NetworkInfo[myLeague.networkStatus] : '',
    },
    {
      label: '创建时间',
      value: myLeague && myLeague.createdTime ? moment(myLeague.createdTime).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '联盟描述',
      value: myLeague && myLeague.description,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyLeagueInfo',
      payload: { networkName },
    });
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="联盟信息" detailList={myLeagueInfo} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }: ConnectState) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail'],
}))(MyLeagueInfo);
