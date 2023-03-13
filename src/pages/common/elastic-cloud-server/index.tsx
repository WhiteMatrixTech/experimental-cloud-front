import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, ElasticServerSchema, history } from 'umi';
import { PageTitle } from '~/components';
import { Table, Button, Space, Modal, Dropdown, Menu } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import CreateServerModal from './components/CreateServerModal';
import { ConnectState } from '~/models/connect';
export interface ServersManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  ElasticServer: ConnectState['ElasticServer'];
}
const ServersManagement: React.FC<ServersManagementProps> = (props) => {
  const { dispatch, qryLoading = false } = props;
  const { serverList, serverTotal } = props.ElasticServer;
  const [pageNum, setPageNum] = useState(1);
  const [createServerVisible, setCreateServerVisible] = useState(false);
  const [serverRecord, setServerRecord] = useState<ElasticServerSchema | null>(null);

  // 获取服务器列表
  const getServerList = useCallback(() => {
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
  }, [dispatch, pageNum]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickDelete = useCallback(
    (record: ElasticServerSchema) => {
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
    },
    [dispatch, getServerList]
  );

  const onClickModifyServer = (record: ElasticServerSchema) => {
    setServerRecord(record);
    setCreateServerVisible(true);
  };

  const onViewPerformance = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ElasticServerSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/common/elastic-cloud-server/${record.serverName}/server-performance`,
      state: { ...record }
    });
  };

  const onViewNode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ElasticServerSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/common/elastic-cloud-server/${record.serverName}/resource-usage`,
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

  const renderMenu = useCallback((record: ElasticServerSchema) => {
    return (
      <Menu>
        <Menu.Item>
          <a
            href={`/common/elastic-cloud-server/${record.serverName}/resource-usage`}
            onClick={(e) => onViewNode(e, record)}>
            实例数据
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href={`/common/elastic-cloud-server/${record.serverName}/server-performance`}
            onClick={(e) => onViewPerformance(e, record)}>
            资源使用情况
          </a>
        </Menu.Item>
      </Menu>
    );
  }, []);

  const columns = useMemo(() => {
    return [
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
        render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: '12%',
        render: (_: string, record: ElasticServerSchema) => (
          <Space size="small">
            <span role="button" className="table-action-span" onClick={() => onClickModifyServer(record)}>
              编辑
            </span>
            <span role="button" className="table-action-span" onClick={() => onClickDelete(record)}>
              删除
            </span>
            <Dropdown overlay={renderMenu(record)} trigger={['click']}>
              <span role="button" className="table-action-span" onClick={(e) => e.preventDefault()}>
                更多 <DownOutlined />
              </span>
            </Dropdown>
          </Space>
        )
      }
    ];
  }, [onClickDelete, renderMenu]);

  useEffect(() => {
    getServerList();
  }, [getServerList, pageNum]);

  return (
    <div className="page-wrapper">
      <PageTitle
        label="弹性云服务器管理"
        extra={
          <Button type="primary" onClick={onClickCreateServer}>
            创建服务器
          </Button>
        }
      />
      <div className="page-content page-content-shadow table-wrapper">
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
};

export default connect(({ User, Layout, ElasticServer, loading }: ConnectState) => ({
  User,
  Layout,
  ElasticServer,
  qryLoading: loading.effects['ElasticServer/getServerList']
}))(ServersManagement);
