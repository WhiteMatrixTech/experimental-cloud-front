import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Breadcrumb } from 'components';
import { Table, Button, Badge, Space } from 'antd';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import CreatePeer from './components/CreatePeer';
import SSHCommand from './components/SSHCommand';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';
import { peerStatus, availableNodeStatus } from './_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/peerList');

function PeerList(props) {
  const { dispatch, qryLoading = false, User } = props;
  const { networkName, userRole } = User;
  const { peerList, peerTotal } = props.Peer;
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [nodeRecord, setNodeRecord] = useState(null);
  const [sshModalVisible, setSshModalVisible] = useState(false);
  const [createPeerVisible, setCreatePeerVisible] = useState(false);

  // 获取节点列表
  const getPeerList = () => {
    const params = {
      networkName,
    };
    dispatch({
      type: 'Peer/getPeerList',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  // 点击 创建节点
  const onClickCreatePeer = () => {
    setCreatePeerVisible(true);
  };

  // 关闭 创建节点、获取ssh命令 弹窗
  const onCloseModal = () => {
    setCreatePeerVisible(false);
    setSshModalVisible(false);
  };

  const onClickGetSSH = (record) => {
    setNodeRecord(record);
    setSshModalVisible(true);
  };

  const onDownLoadCertificate = (record) => {
    // token校验
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken,
    };

    request(`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/keypair`, {
      headers,
      mode: 'cors',
      method: 'GET',
      responseType: 'blob',
    }).then((res) => {
      const blob = new Blob([res]);
      saveAs(blob, `${networkName}.pem`);
    });
  };

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '节点名称',
        dataIndex: 'nodeName',
        key: 'nodeName',
        ellipsis: true,
      },
      {
        title: '节点别名',
        dataIndex: 'nodeAliasName',
        key: 'nodeAliasName',
        ellipsis: true,
      },
      {
        title: '节点全名',
        dataIndex: 'nodeFullName',
        key: 'nodeFullName',
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'nodeStatus',
        key: 'nodeStatus',
        render: (text) => (text ? <Badge color={peerStatus[text].color} text={peerStatus[text].text} style={{ color: peerStatus[text].color }} /> : ''),
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="small">
            {userRole === Roles.NetworkAdmin && <a onClick={() => onDownLoadCertificate(record)}>下载证书</a>}
            {availableNodeStatus.includes(record.nodeStatus) && <a onClick={() => onClickGetSSH(record)}>获取ssh命令</a>}
          </Space>
        ),
      },
    ];
    if (userRole === Roles.NetworkAdmin) {
      const insertColumn = {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        ellipsis: true,
      };
      data.splice(3, 0, insertColumn);
    }
    setColumns(data);
  }, [userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getPeerList();
  }, [pageNum]);

  useEffect(() => {
    const interval = setInterval(getPeerList, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickCreatePeer}>
            创建节点
          </Button>
        </div>
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          className="page-content-shadow"
          dataSource={peerList}
          onChange={onPageChange}
          pagination={{ pageSize, total: peerTotal, current: pageNum, showSizeChanger: false, position: ['bottomCenter'] }}
        />
      </div>
      {createPeerVisible && <CreatePeer getPeerList={getPeerList} visible={createPeerVisible} onCancel={onCloseModal} />}
      {sshModalVisible && <SSHCommand nodeRecord={nodeRecord} visible={sshModalVisible} onCancel={onCloseModal} />}
    </div>
  );
}

export default connect(({ User, Layout, Peer, loading }) => ({
  User,
  Layout,
  Peer,
  qryLoading: loading.effects['Peer/getPeerList'],
}))(PeerList);
