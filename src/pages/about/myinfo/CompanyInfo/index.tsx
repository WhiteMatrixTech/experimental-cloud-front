import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Descriptions, Spin } from 'antd';
import { PageTitle } from '~/components';
import { statusList } from '../../member/_config';
import { injectIntl, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';

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
      value: myCompany && myCompany.companyName
    },
    {
      label: '当前审批状态',
      value: myCompany && statusList[myCompany.approvalStatus]
    }
  ];

  const contactsInfo: DetailViewAttr[] = [
    {
      label: '联系人姓名',
      value: myCompany && myCompany.contactName
    },
    {
      label: '联系人电话',
      value: myCompany && myCompany.contactPhone
    },
    {
      label: '联系人邮箱',
      value: myCompany && myCompany.contactEmail
    },
    {
      label: '联系地址',
      value: myCompany && myCompany.companyAddress
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
          <Descriptions title="联系信息" className="descriptions-wrapper">
            {contactsInfo.map((item) => (
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
