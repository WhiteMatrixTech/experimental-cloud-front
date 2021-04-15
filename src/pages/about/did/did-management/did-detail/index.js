import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  isLeftMenu: true,
  menuName: 'DID管理',
  menuHref: `/about/did/did-management`,
});
breadCrumbItem.push({
  menuName: 'DID详情',
  menuHref: `/`,
});

function DidDetail(props) {
  const { User, dispatch, qryLoading = false, location } = props;
  const { networkName } = User;

  const didDetailInfo = [
    {
      label: 'DID名称',
      value: location?.state?.didName,
    },
    {
      label: 'DID类型',
      value: location?.state?.didType,
    },
    {
      label: 'DID角色',
      value: location?.state?.role,
    },
    {
      label: '创建时间',
      value: location?.state?.createdAt ? moment(location?.state?.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '公司地址',
      value: location?.state?.companyAddress,
    },
    {
      label: '联系人',
      value: location?.state?.contactor,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'DID/getDidDetail',
      payload: { networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="DID详细信息" detailList={didDetailInfo} />
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, DID, loading }) => ({
  User,
  DID,
  qryLoading: loading.effects['DID/getDidDetail'],
}))(DidDetail);
