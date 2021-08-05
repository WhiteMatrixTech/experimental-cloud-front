import React from 'react';
import { connect } from 'dva';
import { Descriptions, Spin } from 'antd';
import { Breadcrumb, PageTitle } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { statusList } from '../_config';
import { ConnectState } from '~/models/connect';
import { EnterpriseMemberSchema, Location } from 'umi';
import { DetailViewAttr } from '~/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterprise-member');
breadCrumbItem.push({
  menuName: '成员详情',
  menuHref: `/`,
});
export interface MemberDetailProps {
  qryLoading: boolean;
  location: Location<EnterpriseMemberSchema>;
}
const MemberDetail: React.FC<MemberDetailProps> = (props) => {
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
      <PageTitle label="成员详情" />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <Descriptions title="基本信息" className="descriptions-wrapper">
            {basicInfo.map(item =>
              <Descriptions.Item
                key={item.label}
                label={item.label}>
                {item.value}
              </Descriptions.Item>
            )}
          </Descriptions>
          <Descriptions title="联系信息" className="descriptions-wrapper">
            {contactsInfo.map(item =>
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

export default connect(({ User, Member, loading }: ConnectState) => ({
  User,
  Member,
  qryLoading: loading.effects['Member/getMemberDetail'],
}))(MemberDetail);
