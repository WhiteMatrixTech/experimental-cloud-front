import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { history } from 'umi';
import { Table, Button, Badge, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'components';
import CreateUnion from './components/CreateUnion';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';
import { unionStatus } from './_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/unionList')

function UnionList(props) {
  const { dispatch, qryLoading = false, User } = props
  const { networkName, userRole } = User;
  const { unionList, unionTotal } = props.Union
  const [columns, setColumns] = useState([])
  const [pageNum, setPageNum] = useState(1)
  const [pageSize] = useState(baseConfig.pageSize)
  const [createUnionVisible, setCreateUnionVisible] = useState(false)

  // 获取通道列表
  const getUnionList = current => {
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      networkName,
      ascend: false,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
    }
    dispatch({
      type: 'Union/getUnionList',
      payload: params
    })
  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
    getUnionList(pageInfo.current)
  }


  // 点击 创建通道
  const onClickCreateUnion = () => {
    setCreateUnionVisible(true)
  }

  // 关闭 创建通道弹窗
  const onCloseCreateUnion = (res) => {
    setCreateUnionVisible(false);
    if (res) {
      getUnionList();
    }
  }

  // 点击 查看组织
  const onViewOrg = record => {
    history.push({
      pathname: `/about/unionList/UnionMember`,
      query: {
        cId: record._id,
      },
      state: { ...record }
    })
  }

  // 点击 查看节点
  const onViewPeer = record => {
    history.push({
      pathname: `/about/unionList/UnionPeer`,
      query: {
        cId: record._id,
      },
      state: { ...record }
    })
  }

  // 点击 查看合约
  const onViewContract = record => {
    history.push({
      pathname: `/about/unionList/UnionChain`,
      query: {
        cId: record._id,
      },
      state: { ...record }
    })
  }

  // 点击 查看详情
  const onViewDetail = record => {
    history.push({
      pathname: `/about/unionList/UnionDetail`,
      query: {
        cId: record._id,
      },
      state: { ...record }
    })
  }

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = (record, type) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'enable':
        tipTitle = '启用'
        callback = () => false
        break
      case 'stop':
        tipTitle = '停用'
        callback = () => false
        break
      default:
        break
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要${tipTitle}通道 【${record.channelName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback
    });
  }

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '通道名称',
        dataIndex: 'channelId',
        key: 'channelId',
      },
      {
        title: '通道别名',
        dataIndex: 'channelAliasName',
        key: 'channelAliasName',
      },
      {
        title: '组织数量',
        dataIndex: 'orgCount',
        key: 'orgCount',
      },
      {
        title: '通道状态',
        dataIndex: 'channelStatus',
        key: 'channelStatus',
        render: text => text ? <Badge color={unionStatus[text].color} text={unionStatus[text].text} style={{ color: unionStatus[text].color }} /> : ''
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size='small'>
            {((record.channelStatus === 4 || record.channelStatus === 12) && userRole === Roles.NetworkAdmin) && <a>开启通道</a>}
            <a onClick={() => onViewOrg(record)}>查看组织</a>
            <a onClick={() => onViewPeer(record)}>查看节点</a>
            <a onClick={() => onViewContract(record)}>查看合约</a>
            {(record.channelStatus === 1 && userRole === Roles.NetworkAdmin) && <a onClick={() => onClickToConfirm(record, 'stop')}>停用通道</a>}
            {(record.channelStatus === 7 && userRole === Roles.NetworkAdmin) && <a onClick={() => onClickToConfirm(record, 'enable')}>启用通道</a>}
            <a onClick={() => onViewDetail(record)}>详情</a>
          </Space>
        ),
      },
    ]
    if (userRole === Roles.NetworkMember) {
      const rest = [{
        title: '所属联盟',
        dataIndex: 'leagueName',
        key: 'leagueName',
      }, {
        title: '我的节点数',
        dataIndex: 'companyPeerCount',
        key: 'companyPeerCount',
      }, {
        title: '节点总数',
        dataIndex: 'peerCount',
        key: 'peerCount',
      }]
      data.splice(3, 0, rest[0])
      data.splice(5, 0, rest[1])
      data.splice(6, 0, rest[2])
    }
    setColumns(data)
  }, [userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getUnionList();
  }, [pageNum]);


  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        {userRole === Roles.NetworkAdmin &&
          <div className='table-header-btn-wrapper'>
            <Button type='primary' onClick={onClickCreateUnion}>创建通道</Button>
          </div>
        }
        <Table
          rowKey='_id'
          loading={qryLoading}
          columns={columns}
          className='page-content-shadow'
          dataSource={unionList}
          onChange={onPageChange}
          pagination={{ pageSize, total: unionTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {createUnionVisible && <CreateUnion visible={createUnionVisible} onCancel={onCloseCreateUnion} />}
    </div >
  )
}

export default connect(({ User, Layout, Union, loading }) => ({
  User,
  Layout,
  Union,
  qryLoading: loading.effects['Union/getUnionList']
}))(UnionList);
