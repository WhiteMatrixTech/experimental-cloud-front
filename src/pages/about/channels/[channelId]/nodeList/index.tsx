import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { peerStatus } from '../../../nodes/_config';
import baseConfig from '~/utils/config';
import { DetailViewAttr } from '~/utils/types';
import { ConnectState } from '~/models/connect';
import { ChannelSchema, Dispatch, Location } from 'umi';
import { ColumnsType } from 'antd/lib/table';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看节点',
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
  const [peerName, setPeerName] = useState('');
  const {
    qryLoading = false,
    location,
    match: {
      params: { channelId }
    }
  } = props;
  const { nodeListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;

  const columns: ColumnsType<any> = [
    {
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'peerName'
    },
    {
      title: '节点别名',
      dataIndex: 'nodeAliasName',
      key: 'peerAliasName'
    },
    {
      title: '节点全名',
      dataIndex: 'nodeFullName',
      key: 'nodeFullName'
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
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    }
  ];
  useEffect(() => {
    const { User, location } = props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId
    };
    props.dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params
    });
    getNodeListOfChannel();
  }, []);

  // 获取 通道下的节点
  const getNodeListOfChannel = () => {
    const { User, location } = props;
    const { networkName } = User;
    let params: { networkName: string; channelId?: string; orgName?: string } = {
      networkName,
      channelId
    };
    if (peerName) {
      params.orgName = peerName;
    }
    props.dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

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
      <div className="page-content">
        <DetailCard cardTitle="基本信息" detailList={channelInfoList} />
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          className="page-content-shadow table-wrapper"
          dataSource={nodeListOfChannel}
          onChange={onPageChange}
          pagination={{ pageSize, total: nodeTotalOfChannel, current: pageNum, position: ['bottomCenter'] }}
        />
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
