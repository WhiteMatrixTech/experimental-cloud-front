import React, { useEffect, useState, useCallback } from 'react';
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
import { Intl } from '~/utils/locales';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_CHANNEL_VIEW_NODE'),
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
    qryLoading = false,
    match: {
      params: { channelId }
    }
  } = props;
  const { nodeListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;

  const columns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_NODE_NAME'),
      dataIndex: 'nodeName',
      key: 'peerName'
    },
    {
      title: Intl.formatMessage('BASS_NODE_ALIAS'),
      dataIndex: 'nodeAliasName',
      key: 'peerAliasName'
    },
    {
      title: Intl.formatMessage('BASS_NODE_FULL_NAME_OF_NODE'),
      dataIndex: 'nodeFullName',
      key: 'nodeFullName'
    },
    {
      title: Intl.formatMessage('BASS_COMMON_ORGANIZATION'),
      dataIndex: 'orgName',
      key: 'orgName'
    },
    {
      title: Intl.formatMessage('BASS_COMMON_STATUS'),
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
      title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    }
  ];

  // 获取 通道下的节点
  const getNodeListOfChannel = useCallback(() => {
    const { User } = props;
    const { networkName } = User;
    let params: { networkName: string; channelId?: string; orgName?: string } = {
      networkName,
      channelId
    };
    props.dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params
    });
  }, [channelId, props]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  useEffect(() => {
    const { User } = props;
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
  }, [channelId, getNodeListOfChannel, props]);

  const channelInfoList: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_CHANNEL_NAME'),
      value: channelId
    },
    {
      label: Intl.formatMessage('BASS_CHANNEL_NUMBER_OF_ORGANIZATION'),
      value: orgTotalOfChannel
    },
    {
      label: Intl.formatMessage('BASS_CHANNEL_TOTAL_NUMBER_OF_NODES'),
      value: nodeTotalOfChannel
    }
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard cardTitle={Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')} detailList={channelInfoList} />
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
