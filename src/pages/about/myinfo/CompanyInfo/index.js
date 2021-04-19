import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { ApprovalStatus } from '../_config';
import { injectIntl } from 'umi';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: '企业信息',
  menuHref: `/`,
});

function MyCompanyInfo(props) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myCompany },
  } = props;
  const { networkName, userInfo } = User;

  const onClickCreate = async () => {
    // 创建did接口
    const res = await dispatch({
      type: 'DID/createDID',
      payload: { networkName },
    });
    if (res) {
      dispatch({
        type: 'User/getUserInfo',
        payload: {},
      });
    }
  };

  const getDid = useMemo(() => {
    return userInfo?.did;
  }, [userInfo]);

  const companyBasicInfo = [
    {
      label: '企业名称',
      value: myCompany.companyName,
    },
    {
      label: '当前审批状态',
      value: ApprovalStatus[myCompany.approvalStatus],
    },
    {
      label: '统一社会信用代码',
      value: myCompany.companyCertBusinessNumber,
    },
    {
      label: '我的DID',
      value: getDid || 'NeedButton',
      buttonName: '立即申请',
      onClick: onClickCreate,
    },
  ];
  const companyLegalInfo = [
    {
      label: '法人代表姓名',
      value: myCompany.legalPersonName,
    },
    {
      label: '法人代表身份证号',
      value: myCompany.legalPersonIdCardNumber,
    },
  ];
  const companyContactsInfo = [
    {
      label: '联系人姓名',
      value: myCompany.contactName,
    },
    {
      label: '联系人电话',
      value: myCompany.contactPhone,
    },
    {
      label: '联系人邮箱',
      value: myCompany.contactEmail,
    },
    {
      label: '联系地址',
      value: myCompany.companyAddress,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyCompanyInfo',
      payload: { networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="基本信息" detailList={companyBasicInfo} />
          <DetailCard cardTitle="法人信息" detailList={companyLegalInfo} />
          <DetailCard cardTitle="联系人信息" detailList={companyContactsInfo} />
        </Spin>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(({ User, MyInfo, DID, loading }) => ({
    User,
    DID,
    MyInfo,
    qryLoading: loading.effects['MyInfo/getMyInfoDetail'],
  }))(MyCompanyInfo),
);
