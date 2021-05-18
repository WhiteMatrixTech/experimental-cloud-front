import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { Table, Space, Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import baseConfig from '@/utils/config';
import { TableColumnsAttr, DetailViewAttr } from '@/utils/types';
import { ConnectState } from '@/models/connect';

let breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem = breadCrumbItem.concat([
  {
    menuName: '合约列表',
    menuHref: `/about/contract/myContract`,
    isLeftMenu: true,
  },
  {
    menuName: '合约详情',
    menuHref: `/`,
  },
]);
const pageSize = baseConfig.pageSize;
export interface ContractDetailProps {
  qryLoading: boolean;
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  dispatch: Dispatch;
  location: {
    query: { chainCodeName: string; channelName: string; version: string; chainCodeId: string };
    [propName: string]: any;
  };
}
function ContractDetail(props: ContractDetailProps) {
  const [pageNum, setPageNum] = useState(1);
  //const [chainCodeName, setChainCodeName] = useState('');
  const { networkName } = props.User;
  const { curContractVersionList, curContractVersionTotal } = props.Contract;
  const chaincodeInfo = props.location?.state;
  const { qryLoading = false } = props;
  const {
    location: {
      query: { chainCodeName = '', channelName = '', chainCodeId },
    },
  } = props;
  const columns: TableColumnsAttr[] = [
    {
      title: '合约版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '创建组织',
      dataIndex: 'createOrgName',
      key: 'createOrgName',
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
      width: '18%',
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => onClickDetail(record)}>详情</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    props.dispatch({
      type: 'Contract/getDetailOfChainCode',
      payload: { chainCodeId, networkName },
    });
    getChainCodeHistory();
    getChainCodeHistoryTotalDocs();
  }, [pageNum]);

  // 获取合约列表的totalCount
  const getChainCodeHistoryTotalDocs = () => {
    const params = {
      networkName,
    };
    props.dispatch({
      type: 'Contract/getChainCodeHistoryTotalDocs',
      payload: params,
    });
  };
  // 获取合约列表
  const getChainCodeHistory = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      ascend: false,
      from: Number(moment(new Date()).format('x')),
      chainCodeName,
      networkName,
      channelName,
    };
    props.dispatch({
      type: 'Contract/getChainCodeHistory',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 查看合约详情
  const onClickDetail = (record: any) => {
    history.push({
      pathname: `/about/contract/myContract/contractHistoryDetail`,
      query: {
        version: record.version,
        chainCodeId: record._id,
        chainCodeName: record.chainCodeName,
        channelName: record.channelName,
      },
    });
  };

  const contractInfoList: DetailViewAttr[] = [
    {
      label: '合约名称',
      value: chaincodeInfo.chainCodeName,
    },
    {
      label: '所属通道',
      value: chaincodeInfo.channelId,
    },
    {
      label: '合约语言类型',
      value: chaincodeInfo.chainCodePackageMetaData ? chaincodeInfo.chainCodePackageMetaData.language : '',
    },
    {
      label: '当前版本',
      value: chaincodeInfo.chainCodeVersion,
    },
    {
      label: '创建组织',
      value: chaincodeInfo.createOrgName,
    },
    {
      label: '创建时间',
      value: chaincodeInfo.createdAt ? moment(chaincodeInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '背书组织',
      fullRow: true,
      value: chaincodeInfo.endorsementPolicy ? JSON.stringify(chaincodeInfo.endorsementPolicy.orgsToApprove) : '',
    },
    {
      label: '合约描述',
      fullRow: true,
      value: chaincodeInfo.description,
    },
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <DetailCard
            cardTitle="合约信息"
            detailList={contractInfoList}
            columnsNum={3}
            boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
          />
          <Table
            rowKey="id"
            columns={columns}
            className="page-content-shadow"
            dataSource={curContractVersionList}
            onChange={onPageChange}
            pagination={{ pageSize, total: curContractVersionTotal, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
      </Spin>
    </div>
  );
}

export default connect(({ User, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/getDetailOfChainCode'] || loading.effects['Contract/getChainCodeHistory'],
}))(ContractDetail);
