import React, { Component } from 'react';
import { connect } from "dva";
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { chainCodeStatus } from '../../contract/myContract/_config';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/unionList')
breadCrumbItem.push({
  menuName: "查看合约",
  menuHref: `/`,
})

class UnionChain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      chainCodeName: '',
    }
    this.columns = [
      {
        title: '合约ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
      },
      {
        title: '创建组织',
        dataIndex: 'createOrgName',
        key: 'createOrgName',
      },
      {
        title: '当前版本',
        dataIndex: 'currVersion',
        key: 'currVersion',
      },
      {
        title: '状态',
        dataIndex: 'chainCodeStatus',
        key: 'chainCodeStatus',
        render: text => text ? <Badge color={chainCodeStatus[text].color} text={chainCodeStatus[text].text} style={{ color: chainCodeStatus[text].color }} /> : ''
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
    const { location: { query: { cId = '' } } } = this.props;
    this.getContractListOfUnion()
    this.props.dispatch({
      type: 'Union/getContractSummaryOfUnion',
      payload: { id: cId }
    })
  }

  // 获取 通道下的合约
  getContractListOfUnion = (current, chainCodeName) => {
    const { pageNum, pageSize } = this.state;
    const { location: { query: { cId = '' } } } = this.props;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      id: cId,
    }
    if (chainCodeName) {
      params.orgName = chainCodeName
    }
    this.props.dispatch({
      type: 'Union/getContractListOfUnion',
      payload: params
    })
  }

  // 翻页
  onPageChange = pageInfo => {
    this.setState({ pageNum: pageInfo.current })
    this.getContractListOfUnion(pageInfo.current)
  }

  // 按 合约名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, chainCodeName: value || '' })
      this.getContractListOfUnion(1, value)
    }
  }

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum } = this.state;
    const { userRole } = this.props.User
    const { contractListOfUnion, contractTotalOfUnion, contractInfoOfUnion } = this.props.Contract;
    const unionInfoList = [
      {
        label: '通道名称',
        value: contractInfoOfUnion.channelName
      },
      {
        label: '合约数量',
        value: contractInfoOfUnion.chainCodeCount
      },
      {
        label: '我背书的',
        value: contractInfoOfUnion.myJoinedCount
      },
      {
        label: '我创建的',
        value: contractInfoOfUnion.myCreateCount
      }
    ]
    if (userRole === Roles.NetworkAdmin) {
      unionInfoList.slice(1, 0, {
        label: '所属联盟',
        value: contractInfoOfUnion.leagueName
      })
    }
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <DetailCard cardTitle='基本信息' detailList={unionInfoList} boxShadow='0 4px 12px 0 rgba(0,0,0,.05)' />
          <SearchBar placeholder='输入合约名称' onSearch={this.onSearch} />
          <Table
            rowKey='_id'
            loading={qryLoading}
            columns={this.columns}
            className='page-content-shadow'
            dataSource={contractListOfUnion}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: contractTotalOfUnion, current: pageNum, position: ['bottomCenter'] }}
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
  qryLoading: loading.effects['Union/getContractListOfUnion']
}))(UnionChain);
