import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { chainCodeStatusInfo } from '../../contract/myContract/_config';
import baseConfig from '@/utils/config';
import { TableColumnsAttr } from '@/utils/types';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'umi';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看合约',
  menuHref: `/`,
});
export interface GetContractListOfChannelParams {
  networkName: string;
  offset: number;
  limit: number;
  from: number;
  ascend: boolean;
  channelId: string;
  orgName?: string;
}
export interface ChaincodeListProps {
  User: ConnectState['User'];
  location: Location;
  dispatch: Dispatch;
  qryLoading: boolean;
  Channel: ConnectState['Channel'];
}
function ChaincodeList(props: ChaincodeListProps) {
  const { User, location, dispatch, qryLoading } = props;
  const { networkName } = User;
  const { contractListOfChannel, contractTotalOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;
  const [pageNum, setPageNum] = useState(1);
  const pageSize = baseConfig.pageSize;
  const [chainCodeName, setChainCodeName] = useState('');

  const columns: TableColumnsAttr[] = [
    {
      title: '合约ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '创建组织',
      dataIndex: 'createOrgName',
      key: 'createOrgName',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '合约版本',
      dataIndex: 'chainCodeVersion',
      key: 'chainCodeVersion',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
    },
    {
      title: '状态',
      dataIndex: 'chainCodeStatus',
      key: 'chainCodeStatus',
      render: (text) =>
        text ? (
          <Badge
            color={chainCodeStatusInfo[text].color}
            text={chainCodeStatusInfo[text].text}
            style={{ color: chainCodeStatusInfo[text].color }}
          />
        ) : (
          <span className="a-forbidden-style">信息访问受限</span>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>,
    },
  ];
  const channelInfoList = [
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
    {
      label: '合约总数',
      value: contractTotalOfChannel,
    },
  ];
  useEffect(() => {
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params,
    });
    dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params,
    });
    dispatch({
      type: 'Channel/getContractTotalOfChannel',
      payload: params,
    });
    //TODO:没有传数据嗷~
    getContractListOfChannel();
  }, []);

  // 获取 通道下的合约
  const getContractListOfChannel = (current: number, chainCodeName: string) => {
    const offset = ((current || pageNum) - 1) * pageSize;
    const params: GetContractListOfChannelParams = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
      channelId: location?.state?.channelId,
    };
    if (chainCodeName) {
      params.orgName = chainCodeName;
    }
    props.dispatch({
      type: 'Channel/getContractListOfChannel',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
    //TODO:定义了两个参数但是你只传了一个参数
    getContractListOfChannel(pageInfo.current);
  };

  // 按 合约名 搜索
  const onSearch = (value: string, event: any) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setChainCodeName(value || '');
      getContractListOfChannel(1, value);
    }
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard
          cardTitle="基本信息"
          detailList={channelInfoList}
          boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
          columnsNum={2}
        />
        <div className="table-wrapper page-content-shadow">
          <SearchBar placeholder="输入合约名称" onSearch={onSearch} />
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={columns}
            dataSource={contractListOfChannel}
            onChange={onPageChange}
            pagination={{
              pageSize,
              total: contractTotalOfChannel,
              current: pageNum,
              position: ['bottomCenter'],
            }}
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
  qryLoading: loading.effects['Channel/getContractListOfChannel'],
}))(ChaincodeList);
