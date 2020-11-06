import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false)
breadCrumbItem.push({
  menuName: "组织信息",
  menuHref: `/`,
})

function MyOrgInfo({
  match: {
    params: { memberDetail: companyId },
  },
  MyInfo: { myOrgInfo },
  qryLoading = false
}) {
  const dispatch = useDispatch();

  const myOrgInfoList = [
    {
      label: '组织名称',
      value: myOrgInfo.orgName
    },
    {
      label: '组织别名',
      value: myOrgInfo.orgAliasName
    },
    {
      label: '组织MSP',
      value: myOrgInfo.orgMspId
    },
    {
      label: '组织地址',
      value: myOrgInfo.orgAddress
    },
    {
      label: '组织状态',
      value: myOrgInfo.orgStatus
    },
    {
      label: '创建时间',
      value: myOrgInfo.createTime ? moment(myOrgInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'
    },
  ]

  useEffect(() => {
    dispatch({
      type: 'MyInfo/getMyInfoDetail',
      payload: { companyId }
    })
  }, []);


  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle='组织信息' detailList={myOrgInfoList} />
        </Spin>
      </div>
    </div >
  )
}

export default connect(({ MyInfo, loading }) => ({
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyOrgInfo);
