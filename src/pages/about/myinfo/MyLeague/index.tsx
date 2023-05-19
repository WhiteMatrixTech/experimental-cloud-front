import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Descriptions } from 'antd';
import { PageTitle } from '~/components';
import { NetworkInfo } from '~/utils/networkStatus';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { DetailViewAttr } from '~/utils/types';
import { renderDateWithDefault } from '~/utils/date';

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
      label: '联盟名称',
      value: myLeague && myLeague.leagueName
    },
    {
      label: '盟主名称',
      value: myLeague && myLeague.leaderName
    },
    {
      label: '网络名称',
      value: myLeague && myLeague.networkName
    },
    {
      label: '网络状态',
      value: myLeague && myLeague.networkStatus ? NetworkInfo[myLeague.networkStatus] : ''
    },
    {
      label: '创建时间',
      value: renderDateWithDefault(myLeague?.createTime)
    },
    {
      label: '联盟描述',
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
      <PageTitle label="我的联盟" />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <Descriptions title="联盟信息" className="descriptions-wrapper">
            {myLeagueInfo.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </Spin>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }: ConnectState) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyLeagueInfo);
