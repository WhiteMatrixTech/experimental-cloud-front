import React, { useState, useEffect, useCallback } from 'react';
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
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
export interface ServersManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  ElasticServer: ConnectState['ElasticServer'];
}
const ServersManagement: React.FC<ServersManagementProps> = (props) => {
  const { dispatch, qryLoading = false } = props;
  const { serverList, serverTotal } = props.ElasticServer;
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
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

  const onClickDelete = useCallback((record: ElasticServerSchema) => {
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
      content: Intl.formatMessage('BASS_CONFIRM_DELETE_SERVER_MODAL_CONTENT', { serverName: record.serverName }),
      okText: Intl.formatMessage('BASS_COMMON_CONFIRM'),
      cancelText: Intl.formatMessage('BASS_COMMON_CANCEL'),
      onOk: callback
    });
  }, [dispatch, getServerList]);

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
            {Intl.formatMessage('BASS_ELASTIC_CLOUD_INSTANCE_DATA')}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href={`/common/elastic-cloud-server/${record.serverName}/server-performance`}
            onClick={(e) => onViewPerformance(e, record)}>
            {Intl.formatMessage('BASS_ELASTIC_CLOUD_RESOURCE_USE')}
          </a>
        </Menu.Item>
      </Menu>
    );
  }, []);

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data: ColumnsType<any> = [
      {
        title: Intl.formatMessage('BASS_ELASTIC_CLOUD_SERVER_NAME'),
        dataIndex: 'serverName',
        key: 'serverName',
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_ELASTIC_CLOUD_USERNAME'),
        dataIndex: 'username',
        key: 'username',
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_ELASTIC_CLOUD_TYPE_OF_USE'),
        dataIndex: 'serverPurpose',
        key: 'serverPurpose',
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_ELASTIC_CLOUD_EXTERNAL_IP'),
        dataIndex: 'publicIp',
        key: 'publicIp',
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_ELASTIC_CLOUD_INTRANET_IP'),
        dataIndex: 'privateIp',
        key: 'privateIp',
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_ELASTIC_CLOUD_INSTANCE_NUMBER'),
        dataIndex: 'instanceCount',
        key: 'instanceCount',
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
        dataIndex: 'createAt',
        key: 'createAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        ellipsis: true
      },
      {
        title: Intl.formatMessage('BASS_COMMON_OPERATION'),
        key: 'action',
        width: '12%',
        render: (_: string, record: ElasticServerSchema) => (
          <Space size="small">
            <span role="button" className="table-action-span" onClick={() => onClickModifyServer(record)}>
              {Intl.formatMessage('BASS_ELASTIC_CLOUD_EDIT')}
            </span>
            <span role="button" className="table-action-span" onClick={() => onClickDelete(record)}>
              {Intl.formatMessage('BASS_COMMON_DELETE')}
            </span>
            <Dropdown overlay={renderMenu(record)} trigger={['click']}>
              <span role="button" className="table-action-span" onClick={(e) => e.preventDefault()}>
                {Intl.formatMessage('BASS_ELASTIC_CLOUD_MORE')}
                <DownOutlined />
              </span>
            </Dropdown>
          </Space>
        )
      }
    ];
    setColumns(data);
  }, [onClickDelete, renderMenu]);

  useEffect(() => {
    getServerList();
  }, [getServerList, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickCreateServer}>
            {Intl.formatMessage('BASS_ELASTIC_CLOUD_CREATE_SERVER')}
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
};

export default connect(({ User, Layout, ElasticServer, loading }: ConnectState) => ({
  User,
  Layout,
  ElasticServer,
  qryLoading: loading.effects['ElasticServer/getServerList']
}))(ServersManagement);
