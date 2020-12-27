import React, { Component } from 'react';
import { connect } from "dva";
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { peerStatus } from '../../peerList/_config';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/unionList')
breadCrumbItem.push({
  menuName: "查看节点",
  menuHref: `/`,
})

class UnionPeer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      peerName: '',
    }
    this.columns = [
      {
        title: '节点名称',
        dataIndex: 'peerName',
        key: 'peerName',
      },
      {
        title: '节点别名',
        dataIndex: 'peerAliasName',
        key: 'peerAliasName',
      },
      {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '状态',
        dataIndex: 'peerStatus',
        key: 'peerStatus',
        render: text => text ? <Badge color={peerStatus[text].color} text={peerStatus[text].text} style={{ color: peerStatus[text].color }} /> : ''
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      }
    ]
  }

  componentDidMount() {
    this.getPeerListOfUnion()
  }

  // 获取 通道下的节点
  getPeerListOfUnion = (current, peerName) => {
    const { pageNum, pageSize } = this.state;
    const { location: { query: { cId = '' } } } = this.props;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      id: cId,
    }
    if (peerName) {
      params.orgName = peerName
    }
    this.props.dispatch({
      type: 'Union/getPeerListOfUnion',
      payload: params
    })
  }

  // 翻页
  onPageChange = pageInfo => {
    this.setState({ pageNum: pageInfo.current })
    this.getPeerListOfUnion(pageInfo.current)
  }

  // 按 组织名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, peerName: value || '' })
      this.getPeerListOfUnion(1, value)
    }
  }

  render() {
    const { qryLoading = false, location: { query: { channelName = '', orgCount = '', peerCount = '', leagueName = '', companyPeerCount = '' } } } = this.props;
    const { pageSize, pageNum } = this.state;
    const { userRole } = this.props.User
    const { peerListOfUnion, peerTotalOfUnion } = this.props.Contract;
    const unionInfoList = [
      {
        label: '通道名称',
        value: channelName
      },
      {
        label: '组织数量',
        value: orgCount
      },
      {
        label: '节点总数',
        value: peerCount
      }
    ]
    if (userRole === Roles.NetworkAdmin) {
      unionInfoList.slice(1, 0, {
        label: '所属联盟',
        value: leagueName
      })
      unionInfoList.slice(3, 0, {
        label: '我的节点数',
        value: companyPeerCount
      })
    }
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <DetailCard cardTitle='基本信息' detailList={unionInfoList} boxShadow='0 4px 12px 0 rgba(0,0,0,.05)' />
          <SearchBar placeholder='输入节点名称' onSearch={this.onSearch} />
          <Table
            rowKey='_id'
            loading={qryLoading}
            columns={this.columns}
            className='page-content-shadow'
            dataSource={peerListOfUnion}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: peerTotalOfUnion, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
      </div >
    )
  }
}

export default connect(({ Union, Layout, User, loading }) => ({
  Union,
  Layout,
  User,
  qryLoading: loading.effects['Union/getPeerListOfUnion']
}))(UnionPeer);
