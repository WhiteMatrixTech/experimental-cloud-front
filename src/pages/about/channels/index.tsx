import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, history, Location } from 'umi';
import { Table, Button, Badge, Space } from 'antd';
import CreateChannelModal from './components/CreateChannelModal';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { canUpdateChannelStatusList, ChannelStatusTag } from './_config';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { ChannelSchema } from '~/models/channel';
import { PageTitle, PlaceHolder } from '~/components';
import { renderDateWithDefault } from '~/utils/date';
import UpdateChannel from './components/UpdateChannel';
export interface ChannelManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  location: Location<ChannelSchema & { openModal: boolean }>;
}
function ChannelManagement(props: ChannelManagementProps) {
  const { dispatch, qryLoading = false, location, User, Channel } = props;
  const { networkName, userRole } = User;
  const { channelList, channelTotal } = Channel;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [createChannelVisible, setCreateChannelVisible] = useState(false);
  const [updateChannelRecord, setUpdateChannelRecord] = useState<ChannelSchema | null>(null);
  const updateChannelVisible = useMemo(() => !!updateChannelRecord, [updateChannelRecord]);

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
      pathname: `/about/channels/${record.name}/organizationList`,
      state: { ...record }
    });
  };

  // 点击 查看节点
  const onViewPeer = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.name}/nodeList`,
      state: { ...record }
    });
  };

  // 点击 查看合约
  const onViewContract = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.name}/chaincodeList`,
      state: { ...record }
    });
  };

  // 点击 查看详情
  const onViewDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChannelSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/channels/${record.name}/channelDetail`,
      state: { ...record }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '通道名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '通道别名',
      dataIndex: 'alias',
      key: 'alias',
      render: (text) => <PlaceHolder text={text} />
    },
    {
      title: '通道状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) =>
        text ? (
          <Badge
            color={ChannelStatusTag[text].color}
            text={ChannelStatusTag[text].text}
            style={{ color: ChannelStatusTag[text].color }}
          />
        ) : (
          ''
        )
    },
    {
      title: '通道描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => <PlaceHolder text={text} />
    },
    {
      title: '创建者',
      dataIndex: 'creatorEmail',
      key: 'creatorEmail',
      render: (text) => <PlaceHolder text={text} />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: renderDateWithDefault
    },
    {
      title: '操作',
      key: 'action',
      width: '22%',
      render: (text, record: ChannelSchema) => (
        <Space size="small">
          {canUpdateChannelStatusList.includes(record.status as any) && (
            <span
              className="action-link"
              onClick={() => {
                setUpdateChannelRecord(record);
              }}>
              背书策略配置
            </span>
          )}
          <a href={`/about/channels/${record.name}/organizationList`} onClick={(e) => onViewOrg(e, record)}>
            查看组织
          </a>
          <a href={`/about/channels/${record.name}/nodeList`} onClick={(e) => onViewPeer(e, record)}>
            查看节点
          </a>
          <a href={`/about/channels/${record.name}/chaincodeList`} onClick={(e) => onViewContract(e, record)}>
            查看合约
          </a>
          <a href={`/about/channels/${record.name}/channelDetail`} onClick={(e) => onViewDetail(e, record)}>
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
      <PageTitle
        label="通道管理"
        extra={
          userRole === Roles.ADMIN ? (
            <Button type="primary" onClick={onClickCreateChannel}>
              创建通道
            </Button>
          ) : null
        }
      />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="name"
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
      {updateChannelVisible && (
        <UpdateChannel
          visible={updateChannelVisible}
          onCancel={(isUpdateSuccess: boolean) => {
            setUpdateChannelRecord(null);
            if (isUpdateSuccess) {
              getChannelList();
            }
          }}
          record={updateChannelRecord}
        />
      )}
    </div>
  );
}

export default connect(({ User, Layout, Channel, loading }: ConnectState) => ({
  User,
  Layout,
  Channel,
  qryLoading: loading.effects['Channel/getChannelList']
}))(ChannelManagement);
