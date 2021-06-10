import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { statusList } from '../../enterprise-member/_config';
import { injectIntl, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false);
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_USER_INFO_MY_INFORMATION'),
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

  // const onClickCreate = async () => {
  //   // 申请DID之前，公司在网络下必须拥有自己的组织
  //   const orgInUse = await dispatch({
  //     type: 'MyInfo/checkOrgInUse',
  //     payload: { networkName }
  //   });
  //   if (!orgInUse) {
  //     message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
  //     return;
  //   }
  //   // 创建did接口
  //   const res = await dispatch({
  //     type: 'DID/createDID',
  //     payload: { networkName }
  //   });
  //   if (res) {
  //     // 清空缓存
  //     window.localStorage.clear();
  //     // 跳转至登录界面
  //     history.replace('/user/login');
  //   }
  // };

  const getDid = useMemo(() => {
    return userInfo?.did;
  }, [userInfo]);

  const companyBasicInfo: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_USER_INFO_USER_NAME'),
      value: myCompany && myCompany.companyName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CURRENT_APPROVAL_STATUS'),
      value: myCompany && statusList[myCompany.approvalStatus]
    },
    // {
    //   label: Intl.formatMessage('BASS_USER_INFO_MY_DID'),
    //   value: getDid || ''
    // }
  ];

  const companyContactsInfo: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_PERSON_NAME'),
      value: myCompany && myCompany.contactName
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_PHONE'),
      value: myCompany && myCompany.contactPhone
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL'),
      value: myCompany && myCompany.contactEmail
    },
    {
      label: Intl.formatMessage('BASS_USER_INFO_CONTACT_ADDRESS'),
      value: myCompany && myCompany.companyAddress
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyCompanyInfo',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle={Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')} detailList={companyBasicInfo} />
          <DetailCard
            cardTitle={Intl.formatMessage('BASS_USER_INFO_CONTACT_INFORMATION')}
            detailList={companyContactsInfo}
          />
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
