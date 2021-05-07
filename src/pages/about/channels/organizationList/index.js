import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu';
import AddOrg from '../components/AddOrg';
import { ChannelStatusMap } from '../_config';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看组织',
  menuHref: `/`,
});

const columns = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    key: 'orgName',
  },
  {
    title: '组织别名',
    dataIndex: 'orgAliasName',
    key: 'orgAliasName',
  },
  {
    title: '组织MSPID',
    dataIndex: 'orgMspId',
    key: 'orgMspId',
  },
  {
    title: '所属用户',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '组织地址',
    dataIndex: 'orgAddress',
    key: 'orgAddress',
  },
];

function OrganizationList(props) {
  const { qryLoading = false, location, dispatch } = props;
  const { userRole, networkName } = props.User;
  const { orgListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;

  const [pageNum, setPageNum] = useState(1);
  const [addOrgVisible, setAddOrgVisible] = useState(false);

  const channelInfoList = useMemo(() => {
    const list = [
      {
        label: '通道名称',
        value: location?.state?.channelId,
      },
      {
        label: '组织数量',
        value: orgTotalOfChannel,
      },
      {
        label: '节点总数',
        value: nodeTotalOfChannel,
      },
    ];
    if (userRole === Roles.NetworkAdmin) {
      list.slice(1, 0, {
        label: '所属联盟',
        value: location?.state?.leagueName,
      });
    }
    return list;
  }, [userRole, location?.state, orgTotalOfChannel, nodeTotalOfChannel]);

  // 获取 通道下的组织
  const getOrgListOfChannel = () => {
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const onCloseModal = () => {
    setAddOrgVisible(false);
    getOrgListOfChannel();
  };

  const onClickAddOrg = () => {
    setAddOrgVisible(true);
  };

  const showAddOrg = useMemo(() => {
    return userRole === Roles.NetworkAdmin && location?.state?.channelStatus === ChannelStatusMap.InUse;
  }, [userRole, location?.state?.channelStatus]);

  useEffect(() => {
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params,
    });
    getOrgListOfChannel();
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard cardTitle="基本信息" detailList={channelInfoList} boxShadow="0 4px 12px 0 rgba(0,0,0,.05)" />
        <div className="page-content page-content-shadow table-wrapper">
          {showAddOrg && (
            <div className="table-header-btn-wrapper">
              <Button type="primary" onClick={onClickAddOrg}>
                添加组织
              </Button>
            </div>
          )}
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={columns}
            dataSource={orgListOfChannel}
            onChange={onPageChange}
            pagination={{
              pageSize: baseConfig.pageSize,
              total: orgTotalOfChannel,
              current: pageNum,
              position: ['bottomCenter'],
            }}
          />
        </div>
      </div>
      {addOrgVisible && (
        <AddOrg visible={addOrgVisible} channelId={location?.state?.channelId} onCancel={onCloseModal} />
      )}
    </div>
  );
}

export default connect(({ Channel, Layout, User, loading }) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getOrgListOfChannel'],
}))(OrganizationList);
