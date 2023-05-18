import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Descriptions, Spin } from 'antd';
import { PageTitle } from '~/components';
import { statusList } from '../../member/_config';
import { injectIntl, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';
import moment from 'moment';

export interface MyCompanyInfoProps {
  User: ConnectState['User'];
  dispatch: Dispatch;
  qryLoading: boolean;
  MyInfo: ConnectState['MyInfo'];
}
function MyCompanyInfo(props: MyCompanyInfoProps) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myCompany }
  } = props;
  const { networkName } = User;

  const basicInfo: DetailViewAttr[] = [
    {
      label: '用户名称',
      value: myCompany && myCompany.userInfo.name
    },
    {
      label: '当前审批状态',
      value: myCompany && statusList[myCompany.approvalStatus]
    },
    {
      label: '创建时间',
      value: myCompany && moment(myCompany.userInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
    }
  ];

  const detailInfo: DetailViewAttr[] = [
    {
      label: '邮箱',
      value: myCompany && myCompany.userInfo.email
    },
    {
      label: '电话',
      value: myCompany && myCompany.userInfo.phoneNo
    },
    {
      label: '企业名',
      value: myCompany && myCompany.userInfo.enterpriseName
    },
    {
      label: '企业统一社会信用代码',
      value: myCompany && myCompany.userInfo.enterpriseUsci
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyCompanyInfo',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <PageTitle label="我的信息" />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <Descriptions title="基本信息" className="descriptions-wrapper">
            {basicInfo.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
          <Descriptions title="详细信息" className="descriptions-wrapper">
            {detailInfo.map((item) => (
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

export default injectIntl(
  connect(({ User, MyInfo, DID, loading }: ConnectState) => ({
    User,
    DID,
    MyInfo,
    qryLoading: loading.effects['MyInfo/getMyInfoDetail']
  }))(MyCompanyInfo)
);
