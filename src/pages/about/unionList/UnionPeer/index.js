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
        dataIndex: 'nodeName',
        key: 'peerName',
      },
      {
        title: '节点别名',
        dataIndex: 'nodeAliasName',
        key: 'peerAliasName',
      },
      {
        title: '节点全名',
        dataIndex: 'nodeFullName',
        key: 'nodeFullName',
      },
      {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '状态',
        dataIndex: 'nodeStatus',
        key: 'nodeStatus',
        render: text => text ? <Badge color={peerStatus[text].color} text={peerStatus[text].text} style={{ color: peerStatus[text].color }} /> : ''
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      }
    ]
  }

  componentDidMount() {
    const { User, location } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    }
    this.props.dispatch({
      type: 'Union/getOrgListOfUnion',
      payload: params
    });
    this.getPeerListOfUnion();
  }

  // 获取 通道下的节点
  getPeerListOfUnion = (peerName) => {
    const { User, location } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
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
  }

  // 按 组织名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, peerName: value || '' })
      this.getPeerListOfUnion(value)
    }
  }

  render() {
    const { qryLoading = false, location } = this.props;
    const { pageSize, pageNum } = this.state;
    const { userRole } = this.props.User
    const { peerListOfUnion, orgTotalOfUnion, peerTotalOfUnion } = this.props.Union;
    const unionInfoList = [
      {
        label: '通道名称',
        value: location?.state?.channelId
      },
      {
        label: '组织数量',
        value: orgTotalOfUnion
      },
      {
        label: '节点总数',
        value: peerTotalOfUnion
      },
    ]
    if (userRole === Roles.NetworkAdmin) {
      unionInfoList.slice(1, 0, {
        label: '所属联盟',
        value: location?.state?.leagueName
      })
      unionInfoList.slice(3, 0, {
        label: '我的节点数',
        value: location?.state?.companyPeerCount
      })
    }
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <DetailCard cardTitle='基本信息' detailList={unionInfoList} boxShadow='0 4px 12px 0 rgba(0,0,0,.05)' />
          {/* <SearchBar placeholder='输入节点名称' onSearch={this.onSearch} /> */}
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
