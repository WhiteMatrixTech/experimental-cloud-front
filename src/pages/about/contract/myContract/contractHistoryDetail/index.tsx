import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import baseConfig from '@/utils/config';
import { TableColumnsAttr, DetailViewAttr } from '@/utils/types';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'umi';

const pageSize = baseConfig.pageSize;
export interface ContractDetailProps {
  qryLoading: boolean;
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  dispatch: Dispatch;
  location: { query: { chainCodeName: string; channelName: string; version: string; chainCodeId: string } };
}
function ContractDetail(props: ContractDetailProps) {
  const [pageNum, setPageNum] = useState(1);
  //const [chainCodeName, setChainCodeName]=useState('');
  const {
    qryLoading = false,
    location: {
      query: { chainCodeName = '', channelName = '', version = '', chainCodeId },
    },
  } = props;
  const { curContractDetail, curContractVersionList, curContractVersionTotal } = props.Contract;

  let columns: TableColumnsAttr[] = [
    {
      title: '审批批次',
      dataIndex: 'batchNo',
      key: 'batchNo',
    },
    {
      title: '审批组织',
      dataIndex: 'approveOrgName',
      key: 'approveOrgName',
    },
    {
      title: '审批记录',
      dataIndex: 'isApprove',
      key: 'isApprove',
      render: (text) => {
        if (text === 1) {
          return '通过';
        } else if (text === 0) {
          return '驳回';
        } else {
          return '-';
        }
      },
    },
    {
      title: '审批时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  useEffect(() => {
    getChainCodeApprovalHistory();
  }, [pageNum]);

  // 获取合约列表
  const getChainCodeApprovalHistoryTotalDocs = () => {
    const params = {
      networkName: props.User.networkName,
    };
    props.dispatch({
      type: 'Contract/getChainCodeApprovalHistoryTotalDocs',
      payload: params,
    });
  };
  // 获取合约列表
  const getChainCodeApprovalHistory = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      networkName: props.User.networkName,
      limit: pageSize,
      ascend: false,
      from: Number(moment(new Date()).format('x')),
      chainCodeName,
      channelName,
      version,
    };
    props.dispatch({
      type: 'Contract/getChainCodeApprovalHistory',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const contractInfoList: DetailViewAttr[] = [
    {
      label: '合约名称',
      value: curContractDetail.chainCodeName,
    },
    {
      label: '所属通道',
      value: curContractDetail.channelName,
    },
    {
      label: '合约语言类型',
      value: curContractDetail.chainCodeLanguage,
    },
    {
      label: '当前版本',
      value: curContractDetail.version,
    },
    {
      label: '创建组织',
      value: curContractDetail.createOrgName,
    },
    {
      label: '创建时间',
      value: curContractDetail.createdAt ? moment(curContractDetail.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '背书组织',
      fullRow: true,
      value: JSON.stringify(curContractDetail.endorsementOrgName),
    },
    {
      label: '合约描述',
      fullRow: true,
      value: curContractDetail.chainCodeDesc,
    },
  ];
  let breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
  breadCrumbItem = breadCrumbItem.concat([
    {
      menuName: '我的合约',
      menuHref: `/about/contract/myContract`,
      isLeftMenu: true,
    },
    {
      menuName: '合约详情',
      menuHref: `/about/contract/myContract/contractDetail`,
      withQueryParams: true,
      query: { chainCodeId, chainCodeName, channelName },
    },
    {
      menuName: '合约审批历史',
      menuHref: `/`,
    },
  ]);
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
  qryLoading:
    loading.effects['Contract/getDetailOfChainCode'] || loading.effects['Contract/getChainCodeApprovalHistory'],
}))(ContractDetail);
