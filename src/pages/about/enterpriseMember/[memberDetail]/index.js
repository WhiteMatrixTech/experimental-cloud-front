import React, { useEffect } from 'react';
import { connect } from "dva";
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { statusList } from '../_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterpriseMember')
breadCrumbItem.push({
  menuName: "成员企业详情",
  menuHref: `/`,
})

function MemberDetail({
  match: {
    params: { memberDetail: companyId },
  },
  User,
  Member: { memberDetail },
  qryLoading = false,
  dispatch
}) {
  const { networkName } = User;
  const basicInfo = [
    {
      label: '企业名称',
      value: memberDetail.companyName
    },
    {
      label: '当前审批状态',
      value: statusList[memberDetail.approvalStatus]
    },
    {
      label: '统一社会信用代码',
      value: memberDetail.companyCertBusinessNumber
    },
    {
      label: '办公地址',
      value: memberDetail.companyAddress
    }
  ]

  const contactsInfo = [
    {
      label: '联系人姓名',
      value: memberDetail.contactName
    },
    {
      label: '联系人手机号',
      value: memberDetail.contactCell
    },
    {
      label: '联系人电话',
      value: memberDetail.contactPhone
    },
    {
      label: '联系人邮箱',
      value: memberDetail.contactEmail
    },
    {
      label: '备注',
      fullRow: true,
      value: memberDetail.companyDesc
    },
  ]

  useEffect(() => {
    dispatch({
      type: 'Member/getMemberDetail',
      payload: { companyId,networkName }
    })
  }, []);


  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle='基本信息' detailList={basicInfo} />
          <DetailCard cardTitle='联系人信息' detailList={contactsInfo} />
        </Spin>
      </div>
    </div >
  )
}

export default connect(({User, Member, loading }) => ({
  User,
  Member,
  qryLoading: loading.effects['Member/getMemberDetail']
}))(MemberDetail);
