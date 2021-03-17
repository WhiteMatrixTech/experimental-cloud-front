import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { history } from 'umi';
import { Breadcrumb } from 'components';
import { Table, Button, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import CreateServerModal from './components/CreateServerModal';
import baseConfig from 'utils/config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/elastic-cloud-server');

function ServersManagement(props) {
  const { dispatch, qryLoading = false } = props;
  const { serverList, serverTotal } = props.ElasticServer;
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [createServerVisible, setCreateServerVisible] = useState(false);
  const [serverRecord, setServerRecord] = useState(null);

  // 获取服务器列表
  const getServerList = () => {
    const offset = (pageNum - 1) * baseConfig.pageSize;

    const params = {
      limit: baseConfig.pageSize,
      offset: offset,
      ascend: false,
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params,
    });
    dispatch({
      type: 'ElasticServer/getServerTotal',
      payload: {},
    });
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const onClickDelete = (record) => {
    const callback = async () => {
      const res = await dispatch({
        type: 'ElasticServer/deleteServer',
        payload: { serverName: record.serverName },
      });
      if (res) {
        getServerList();
      }
    };
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除服务器 【${record.serverName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  const onClickModifyServer = (record) => {
    setServerRecord(record);
    setCreateServerVisible(true);
  };

  const onViewPerformance = (record) => {
    history.push({
      pathname: `/about/elastic-cloud-server/server-performance`,
      state: { ...record },
    });
  };

  const onViewNode = (record) => {
    history.push({
      pathname: `/about/elastic-cloud-server/resource-usage`,
      state: { ...record },
    });
  };

  const onClickCreateServer = () => {
    setServerRecord(null);
    setCreateServerVisible(true);
  };

  const onCloseModal = () => {
    setServerRecord(null);
    setCreateServerVisible(false);
  };

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '服务器名称',
        dataIndex: 'serverName',
        key: 'serverName',
        ellipsis: true,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
      },
      {
        title: '用途类型',
        dataIndex: 'serverPurpose',
        key: 'serverPurpose',
        ellipsis: true,
      },
      {
        title: '外网IP',
        dataIndex: 'publicIp',
        key: 'publicIp',
        ellipsis: true,
      },
      {
        title: '内网IP',
        dataIndex: 'privateIp',
        key: 'privateIp',
        ellipsis: true,
      },
      {
        title: '实例数量',
        dataIndex: 'instanceCount',
        key: 'instanceCount',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        width: '18%',
        render: (_, record) => (
          <Space size="small">
            <a onClick={() => onClickModifyServer(record)}>编辑</a>
            <a onClick={() => onClickDelete(record)}>删除</a>
            {/* <a onClick={() => onViewPerformance(record)}>性能详情</a> */}
            <a onClick={() => onViewNode(record)}>资源使用情况</a>
          </Space>
        ),
      },
    ];
    setColumns(data);
  }, []);

  useEffect(() => {
    getServerList();
  }, [pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickCreateServer}>
            创建服务器
          </Button>
        </div>
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          dataSource={serverList}
          onChange={onPageChange}
          pagination={{
            total: serverTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
            pageSize: baseConfig.pageSize,
          }}
        />
      </div>
      {createServerVisible && (
        <CreateServerModal
          record={serverRecord}
          visible={createServerVisible}
          onCancel={onCloseModal}
          getServerList={getServerList}
        />
      )}
    </div>
  );
}

export default connect(({ User, Layout, ElasticServer, loading }) => ({
  User,
  Layout,
  ElasticServer,
  qryLoading: loading.effects['ElasticServer/getServerList'],
}))(ServersManagement);
