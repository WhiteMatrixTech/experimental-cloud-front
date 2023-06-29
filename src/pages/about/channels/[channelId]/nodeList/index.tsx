import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Table, Badge, Descriptions, Divider } from 'antd';
import { Breadcrumb, PageTitle, PlaceHolder } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { peerStatus } from '../../../nodes/_config';
import baseConfig from '~/utils/config';
import { DetailViewAttr } from '~/utils/types';
import { ConnectState } from '~/models/connect';
import { ChannelSchema, Dispatch, Location } from 'umi';
import { ColumnsType } from 'antd/lib/table';
import { renderDateWithDefault } from '~/utils/date';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '通道中节点数据',
  menuHref: `/`
});
export interface NodeListProps {
  dispatch: Dispatch;
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  location: Location<ChannelSchema>;
  qryLoading: boolean;
  match: { params: { channelId: string } };
}
const pageSize = baseConfig.pageSize;
function NodeList(props: NodeListProps) {
  const [pageNum, setPageNum] = useState(1);
  const {
    dispatch,
    qryLoading = false,
    match: {
      params: { channelId }
    }
  } = props;
  const { networkName } = props.User;
  const { nodeListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;

  const columns: ColumnsType<any> = [
    {
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
      render: (text: string) => text.split('-')[1]
    },
    {
      title: '节点别名',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <PlaceHolder text={text} />
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      key: 'orgName'
    },
    {
      title: '状态',
      dataIndex: 'nodeStatus',
      key: 'nodeStatus',
      render: (text) =>
        text ? (
          <Badge
            color={peerStatus[text].color}
            text={peerStatus[text].text}
            style={{ color: peerStatus[text].color }}
          />
        ) : (
          ''
        )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => {
        return renderDateWithDefault(record.createdAt || record.updatedAt);
      }
    }
  ];

  // 获取 通道下的节点
  const getNodeListOfChannel = useCallback(() => {
    let params: { networkName: string; channelId?: string; orgName?: string } = {
      networkName,
      channelId
    };
    dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params
    });
  }, [channelId, dispatch, networkName]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  useEffect(() => {
    const params = {
      networkName,
      channelName: channelId
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params
    });
    getNodeListOfChannel();
  }, [channelId, dispatch, getNodeListOfChannel, networkName]);

  const channelInfoList: DetailViewAttr[] = [
    {
      label: '通道名称',
      value: channelId
    },
    {
      label: '组织数量',
      value: orgTotalOfChannel
    },
    {
      label: '节点总数',
      value: nodeTotalOfChannel
    }
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="通道中节点数据" />
      <div className="page-content">
        <Descriptions title="通道信息" className="descriptions-wrapper">
          {channelInfoList.map((item) => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <div className="table-wrapper page-content-shadow">
          <div className="table-header-title">节点列表</div>
          <Divider />
          <Table
            rowKey="nodeName"
            loading={qryLoading}
            columns={columns}
            dataSource={nodeListOfChannel}
            onChange={onPageChange}
            pagination={{ pageSize, total: nodeTotalOfChannel, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(({ Channel, Layout, User, loading }: ConnectState) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getNodeListOfChannel']
}))(NodeList);
