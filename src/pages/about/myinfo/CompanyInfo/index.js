import React, { useEffect } from 'react';
import { connect } from "dva";
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { ApprovalStatus } from '../_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false)
breadCrumbItem.push({
  menuName: "企业信息",
  menuHref: `/`,
})

function MyCompanyInfo(props) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myCompany },
  } = props;
  const { networkName } = User;

  const companyBasicInfo = [
    {
      label: '企业名称',
      value: myCompany.companyName
    },
    {
      label: '当前审批状态',
      value: ApprovalStatus[myCompany.approvalStatus]
    },
    {
      label: '统一社会信用代码',
      value: myCompany.companyCertBusinessNumber
    },
    {
      label: '办公地址',
      value: myCompany.companyAddress
    }
  ];
  const companyLegalInfo = [
    {
      label: '法人代表姓名',
      value: myCompany.legalPersonName
    },
    {
      label: '法人代表身份证号',
      value: myCompany.legalPersonIdCardNumber
    },
  ];
  const companyContactsInfo = [
    {
      label: '联系人姓名',
      value: myCompany.contactName
    },
    {
      label: '联系人电话',
      value: myCompany.contactPhone
    },
    {
      label: '联系人邮箱',
      value: myCompany.contactEmail
    },
    {
      label: '备注',
      fullRow: true,
      value: myCompany.companyDesc
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyCompanyInfo',
      payload: { networkName }
    })
  }, []);


  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle='基本信息' detailList={companyBasicInfo} />
          <DetailCard cardTitle='法人信息' detailList={companyLegalInfo} />
          <DetailCard cardTitle='联系人信息' detailList={companyContactsInfo} />
        </Spin>
      </div>
    </div >
  )
}

export default connect(({ User, MyInfo, loading }) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyCompanyInfo);
