import React, { Component } from 'react';
import { connect } from "dva";
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { chainCodeStatusInfo } from '../../contract/myContract/_config';
import baseConfig from 'utils/config';

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
        dataIndex: '_id',
        key: '_id',
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
        title: '合约版本',
        dataIndex: 'chainCodeVersion',
        key: 'chainCodeVersion',
      },
      {
        title: '状态',
        dataIndex: 'chainCodeStatus',
        key: 'chainCodeStatus',
        render: text => text ? <Badge color={chainCodeStatusInfo[text].color} text={chainCodeStatusInfo[text].text} style={{ color: chainCodeStatusInfo[text].color }} /> : ''
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
    const { User, location, dispatch } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Union/getOrgListOfUnion',
      payload: params
    });
    dispatch({
      type: 'Union/getPeerListOfUnion',
      payload: params
    });
    dispatch({
      type: 'Union/getContractTotalOfUnion',
      payload: params
    });
    this.getContractListOfUnion();
  }

  // 获取 通道下的合约
  getContractListOfUnion = (current, chainCodeName) => {
    const { pageNum, pageSize } = this.state;
    const { User, location } = this.props;
    const { networkName } = User;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
      channelId: location?.state?.channelId,
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
    const { qryLoading = false, location } = this.props;
    const { pageSize, pageNum } = this.state;
    const { contractListOfUnion, contractTotalOfUnion, orgTotalOfUnion, peerTotalOfUnion } = this.props.Union;
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
      {
        label: '合约总数',
        value: contractTotalOfUnion
      },
    ]
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
