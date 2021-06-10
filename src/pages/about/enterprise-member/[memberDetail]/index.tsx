import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { statusList } from '../_config';
import { ConnectState } from '~/models/connect';
import { EnterpriseMemberSchema, Location } from 'umi';
import { DetailViewAttr } from '~/utils/types';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterprise-member');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_USER_DETAIL'),
  menuHref: `/`
});
export interface MemberDetailProps {
  qryLoading: boolean;
  location: Location<EnterpriseMemberSchema>;
}
function MemberDetail(props: MemberDetailProps) {
  const { qryLoading = false, location } = props;
  const basicInfo: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_USER_INFO_USER_NAME'),
      value: location?.state?.companyName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_LEGAL_NAME'),
      value: location?.state?.legalPersonName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CURRENT_APPROVAL_STATUS'),
      value: statusList[location?.state?.approvalStatus]
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_UNIFIED_CODE'),
      value: location?.state?.companyCertBusinessNumber
    }
  ];

  const contactsInfo: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_PERSON_NAME'),
      value: location?.state?.contactName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_PHONE'),
      value: location?.state?.contactPhone
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL'),
      value: location?.state?.contactEmail
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_ADDRESS'),
      value: location?.state?.companyAddress
    }
  ];

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle={Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')} detailList={basicInfo} />
          <DetailCard cardTitle={Intl.formatMessage('BASS_USER_INFO_CONTACT_INFORMATION')} detailList={contactsInfo} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, Member, loading }: ConnectState) => ({
  User,
  Member,
  qryLoading: loading.effects['Member/getMemberDetail']
}))(MemberDetail);
