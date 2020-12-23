import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { Table, Button, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import CreatePeer from './components/CreatePeer';
import baseConfig from 'utils/config';
import { peerStatus } from './_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/peerList')

function PeerList(props) {
  const { dispatch, qryLoading = false ,User} = props
  const { networkName } = User;
  const { userType } = props.Layout
  const { peerList, peerTotal } = props.Peer
  const [columns, setColumns] = useState([])
  const [pageNum, setPageNum] = useState(1)
  const [pageSize] = useState(baseConfig.pageSize)
  const [createPeerVisible, setCreatePeerVisible] = useState(false)

  //获取组织列表
  const getOrgList = () => {
    const params = {
      networkName,
      networkVersion:'1.0.0'
    }
    dispatch({
      type: 'Peer/getOrgList',
      payload: params
    })
  }
  // 获取节点列表
  const getPeerList = current => {
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      networkName,
      networkVersion:'1.0.0',
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
    }
    dispatch({
      type: 'Peer/getPeerList',
      payload: params
    })
  }

  const getPeerTotalDocs = () => {
    dispatch({
      type: 'Peer/getPeerTotalDocs',
      payload: { networkName },
    });
  };

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
    getPeerList(pageInfo.current)
  }


  // 点击 创建节点
  const onClickCreatePeer = () => {
    setCreatePeerVisible(true)
  }

  // 关闭 创建节点 弹窗
  const onCloseCreatePeerModal = () => {
    setCreatePeerVisible(false)
  }

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '节点名称',
        dataIndex: 'nodeName',
        key: 'nodeName',
      },
      {
        title: '节点别名',
        dataIndex: 'nodeAliasName',
        key: 'nodeAliasName',
      },
      {
        title: '状态',
        dataIndex: 'nodeStatus',
        key: 'nodeStatus',
        render: text => text ? <Badge color={peerStatus[text].color} text={peerStatus[text].text} style={{ color: peerStatus[text].color }} /> : ''
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
    ]
    if (userType === 2) {
      data.push(
        {
          title: '所属组织',
          dataIndex: 'orgName',
          key: 'orgName',
          ellipsis: true,
        }
      )
    }
    setColumns(data)
  }, [userType]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getPeerList();
    getPeerTotalDocs();
  }, [pageNum]);

  useEffect(() => {
    const interval = setInterval(getPeerList, 30000)
    return () => {
      clearInterval(interval)
    }
  }, []);

  useEffect(() => {
    getOrgList()
  }, [])


  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <div className='table-header-btn-wrapper'>
          <Button type='primary' onClick={onClickCreatePeer}>创建节点</Button>
        </div>
        <Table
          rowKey='_id'
          loading={qryLoading}
          columns={columns}
          className='page-content-shadow'
          dataSource={peerList}
          onChange={onPageChange}
          pagination={{ pageSize, total: peerTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {createPeerVisible && <CreatePeer  getPeerList={getPeerList} visible={createPeerVisible} onCancel={onCloseCreatePeerModal} />}
    </div >
  )
}

export default connect(({User, Layout, Peer, loading }) => ({
  User,
  Layout,
  Peer,
  qryLoading: loading.effects['Peer/getPeerList']
}))(PeerList);

