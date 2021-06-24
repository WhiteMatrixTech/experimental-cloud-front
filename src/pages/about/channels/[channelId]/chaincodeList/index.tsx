import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { chainCodeStatusInfo } from '../../../contract/_config';
import baseConfig from '~/utils/config';
import { DetailViewAttr } from '~/utils/types';
import { ConnectState } from '~/models/connect';
import { ChannelSchema, Dispatch, Location } from 'umi';
import { BasicApiParams, AllPaginationParams } from '~/utils/types';
import { ColumnsType } from 'antd/lib/table';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看合约',
  menuHref: `/`
});
export interface ChaincodeListProps {
  User: ConnectState['User'];
  dispatch: Dispatch;
  qryLoading: boolean;
  location: Location<ChannelSchema>;
  Channel: ConnectState['Channel'];
  match: { params: { channelId: string } };
}
const pageSize = baseConfig.pageSize;
function ChaincodeList(props: ChaincodeListProps) {
  const {
    User,
    dispatch,
    qryLoading,
    match: {
      params: { channelId }
    }
  } = props;
  const { networkName } = User;
  const { contractListOfChannel, contractTotalOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;
  const [pageNum, setPageNum] = useState(1);
  const columns: ColumnsType<any> = [
    {
      title: '合约ID',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '创建组织',
      dataIndex: 'createOrgName',
      key: 'createOrgName',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
    },
    {
      title: '合约版本',
      dataIndex: 'chainCodeVersion',
      key: 'chainCodeVersion',
      render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>
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
        )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>
    }
  ];
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
    },
    {
      label: '合约总数',
      value: contractTotalOfChannel
    }
  ];
  useEffect(() => {
    const params = {
      networkName,
      channelId
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params
    });
    dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params
    });
    dispatch({
      type: 'Channel/getContractTotalOfChannel',
      payload: params
    });
  }, [channelId, dispatch, networkName]);

  // 获取 通道下的合约
  const getContractListOfChannel = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params: BasicApiParams & AllPaginationParams = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
      channelId
    };
    dispatch({
      type: 'Channel/getContractListOfChannel',
      payload: params
    });
  }, [channelId, dispatch, networkName, pageNum]);

  useEffect(() => {
    getContractListOfChannel();
  }, [getContractListOfChannel, pageNum]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
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
              position: ['bottomCenter']
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
  qryLoading: loading.effects['Channel/getContractListOfChannel']
}))(ChaincodeList);
