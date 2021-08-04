import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { DetailCard, PageTitle } from '~/components';
import { statusList } from '../../enterprise-member/_config';
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

  const companyBasicInfo: DetailViewAttr[] = [
    {
      label: '用户名称',
      value: myCompany && myCompany.companyName
    },
    {
      label: '当前审批状态',
      value: myCompany && statusList[myCompany.approvalStatus]
    }
  ];

  const companyContactsInfo: DetailViewAttr[] = [
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
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="基本信息" detailList={companyBasicInfo} />
          <DetailCard cardTitle="联系人信息" detailList={companyContactsInfo} />
        </Spin>
      </div>
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
