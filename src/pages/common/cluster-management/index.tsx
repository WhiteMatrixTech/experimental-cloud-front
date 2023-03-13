import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, ClusterSchema } from 'umi';
import { PageTitle } from '~/components';
import { Table, Button, Space } from 'antd';
import { ConnectState } from '~/models/connect';
import CreateClusterModal from './components/CreateClusterModal';
import { ColumnsType } from 'antd/lib/table';

export interface ClusterManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  Cluster: ConnectState['Cluster'];
}

const ClusterManagement: React.FC<ClusterManagementProps> = (props) => {
  const { dispatch, Cluster, qryLoading = false } = props;
  const { clusterList, clusterTotal } = Cluster;
  const [pageNum, setPageNum] = useState(1);
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
    dispatch({
      type: 'Cluster/getClusterTotal',
      payload: {}
    });
  }, [dispatch, pageNum]);

  useEffect(() => {
    getClusterList();
  }, [getClusterList, pageNum]);

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const columns: ColumnsType<ClusterSchema> = [
    {
      title: '集群ID',
      dataIndex: 'clusterId',
      key: 'clusterId',
      ellipsis: true
    },
    {
      title: '集群名称',
      dataIndex: 'clusterName',
      key: 'clusterName',
      ellipsis: true
    },
    {
      title: '集群描述',
      dataIndex: 'clusterDesc',
      key: 'clusterDesc',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: '12%',
      render: (_: string, record: ClusterSchema) => (
        <Space size="small">
          <span role="button" className="table-action-span">
            解绑
          </span>
        </Space>
      )
    }
  ];

  const onClickCreateCluster = () => {
    setCreateClusterVisible(true);
  };

  const onCloseModal = () => {
    setCreateClusterVisible(false);
  };

  return (
    <div className="page-wrapper">
      <PageTitle
        label="集群管理"
        extra={
          <Button type="primary" onClick={onClickCreateCluster}>
            创建集群
          </Button>
        }
      />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="_id"
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
        <CreateClusterModal visible={createClusterVisible} getClusterList={getClusterList} onCancel={onCloseModal} />
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
