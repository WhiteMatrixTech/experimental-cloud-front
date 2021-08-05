import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Descriptions, Spin } from 'antd';
import moment from 'moment';
import { PageTitle } from '~/components';
import { orgStatus } from '../../organizations/_config';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { DetailViewAttr } from '~/utils/types';

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
      <PageTitle label="我的组织" />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <Descriptions title="组织信息" className="descriptions-wrapper">
            {myOrgInfoList.map(item =>
              <Descriptions.Item
                key={item.label}
                label={item.label}>
                {item.value}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </Spin>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }: ConnectState) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail'],
}))(MyOrgInfo);
