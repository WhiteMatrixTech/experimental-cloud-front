import React, { Component } from 'react';
import { connect } from "dva";
import { Table } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import AddOrg from '../components/AddOrg';
import baseConfig from 'utils/config';


const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/unionList')
breadCrumbItem.push({
  menuName: "查看组织",
  menuHref: `/`,
})

class UnionMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      orgName: '',

      addOrgVisible: false, // 添加组织是否可见
      peerObj: {}, // 当前操作的通道
    }
    this.columns = [
      {
        title: '组织名称',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '组织别名',
        dataIndex: 'orgAliasName',
        key: 'orgAliasName',
      },
      {
        title: '组织MSPID',
        dataIndex: 'orgMspId',
        key: 'orgMspId',
      },
      {
        title: '所属企业',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '组织地址',
        dataIndex: 'orgAddress',
        key: 'orgAddress',
      }
    ]
  }

  componentDidMount() {
    this.getOrgListOfUnion()
  }

  // 获取 通道下的组织
  getOrgListOfUnion = (current, orgName) => {
    const { pageNum, pageSize } = this.state;
    const { location: { query: { cId = '' } } } = this.props;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      id: cId,
    }
    if (orgName) {
      params.orgName = orgName
    }
    this.props.dispatch({
      type: 'Union/getOrgListOfUnion',
      payload: params
    })
  }

  // 翻页
  onPageChange = pageInfo => {
    this.setState({ pageNum: pageInfo.current })
    this.getOrgListOfUnion(pageInfo.current)
  }

  // 按 组织名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, orgName: value || '' })
      this.getOrgListOfUnion(1, value)
    }
  }

  // 关闭 添加组织 弹窗
  onCloseModal = () => {
    this.setState({ addOrgVisible: false })
  }

  // 点击 添加组织
  onClickAddOrg = () => {
    const { location: { query: { cId } } } = this.props;
    this.setState({ addOrgVisible: true, peerObj: { _id: cId } })
  }

  render() {
    const { qryLoading = false, location: { query: { channelName = '', orgCount = '', peerCount = '', leagueName = '' } } } = this.props;
    const { pageSize, pageNum, addOrgVisible } = this.state;
    const { userType } = this.props.Layout
    const { orgListOfUnion, orgTotalOfUnion } = this.props.Contract;
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
      },
    ]
    if (userType === 2) {
      unionInfoList.slice(1, 0, {
        label: '所属联盟',
        value: leagueName
      })
    }
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <DetailCard cardTitle='基本信息' detailList={unionInfoList} boxShadow='0 4px 12px 0 rgba(0,0,0,.05)' />
          <SearchBar placeholder='输入组织名' onSearch={this.onSearch} btnName={userType === 2 ? '添加组织' : null} onClickBtn={this.onClickAddOrg} />
          <Table
            rowKey='_id'
            loading={qryLoading}
            columns={this.columns}
            className='page-content-shadow'
            dataSource={orgListOfUnion}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: orgTotalOfUnion, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
        {addOrgVisible && <AddOrg visible={addOrgVisible} onCancel={this.onCloseModal} />}
      </div >
    )
  }
}

export default connect(({ Union, Layout, loading }) => ({
  Union,
  Layout,
  qryLoading: loading.effects['Union/getOrgListOfUnion']
}))(UnionMember);
