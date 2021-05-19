import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Modal } from 'antd';
import baseConfig from '@/utils/config';
import { ConnectState } from '@/models/connect';
import { ChainCodeSchema, Dispatch } from 'umi';

export interface FieldDescProps {
  visible: boolean;
  record: ChainCodeSchema;
  onCancel: () => void;
  dispatch: Dispatch;
  qryLoading: boolean;
  ContractStore: ConnectState['ContractStore'];
}
function FieldDesc(props: FieldDescProps) {
  const { visible, record = {}, onCancel, dispatch, qryLoading = false, ContractStore } = props;
  const { fieldDescList, fieldDescTotal } = ContractStore;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '查看字段说明',
    onCancel: onCancel,
    footer: null,
  };
  const columns = [
    {
      title: '字段',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
    },
    {
      title: '字段说明',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      ellipsis: true,
    },
  ];

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  useEffect(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      id: record._id,
    };
    dispatch({
      type: 'ContractStore/getStoreSupplyExplainListOfChainCode',
      payload: params,
    });
  }, [pageNum]);

  return (
    <Modal {...drawerProps}>
      <Table
        rowKey="_id"
        loading={qryLoading}
        columns={columns}
        className="page-content-shadow"
        dataSource={fieldDescList}
        onChange={onPageChange}
        pagination={{ pageSize, total: fieldDescTotal, current: pageNum, position: ['bottomCenter'] }}
      />
    </Modal>
  );
}

export default connect(({ ContractStore, loading }: ConnectState) => ({
  ContractStore,
  qryLoading: loading.effects['ContractStore/getStoreSupplyExplainListOfChainCode'],
}))(FieldDesc);
