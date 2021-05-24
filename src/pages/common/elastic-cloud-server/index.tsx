import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, ElasticServerSchema, history } from 'umi';
import { Breadcrumb } from '~/components';
import { Table, Button, Space, Modal, Dropdown, Menu } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import CreateServerModal from './components/CreateServerModal';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
export interface ServersManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  ElasticServer: ConnectState['ElasticServer'];
}
function ServersManagement(props: ServersManagementProps) {
  const { dispatch, qryLoading = false } = props;
  const { serverList, serverTotal } = props.ElasticServer;
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const [pageNum, setPageNum] = useState(1);
  const [createServerVisible, setCreateServerVisible] = useState(false);
  const [serverRecord, setServerRecord] = useState<ElasticServerSchema | null>(null);

  // 获取服务器列表
  const getServerList = () => {
    const offset = (pageNum - 1) * 10;

    const params = {
      limit: 10,
      offset: offset,
      ascend: false
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params
    });
    dispatch({
      type: 'ElasticServer/getServerTotal',
      payload: {}
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickDelete = (record: ElasticServerSchema) => {
    const callback = async () => {
      const res = await dispatch({
        type: 'ElasticServer/deleteServer',
        payload: { serverName: record.serverName }
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
      onOk: callback
    });
  };

  const onClickModifyServer = (record: ElasticServerSchema) => {
    setServerRecord(record);
    setCreateServerVisible(true);
  };

  const onViewPerformance = (record: ElasticServerSchema) => {
    history.push({
      pathname: `/common/elastic-cloud-server/server-performance`,
      state: { ...record }
    });
  };

  const onViewNode = (record: ElasticServerSchema) => {
    history.push({
      pathname: `/common/elastic-cloud-server/resource-usage`,
      state: { ...record }
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

  const renderMenu = (record: ElasticServerSchema) => {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={() => onViewNode(record)}>实例数据</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => onViewPerformance(record)}>资源使用情况</a>
        </Menu.Item>
      </Menu>
    );
  };

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data: ColumnsType<any> = [
      {
        title: '服务器名称',
        dataIndex: 'serverName',
        key: 'serverName',
        ellipsis: true
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true
      },
      {
        title: '用途类型',
        dataIndex: 'serverPurpose',
        key: 'serverPurpose',
        ellipsis: true
      },
      {
        title: '外网IP',
        dataIndex: 'publicIp',
        key: 'publicIp',
        ellipsis: true
      },
      {
        title: '内网IP',
        dataIndex: 'privateIp',
        key: 'privateIp',
        ellipsis: true
      },
      {
        title: '实例数量',
        dataIndex: 'instanceCount',
        key: 'instanceCount',
        ellipsis: true
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: '12%',
        render: (_: string, record: ElasticServerSchema) => (
          <Space size="small">
            <a onClick={() => onClickModifyServer(record)}>编辑</a>
            <a onClick={() => onClickDelete(record)}>删除</a>
            <Dropdown overlay={renderMenu(record)} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        )
      }
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
            pageSize: 10
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

export default connect(({ User, Layout, ElasticServer, loading }: ConnectState) => ({
  User,
  Layout,
  ElasticServer,
  qryLoading: loading.effects['ElasticServer/getServerList']
}))(ServersManagement);
