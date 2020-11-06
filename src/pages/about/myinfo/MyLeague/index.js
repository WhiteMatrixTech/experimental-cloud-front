import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/myinfo', false)
breadCrumbItem.push({
  menuName: "我的联盟",
  menuHref: `/`,
})

function MyLeagueInfo({
  match: {
    params: { memberDetail: companyId },
  },
  MyInfo: { myLeague },
  qryLoading = false
}) {
  const dispatch = useDispatch();

  const myLeagueInfo = [
    {
      label: '联盟名称',
      value: myLeague.leagueName
    },
    {
      label: '创建时间',
      value: myLeague.createTime ? moment(myLeague.createTime).format('YYYY-MM-DD HH:mm:ss') : '- -'
    },
    {
      label: '联盟描述',
      fullRow: true,
      value: myLeague.leagueDesc
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
          <DetailCard cardTitle='联盟信息' detailList={myLeagueInfo} />
        </Spin>
      </div>
    </div >
  )
}

export default connect(({ MyInfo, loading }) => ({
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyLeagueInfo);
