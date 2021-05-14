import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, history } from 'umi';
import { Table, Button, Badge, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb } from '@/components';
import CreateChannelModal from './components/CreateChannelModal';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import baseConfig from '@/utils/config';
import { Roles } from '@/utils/roles';
import { ChannelStatus } from './_config';
import { ConnectState } from '@/models/connect';
import { TableColumnsAttr, } from '@/utils/types';
import { ChannelSchema} from '@/models/channel';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');

export interface ChannelManagementProps {
  dispatch: Dispatch;
  location: Location;
  qryLoading: boolean;
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
}
function ChannelManagement(props: ChannelManagementProps) {
  const { dispatch, location, qryLoading = false, User, Channel } = props;
  const { networkName, userRole } = User;
  const { channelList, channelTotal } = Channel;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [createChannelVisible, setCreateChannelVisible] = useState(false);

  // 获取通道列表
  const getChannelList = (current: number) => {
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      networkName,
      ascend: false,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
    };
    dispatch({
      type: 'Channel/getChannelList',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
    getChannelList(pageInfo.current);
  };

  // 点击 创建通道
  const onClickCreateChannel = () => {
    setCreateChannelVisible(true);
  };

  // 关闭 创建通道弹窗
  const onCloseCreateChannel = (res: any) => {
    setCreateChannelVisible(false);
    if (res) {
      //TODO:没有传参数
      getChannelList();
    }
  };

  // 点击 查看组织
  const onViewOrg = (record: ChannelSchema) => {
    history.push({
      pathname: `/about/channels/organizationList`,
      state: { ...record },
    });
  };

  // 点击 查看节点
  const onViewPeer = (record: ChannelSchema) => {
    history.push({
      pathname: `/about/channels/nodeList`,
      state: { ...record },
    });
  };

  // 点击 查看合约
  const onViewContract = (record: ChannelSchema) => {
    history.push({
      pathname: `/about/channels/chaincodeList`,
      state: { ...record },
    });
  };

  // 点击 查看详情
  const onViewDetail = (record: ChannelSchema) => {
    history.push({
      pathname: `/about/channels/channelDetail`,
      state: { ...record },
    });
  };

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = (record: ChannelSchema, type: any) => {
    let tipTitle = '';
    let callback = () => { };
    switch (type) {
      case 'enable':
        tipTitle = '启用';
        callback = () => false;
        break;
      case 'stop':
        tipTitle = '停用';
        callback = () => false;
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      //TODO:model上的ChannelSchema上没有channelName这个属性
      content: `确认要${tipTitle}通道 【${record.channelName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  const columns: TableColumnsAttr[] = [
    {
      title: '通道名称',
      dataIndex: 'channelId',
      key: 'channelId',
    },
    {
      title: '通道别名',
      dataIndex: 'channelAliasName',
      key: 'channelAliasName',
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
        ),
    },
    {
      title: '通道描述',
      dataIndex: 'channelDesc',
      key: 'channelDesc',
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'createUser',
      key: 'createUser',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: '22%',
      render: (text, record: ChannelSchema) => (
        <Space size="small">
          <a onClick={() => onViewOrg(record)}>查看组织</a>
          <a onClick={() => onViewPeer(record)}>查看节点</a>
          <a onClick={() => onViewContract(record)}>查看合约</a>
          <a onClick={() => onViewDetail(record)}>详情</a>
        </Space>
      ),
    },
  ]
  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    //TODO:没有传参
    getChannelList();
  }, [pageNum]);

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
            position: ['bottomCenter'],
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
  qryLoading: loading.effects['Channel/getChannelList'],
}))(ChannelManagement);
