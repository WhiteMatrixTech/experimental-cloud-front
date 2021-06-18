import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, history, Location } from 'umi';
import { Table, Button, Badge, Space } from 'antd';
import { Breadcrumb } from '~/components';
import CreateChannelModal from './components/CreateChannelModal';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { ChannelStatus } from './_config';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { ChannelSchema } from '~/models/channel';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');

export interface ChannelManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  location: Location<ChannelSchema>;
}
function ChannelManagement(props: ChannelManagementProps) {
  const { dispatch, qryLoading = false, location, User, Channel } = props;
  const { networkName, userRole } = User;
  const { channelList, channelTotal } = Channel;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [createChannelVisible, setCreateChannelVisible] = useState(false);

  // 获取通道列表
  const getChannelList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      networkName,
      ascend: false,
      limit: pageSize,
      from: Number(moment(new Date()).format('x'))
    };
    dispatch({
      type: 'Channel/getChannelList',
      payload: params
    });
  }, [dispatch, networkName, pageNum, pageSize]);

  // 页码改变重新查询列表
  useEffect(() => {
    getChannelList();
  }, [getChannelList, pageNum]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 点击 创建通道
  const onClickCreateChannel = () => {
    setCreateChannelVisible(true);
  };

  // 关闭 创建通道弹窗
  const onCloseCreateChannel = (res: any) => {
    setCreateChannelVisible(false);
    if (res) {
      getChannelList();
    }
  };

  // 点击 查看组织
  const onViewOrg = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.channelId}/organizationList`,
      state: { ...record }
    });
  };

  // 点击 查看节点
  const onViewPeer = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.channelId}/nodeList`,
      state: { ...record }
    });
  };

  // 点击 查看合约
  const onViewContract = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.channelId}/chaincodeList`,
      state: { ...record }
    });
  };

  // 点击 查看详情
  const onViewDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.channelId}/channelDetail`,
      state: { ...record }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '通道名称',
      dataIndex: 'channelId',
      key: 'channelId'
    },
    {
      title: '通道别名',
      dataIndex: 'channelAliasName',
      key: 'channelAliasName'
    },
    {
      title: '通道状态',
      dataIndex: 'channelStatus',
      key: 'channelStatus',
      render: (text) =>
        text ? (
          <Badge
            color={ChannelStatus[text].color}
            text={ChannelStatus[text].text}
            style={{ color: ChannelStatus[text].color }}
          />
        ) : (
          ''
        )
    },
    {
      title: '通道描述',
      dataIndex: 'channelDesc',
      key: 'channelDesc',
      ellipsis: true
    },
    {
      title: '创建者',
      dataIndex: 'createUser',
      key: 'createUser'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: '22%',
      render: (text, record: ChannelSchema) => (
        <Space size="small">
          <a href={`/about/channels/${record.channelId}/organizationList`} onClick={(e) => onViewOrg(e, record)}>
            查看组织
          </a>
          <a href={`/about/channels/${record.channelId}/nodeList`} onClick={(e) => onViewPeer(e, record)}>
            查看节点
          </a>
          <a href={`/about/channels/${record.channelId}/chaincodeList`} onClick={(e) => onViewContract(e, record)}>
            查看合约
          </a>
          <a href={`/about/channels/${record.channelId}/channelDetail`} onClick={(e) => onViewDetail(e, record)}>
            详情
          </a>
        </Space>
      )
    }
  ];

  useEffect(() => {
    if (location?.state?.openModal) {
      setTimeout(() => setCreateChannelVisible(true), 1000);
    }
  }, [location?.state?.openModal]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        {userRole === Roles.NetworkAdmin && (
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={onClickCreateChannel}>
              创建通道
            </Button>
          </div>
        )}
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          dataSource={channelList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            total: channelTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter']
          }}
        />
      </div>
      {createChannelVisible && <CreateChannelModal visible={createChannelVisible} onCancel={onCloseCreateChannel} />}
    </div>
  );
}

export default connect(({ User, Layout, Channel, loading }: ConnectState) => ({
  User,
  Layout,
  Channel,
  qryLoading: loading.effects['Channel/getChannelList']
}))(ChannelManagement);
