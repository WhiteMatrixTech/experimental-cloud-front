import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin, message } from 'antd';
import { Dispatch, history } from 'umi';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { statusList } from '../../enterprise-member/_config';
import { injectIntl } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: '我的信息',
  menuHref: `/`
});
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
  const { networkName, userInfo } = User;

  const onClickCreate = async () => {
    // 申请DID之前，公司在网络下必须拥有自己的组织
    const orgInUse = await dispatch({
      type: 'MyInfo/checkOrgInUse',
      payload: { networkName }
    });
    if (!orgInUse) {
      message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
      return;
    }
    // 创建did接口
    const res = await dispatch({
      type: 'DID/createDID',
      payload: { networkName }
    });
    if (res) {
      // 清空缓存
      window.localStorage.clear();
      // 跳转至登录界面
      history.replace('/user/login');
    }
  };

  const getDid = useMemo(() => {
    return userInfo?.did;
  }, [userInfo]);

  const companyBasicInfo: DetailViewAttr[] = [
    {
      label: '用户名称',
      value: myCompany && myCompany.companyName
    },
    {
      label: '当前审批状态',
      value: myCompany && statusList[myCompany.approvalStatus]
    },
    {
      label: '我的DID',
      value: getDid || ''
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
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
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
