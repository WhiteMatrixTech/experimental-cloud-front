import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { orgStatus } from '../../organizations/_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: '组织信息',
  menuHref: `/`,
});

function MyOrgInfo(props) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myOrgInfo },
  } = props;
  const { networkName } = User;

  const myOrgInfoList = [
    {
      label: '组织名称',
      value: myOrgInfo.orgName,
    },
    {
      label: '组织别名',
      value: myOrgInfo.orgAliasName,
    },
    {
      label: '组织MSP',
      value: myOrgInfo.orgMspId,
    },
    {
      label: '组织地址',
      value: myOrgInfo.orgAddress,
    },
    {
      label: '组织状态',
      value: myOrgInfo.orgStatus ? orgStatus[myOrgInfo.orgStatus].text : '',
    },
    {
      label: '创建时间',
      value: myOrgInfo.createdAt ? moment(myOrgInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyOrgInfo',
      payload: { networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="组织信息" detailList={myOrgInfoList} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, MyInfo, loading }) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail'],
}))(MyOrgInfo);
