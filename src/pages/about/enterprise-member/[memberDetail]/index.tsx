import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { statusList } from '../_config';
import { ConnectState } from '@/models/connect';
import { EnterpriseMemberSchema, Location } from 'umi';
import { DetailViewAttr } from '@/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterprise-member');
breadCrumbItem.push({
  menuName: '用户详情',
  menuHref: `/`,
});
export interface MemberDetailProps {
  qryLoading: boolean;
  location: Location<EnterpriseMemberSchema>;
}
function MemberDetail(props: MemberDetailProps) {
  const { qryLoading = false, location } = props;
  const basicInfo: DetailViewAttr[] = [
    {
      label: '用户名称',
      value: location?.state?.companyName,
    },
    {
      label: '法人代表姓名',
      value: location?.state?.legalPersonName,
    },
    {
      label: '当前审批状态',
      value: statusList[location?.state?.approvalStatus],
    },
    {
      label: '统一社会信用代码',
      value: location?.state?.companyCertBusinessNumber,
    },
  ];

  const contactsInfo: DetailViewAttr[] = [
    {
      label: '联系人姓名',
      value: location?.state?.contactName,
    },
    {
      label: '联系人手机号',
      value: location?.state?.contactPhone,
    },
    {
      label: '联系人邮箱',
      value: location?.state?.contactEmail,
    },
    {
      label: '联系地址',
      value: location?.state?.companyAddress,
    },
  ];

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="基本信息" detailList={basicInfo} />
          <DetailCard cardTitle="联系人信息" detailList={contactsInfo} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, Member, loading }: ConnectState) => ({
  User,
  Member,
  qryLoading: loading.effects['Member/getMemberDetail'],
}))(MemberDetail);
