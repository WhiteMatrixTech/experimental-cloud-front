import React, { Component } from 'react';
import { connect } from "dva";
import { history } from 'umi';
import { Table, Space, Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import baseConfig from 'utils/config';

let breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false)
breadCrumbItem = breadCrumbItem.concat([
  {
    menuName: "我的合约",
    menuHref: `/about/contract/myContract`,
    isLeftMenu: true
  },
  {
    menuName: "合约详情",
    menuHref: `/`,
  }
])

class ContractDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,
      chainCodeName: ''
    }
    this.columns = [
      {
        title: '合约版本',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '创建组织',
        dataIndex: 'createOrgName',
        key: 'createOrgName',
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
        width: '18%',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => this.onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ]
  }

  componentDidMount() {
    const { location: { query: { chainCodeId } } } = this.props;
    this.props.dispatch({
      type: 'Contract/getDetailOfChainCode',
      payload: { chainCodeId, networkName:this.props.User.networkName }
    })
    this.getChainCodeHistory()
    this.getChainCodeHistoryTotalDocs()
  }
  // 获取合约列表的totalCount
  getChainCodeHistoryTotalDocs = () => {
    const params = {
     networkName:this.props.User.networkName,
    };
    this.props.dispatch({
      type: 'Contract/getChainCodeHistoryTotalDocs',
      payload: params,
    });
  }
  // 获取合约列表
  getChainCodeHistory = current => {
    const { pageNum, pageSize } = this.state;
    const { location: { query: { chainCodeName = '', channelName = '' } } } = this.props;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      ascend: false,
      from: Number(moment(new Date()).format('x')),
      chainCodeName,
      networkName: this.props.User.networkName,
      channelName
    }
    this.props.dispatch({
      type: 'Contract/getChainCodeHistory',
      payload: params
    })
  }

  // 翻页
  onPageChange = pageInfo => {
    this.setState({ pageNum: pageInfo.current })
    this.getChainCodeHistory(pageInfo.current)
  }


  // 查看合约详情
  onClickDetail = record => {
    history.push({
      pathname: `/about/contract/myContract/contractHistoryDetail`,
      query: {
        version: record.version,
        chainCodeId: record._id,
        chainCodeName: record.chainCodeName,
        channelName: record.channelName
      },
    })
  }

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum } = this.state;
    const { curContractDetail, curContractVersionList, curContractVersionTotal } = this.props.Contract;
    const contractInfoList = [
      {
        label: '合约名称',
        value: curContractDetail.chainCodeName
      },
      {
        label: '所属通道',
        value: curContractDetail.channelName
      },
      {
        label: '合约语言类型',
        value: curContractDetail.chainCodeLanguage
      },
      {
        label: '当前版本',
        value: curContractDetail.version
      },
      {
        label: '创建组织',
        value: curContractDetail.createOrgName
      },
      {
        label: '创建时间',
        value: curContractDetail.createdAt ? moment(curContractDetail.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -'
      },
      {
        label: '背书组织',
        fullRow: true,
        value: JSON.stringify(curContractDetail.endorsementOrgName)
      },
      {
        label: '合约描述',
        fullRow: true,
        value: curContractDetail.chainCodeDesc
      },
    ]
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <Spin spinning={qryLoading}>
          <div className='page-content'>
            <DetailCard cardTitle='合约信息' detailList={contractInfoList} columnsNum={3} boxShadow='0 4px 12px 0 rgba(0,0,0,.05)' />
            <Table
              rowKey='id'
              columns={this.columns}
              className='page-content-shadow'
              dataSource={curContractVersionList}
              onChange={this.onPageChange}
              pagination={{ pageSize, total: curContractVersionTotal, current: pageNum, position: ['bottomCenter'] }}
            />
          </div>
        </Spin>
      </div >
    )
  }
}

export default connect(({User, Contract, loading }) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/getDetailOfChainCode'] || loading.effects['Contract/getChainCodeHistory']
}))(ContractDetail);
