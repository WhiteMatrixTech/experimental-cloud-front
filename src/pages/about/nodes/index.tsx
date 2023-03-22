import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { PageTitle } from '~/components';
import { Table, Button, Badge, Space, notification, Spin } from 'antd';
import CreateNodeModal from './components/CreateNodeModal';
import SSHCommand from './components/SSHCommand';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { peerStatus, availableNodeStatus } from './_config';
import { ConnectState } from '~/models/connect';
import { Dispatch, PeerSchema } from 'umi';
import { ColumnsType } from 'antd/lib/table';
import { getTokenData } from '~/utils/encryptAndDecrypt';
import { cancelCurrentRequest } from '~/utils/request';

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
  const [nodeRecord, setNodeRecord] = useState<PeerSchema>();
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
      // token校验
      const { accessToken } = getTokenData();

      let headers = {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${accessToken}`
      };

      setDownloading(true);

      request(`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/keypair`, {
        headers,
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
            {userRole === Roles.ADMIN && (
              <a
                href={`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/keypair`}
                onClick={(e) => onDownLoadCertificate(e, record)}>
                下载证书
              </a>
            )}
            {availableNodeStatus.includes(record.nodeStatus) && (
              <span role="button" className="table-action-span" onClick={() => onClickGetSSH(record)}>
                获取ssh命令
              </span>
            )}
          </Space>
        )
      }
    ];
    if (userRole === Roles.ADMIN) {
      const insertColumn = {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        ellipsis: true
      };
      data.splice(3, 0, insertColumn);
    }
    setColumns(data);
  }, [networkName, onDownLoadCertificate, userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getNodeList();
    return () => cancelCurrentRequest();
  }, [getNodeList, pageNum]);

  return (
    <div className="page-wrapper">
      <Spin spinning={downloading} tip="下载中...">
        <PageTitle
          label="节点管理"
          extra={
            <Button type="primary" onClick={onClickCreateNode}>
              创建节点
            </Button>
          }
        />
        <div className="page-content page-content-shadow table-wrapper">
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
