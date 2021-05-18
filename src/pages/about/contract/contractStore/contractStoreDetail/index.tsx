import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Space, Button } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import FieldDesc from '../components/FieldDesc';
import DeployContract from '../components/DeployContract';
import baseConfig from '@/utils/config';
import { ConnectState } from '@/models/connect';
import { Dispatch, Location } from 'umi';
import { TableColumnsAttr, DetailViewAttr } from '@/utils/types';

let breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem = breadCrumbItem.concat([
  {
    menuName: '合约仓库',
    menuHref: `/about/contract/contractStore`,
    isLeftMenu: true,
  },
  {
    menuName: '合约仓库详情',
    menuHref: `/`,
  },
]);
const pageSize = baseConfig.pageSize;
export interface ContractStoreDetailProps {
  qryLoading: boolean;
  ContractStore: ConnectState['ContractStore'];
  User: ConnectState['User'];
  dispatch: Dispatch;
  //TODO:合约管理页面的item还没有具体的属性，so,传过来的只是object
  // location: Location<chainCodeName>;
  location: { query: { chainCodeName: string } };
}
function ContractStoreDetail(props: ContractStoreDetailProps) {
  const [pageNum, setPageNum] = useState(1);
  const [record, setRecord] = useState(null); //当前查看的表格记录
  const [fieldDescVisible, setFieldDescVisible] = useState(false); // 字段说明弹窗 是否可见
  const [deployContractVisible, setDeployContractVisible] = useState(false); //部署合约弹窗 是否可见
  const { curRepository, repositoryDetailList, repositoryDetailTotal } = props.ContractStore;
  const { qryLoading = false } = props;
  const {
    User,
    dispatch,
    location: {
      query: { chainCodeName = '' },
    },
  } = props;
  let columns: TableColumnsAttr[] = [
    {
      title: '方法名',
      dataIndex: 'chainCodeMethodName',
      key: 'chainCodeMethodName',
    },
    {
      title: '调用类型',
      dataIndex: 'chainCodeMethodType',
      key: 'chainCodeMethodType',
      render: (text) => (text === 1 ? 'invoke' : 'query'),
    },
    {
      title: '参数',
      dataIndex: 'chainCodeMethodArgs',
      key: 'chainCodeMethodArgs',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'chainCodeMethodDesc',
      key: 'chainCodeMethodDesc',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => onClickDetail(record)}>查看字段说明</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getStoreSupplyListOfChainCode();
  }, [pageNum]);

  // 获取合约列表
  const getStoreSupplyListOfChainCode = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      chainCodeName,
      networkName: User.networkName,
    };
    dispatch({
      type: 'ContractStore/getStoreSupplyListOfChainCode',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 查看字段说明
  const onClickDetail = (record: any) => {
    setRecord(record);
    setFieldDescVisible(true);
  };

  // 关闭字段说明弹窗
  const onCloseFieldDescModal = () => {
    setRecord(null);
    setFieldDescVisible(false);
  };

  // 点击部署合约
  const onClickDeploy = () => {
    setDeployContractVisible(true);
  };

  // 关闭 部署合约 弹窗
  const onCloseDeployModal = () => {
    setDeployContractVisible(false);
  };

  //TODO: models中你是这样定义的，curRepository: object,
  //TODO:so,这个对象上暂时没有这些属性
  const contractInfoList: DetailViewAttr[] = [
    {
      label: '合约名称',
      value: curRepository.chainCodeName,
    },
    {
      label: '合约版本',
      value: curRepository.chainCodeVersion,
    },
    {
      label: '编写语言',
      value: curRepository.compileLanguage,
    },
    {
      label: '创建时间',
      value: curRepository.createdAt ? moment(curRepository.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '最近更新时间',
      value: curRepository.updatedAt ? moment(curRepository.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '合约描述',
      fullRow: true,
      value: curRepository.chainCodeDesc,
    },
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard
          cardTitle="合约信息"
          detailList={contractInfoList}
          columnsNum={3}
          boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
        />
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickDeploy}>
            部署合约
          </Button>
        </div>
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          className="page-content-shadow"
          dataSource={repositoryDetailList}
          onChange={onPageChange}
          pagination={{ pageSize, total: repositoryDetailTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {fieldDescVisible && <FieldDesc visible={fieldDescVisible} record={record} onCancel={onCloseFieldDescModal} />}
      {deployContractVisible && (
        <DeployContract visible={DeployContract} record={curRepository} onCancel={onCloseDeployModal} />
      )}
    </div>
  );
}

export default connect(({ User, ContractStore, loading }: ConnectState) => ({
  User,
  ContractStore,
  qryLoading: loading.effects['ContractStore/getStoreSupplyListOfChainCode'],
}))(ContractStoreDetail);
