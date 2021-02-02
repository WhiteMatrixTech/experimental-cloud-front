import React, { useEffect } from 'react';
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

function MyLeagueInfo(props) {
  const {
    User,
    dispatch,
    qryLoading = false,
    MyInfo: { myLeague },
  } = props;
  const { networkName } = User;

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
      value: myLeague.description
    },
  ];

  // useEffect(() => {
  //   dispatch({
  //     type: 'MyInfo/getMyLeagueInfo',
  //     payload: { networkName }
  //   })
  // }, []);


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

export default connect(({ User, MyInfo, loading }) => ({
  User,
  MyInfo,
  qryLoading: loading.effects['MyInfo/getMyInfoDetail']
}))(MyLeagueInfo);
