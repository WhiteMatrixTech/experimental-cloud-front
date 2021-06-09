import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Breadcrumb } from '~/components';
import { Table, Button, Badge, Space } from 'antd';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import CreateNodeModal from './components/CreateNodeModal';
import SSHCommand from './components/SSHCommand';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { peerStatus, availableNodeStatus } from './_config';
import { ConnectState } from '~/models/connect';
import { Dispatch, PeerSchema } from 'umi';
import { ColumnsType } from 'antd/lib/table';

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
  const [nodeRecord, setNodeRecord] = useState<PeerSchema>({});
  const [sshModalVisible, setSshModalVisible] = useState(false);
  const [createNodeVisible, setCreateNodeVisible] = useState(false);

  // 获取节点列表
  const getNodeList = () => {
    const params = {
      networkName
    };
    dispatch({
      type: 'Peer/getNodeList',
      payload: params
    });
  };

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

  const onDownLoadCertificate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: PeerSchema) => {
    e.preventDefault();
    // token校验
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken
    };

    request(`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/keypair`, {
      headers,
      mode: 'cors',
      method: 'GET',
      responseType: 'blob'
    }).then((res: any) => {
      const blob = new Blob([res]);
      saveAs(blob, `${networkName}.pem`);
    });
  };

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
            {userRole === Roles.NetworkAdmin && (
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
  }, [userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getNodeList();
  }, [pageNum]);

  return (
    <div className="page-wrapper">
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
    </div>
  );
};

export default connect(({ User, Layout, Peer, loading }: ConnectState) => ({
  User,
  Layout,
  Peer,
  qryLoading: loading.effects['Peer/getNodeList']
}))(NodeManagement);
