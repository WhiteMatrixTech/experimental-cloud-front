import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { statusList } from '../_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterpriseMember');
breadCrumbItem.push({
  menuName: '成员企业详情',
  menuHref: `/`,
});

function MemberDetail(props) {
  const { qryLoading = false, location } = props;
  const basicInfo = [
    {
      label: '企业名称',
      value: location?.state?.companyName,
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

  const contactsInfo = [
    {
      label: '联系人姓名',
      value: location?.state?.contactName,
    },
    {
      label: '联系人手机号',
      value: location?.state?.contactCell,
    },
    {
      label: '联系人邮箱',
      value: location?.state?.contactEmail,
    },
  ];

  /* useEffect(() => {
    dispatch({
      type: 'Member/getMemberDetail',
      payload: { companyCertBusinessNumber, networkName },
    });
  }, []); */

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

export default connect(({ User, Member, loading }) => ({
  User,
  Member,
  qryLoading: loading.effects['Member/getMemberDetail'],
}))(MemberDetail);
