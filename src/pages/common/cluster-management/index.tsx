import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, ClusterSchema } from 'umi';
import { PageTitle } from '~/components';
import { Table, Button, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ConnectState } from '~/models/connect';
import CreateClusterModal from './components/CreateClusterModal';
import { ColumnsType } from 'antd/lib/table';
import { KubeConfigDrawer } from './components/KubeConfigDrawer';

export interface ClusterManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  Cluster: ConnectState['Cluster'];
}

const ClusterManagement: React.FC<ClusterManagementProps> = (props) => {
  const { dispatch, Cluster, qryLoading = false } = props;
  const { clusterList, clusterTotal } = Cluster;
  const [pageNum, setPageNum] = useState(1);

  const [clusterRecord, setClusterRecord] = useState<ClusterSchema>();
  const [kubeConfigVisible, setKubeConfigVisible] = useState(false);
  const [createClusterVisible, setCreateClusterVisible] = useState(false);

  const getClusterList = useCallback(() => {
    const offset = (pageNum - 1) * 10;

    const params = {
      limit: 10,
      offset: offset,
      ascend: false
    };
    dispatch({
      type: 'Cluster/getClusterList',
      payload: params
    });
  }, [dispatch, pageNum]);

  useEffect(() => {
    getClusterList();
  }, [getClusterList, pageNum]);

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickKube = (record: ClusterSchema) => {
    setClusterRecord(record);
    setKubeConfigVisible(true);
  };

  const onCloseKubeDrawer = () => {
    setClusterRecord(undefined);
    setKubeConfigVisible(false);
  };

  const onClickCreateCluster = () => {
    setCreateClusterVisible(true);
  };

  const onClickModifyCluster = (record: ClusterSchema) => {
    setClusterRecord(record);
    setCreateClusterVisible(true);
  };

  const onCloseCreateClusterModal = () => {
    setClusterRecord(undefined);
    setCreateClusterVisible(false);
  };

  const onClickDelete = useCallback(
    (record: ClusterSchema) => {
      const callback = async () => {
        const res = await dispatch({
          type: 'Cluster/untieCluster',
          payload: { id: record.id }
        });
        if (res) {
          getClusterList();
        }
      };
      Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: `确认要解绑集群 【${record.name}】 吗?`,
        okText: '确认',
        cancelText: '取消',
        onOk: callback
      });
    },
    [dispatch, getClusterList]
  );

  const columns: ColumnsType<ClusterSchema> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '集群名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '集群描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: '12%',
      render: (_: string, record: ClusterSchema) => (
        <Space size="small">
          <span role="button" className="table-action-span" onClick={() => onClickKube(record)}>
            详情
          </span>
          <span role="button" className="table-action-span" onClick={() => onClickModifyCluster(record)}>
            配置
          </span>
          <span role="button" className="table-action-span" onClick={() => onClickDelete(record)}>
            解绑
          </span>
        </Space>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <PageTitle
        label="集群管理"
        extra={
          <Button type="primary" onClick={onClickCreateCluster}>
            添加集群
          </Button>
        }
      />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="id"
          loading={qryLoading}
          columns={columns}
          dataSource={clusterList}
          onChange={onPageChange}
          pagination={{
            total: clusterTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
            pageSize: 10
          }}
        />
      </div>
      {createClusterVisible && (
        <CreateClusterModal
          visible={createClusterVisible}
          getClusterList={getClusterList}
          clusterRecord={clusterRecord}
          onCancel={onCloseCreateClusterModal}
        />
      )}
      {kubeConfigVisible && (
        <KubeConfigDrawer visible={kubeConfigVisible} clusterRecord={clusterRecord} onClose={onCloseKubeDrawer} />
      )}
    </div>
  );
};

export default connect(({ User, Layout, Cluster, loading }: ConnectState) => ({
  User,
  Layout,
  Cluster,
  qryLoading: loading.effects['Cluster/getClusterList']
}))(ClusterManagement);
