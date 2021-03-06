import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Breadcrumb } from '~/components';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Table, Button, Badge, Space, notification, Spin, Modal, Menu, Dropdown } from 'antd';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import CreateNodeModal from './components/CreateNodeModal';
import SSHCommand from './components/SSHCommand';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { peerStatus, availableNodeStatus, NodeOperate, NodeStatus } from './_config';
import { ConnectState } from '~/models/connect';
import { Dispatch, PeerSchema } from 'umi';
import { ColumnsType } from 'antd/lib/table';
import { cancelCurrentRequest } from '~/utils/request';
import { NodeOperationApiParams } from '~/services/node';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/nodes');

export interface NodeManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  User: ConnectState['User'];
  Peer: ConnectState['Peer'];
}

const NodeManagement: React.FC<NodeManagementProps> = (props) => {
  const { dispatch, qryLoading = false, User } = props;
  const { networkName, userRole } = User;
  const { nodeList, nodeTotal } = props.Peer;
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [nodeRecord, setNodeRecord] = useState<PeerSchema | null>(null);
  const [sshModalVisible, setSshModalVisible] = useState(false);
  const [createNodeVisible, setCreateNodeVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 获取节点列表
  const getNodeList = useCallback(() => {
    const params = {
      networkName
    };
    dispatch({
      type: 'Peer/getNodeList',
      payload: params
    });
  }, [dispatch, networkName]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 点击 创建节点
  const onClickCreateNode = () => {
    setCreateNodeVisible(true);
  };

  // 关闭 创建节点、获取ssh命令 弹窗
  const onCloseModal = () => {
    setCreateNodeVisible(false);
    setSshModalVisible(false);
  };

  const onClickGetSSH = (record: PeerSchema) => {
    setNodeRecord(record);
    setSshModalVisible(true);
  };

  const onDownLoadCertificate = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: PeerSchema) => {
      e.preventDefault();

      setDownloading(true);

      request(`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/keypair`, {
        mode: 'cors',
        method: 'GET',
        responseType: 'blob'
      })
        .then((res: any) => {
          setDownloading(false);
          const blob = new Blob([res]);
          saveAs(blob, `${networkName}.pem`);
        })
        .catch((errMsg) => {
          // DOMException: The user aborted a request.
          if (!errMsg) {
            setDownloading(false);
            notification.error({ message: '节点证书下载失败', top: 64, duration: 3 });
          }
        });
    },
    [networkName]
  );

  const deleteNode = useCallback((record: PeerSchema) => {
    const params: NodeOperationApiParams = {
      networkName,
      orgName: record.orgName,
      peerNames: [record.nodeName],
      operate: NodeOperate.Delete
    }
    dispatch({
      type: 'Peer/deleteNode',
      payload: params,
    }).then((res: boolean) => {
      if (res) {
        getNodeList();
      }
    });
  }, [dispatch, getNodeList, networkName]);

  const stopNode = useCallback((record: PeerSchema) => {
    const params: NodeOperationApiParams = {
      networkName,
      orgName: record.orgName,
      peerNames: [record.nodeName],
      operate: NodeOperate.Stop
    }
    dispatch({
      type: 'Peer/stopNode',
      payload: params,
    }).then((res: boolean) => {
      if (res) {
        getNodeList();
      }
    });
  }, [dispatch, getNodeList, networkName])

  const resumeNode = useCallback((record: PeerSchema) => {
    const params: NodeOperationApiParams = {
      networkName,
      orgName: record.orgName,
      peerNames: [record.nodeName],
      operate: NodeOperate.Resume
    }
    dispatch({
      type: 'Peer/resumeNode',
      payload: params,
    }).then((res: boolean) => {
      if (res) {
        getNodeList();
      }
    });
  }, [dispatch, getNodeList, networkName]);

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = useCallback((record: PeerSchema, type: NodeOperate) => {
    let tipTitle = '';
    let callback = () => { };
    switch (type) {
      case NodeOperate.Delete:
        tipTitle = `删除节点 【${record.nodeName}】 `;
        callback = () => deleteNode(record);
        break;
      case NodeOperate.Resume:
        tipTitle = `重启节点 【${record.nodeName}】 `;
        callback = () => resumeNode(record);
        break;
      case NodeOperate.Stop:
        tipTitle = `停用节点 【${record.nodeName}】 `;
        callback = () => stopNode(record);
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确定要${tipTitle}吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  }, [deleteNode, resumeNode, stopNode]);

  const renderMenu = useCallback((record: PeerSchema) => {
    return (
      <Menu>
        {userRole === Roles.NetworkAdmin && (
          <Menu.Item>
            <a
              href={`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/keypair`}
              onClick={(e) => onDownLoadCertificate(e, record)}>
              下载证书
            </a>
          </Menu.Item>
        )}
        {availableNodeStatus.includes(record.nodeStatus) && (
          <Menu.Item>
            <span
              role="button"
              onClick={() => onClickGetSSH(record)}>
              获取ssh命令
            </span>
          </Menu.Item>
        )}
      </Menu>
    );
  }, [networkName, onDownLoadCertificate, userRole]);

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data: ColumnsType<any> = [
      {
        title: '节点名称',
        dataIndex: 'nodeName',
        key: 'nodeName',
        ellipsis: true
      },
      {
        title: '节点别名',
        dataIndex: 'nodeAliasName',
        key: 'nodeAliasName',
        ellipsis: true
      },
      {
        title: '节点全名',
        dataIndex: 'nodeFullName',
        key: 'nodeFullName',
        ellipsis: true
      },
      {
        title: '状态',
        dataIndex: 'nodeStatus',
        key: 'nodeStatus',
        render: (text) =>
          text ? (
            <Badge
              color={peerStatus[text].color}
              text={peerStatus[text].text}
              style={{ color: peerStatus[text].color }}
            />
          ) : (
            ''
          )
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record: PeerSchema) => (
          <Space size="small">
            {record.nodeStatus === NodeStatus.Running && (
              <span
                role="button"
                className="table-action-span"
                onClick={() => onClickToConfirm(record, NodeOperate.Stop)}>
                停用
              </span>
            )}
            {record.nodeStatus === NodeStatus.Stopped && (
              <span
                role="button"
                className="table-action-span"
                onClick={() => onClickToConfirm(record, NodeOperate.Resume)}>
                重启
              </span>
            )}
            {[NodeStatus.Stopped, NodeStatus.Running].includes(record.nodeStatus) && (
              <span
                role="button"
                className="table-action-span"
                onClick={() => onClickToConfirm(record, NodeOperate.Delete)}>
                删除
              </span>
            )}
            <Dropdown overlay={renderMenu(record)} trigger={['click']}>
              <span className="table-action-span" onClick={(e) => e.preventDefault()}>
                更多 <DownOutlined />
              </span>
            </Dropdown>
          </Space>
        )
      }
    ];
    if (userRole === Roles.NetworkAdmin) {
      const insertColumn = {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        ellipsis: true
      };
      data.splice(3, 0, insertColumn);
    }
    setColumns(data);
  }, [networkName, onClickToConfirm, onDownLoadCertificate, renderMenu, userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getNodeList();
    return () => cancelCurrentRequest();
  }, [getNodeList, pageNum]);

  return (
    <div className="page-wrapper">
      <Spin spinning={downloading} tip="下载中...">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={onClickCreateNode}>
              创建节点
            </Button>
          </div>
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={columns}
            dataSource={nodeList}
            onChange={onPageChange}
            pagination={{
              pageSize,
              total: nodeTotal,
              current: pageNum,
              showSizeChanger: false,
              position: ['bottomCenter']
            }}
          />
        </div>
        {createNodeVisible && (
          <CreateNodeModal getNodeList={getNodeList} visible={createNodeVisible} onCancel={onCloseModal} />
        )}
        {sshModalVisible && <SSHCommand nodeRecord={nodeRecord} visible={sshModalVisible} onCancel={onCloseModal} />}
      </Spin>
    </div>
  );
};

export default connect(({ User, Layout, Peer, loading }: ConnectState) => ({
  User,
  Layout,
  Peer,
  qryLoading: loading.effects['Peer/getNodeList']
}))(NodeManagement);
