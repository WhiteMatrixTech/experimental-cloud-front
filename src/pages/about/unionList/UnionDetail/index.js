import React, { Component } from 'react';
import { Radio, Table, Space } from 'antd';
import { connect } from "dva";
import { history } from 'umi';
import moment from 'moment';
import { StatisticsCard, LeagueBar, NetworkTopo, Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import style from './index.less';
import peer from 'assets/images/dashboard/icon-peer.png';
import msp from 'assets/images/dashboard/icon-msp.png';
import chaincode from 'assets/images/dashboard/icon-chaincode.png';
import block from 'assets/images/dashboard/icon-block.png';
import transcation from 'assets/images/dashboard/icon-transcation.png';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/unionList')
breadCrumbItem.push({
  menuName: "通道详情",
  menuHref: `/`,
})

const statisticsList = [
  { label: '组织', num: '17' },
  { label: '节点', num: '2' },
  { label: '区块', num: '7' },
  { label: '交易', num: '484' },
  { label: '合约', num: '527' }
]
const imgList = [msp, peer, block, transcation, chaincode]

class UnionDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      barType: 'seven'
    }
    this.blockColums = [
      {
        title: '区块HASH',
        dataIndex: 'blockHash',
        key: 'blockHash',
        ellipsis: true,
        // width: (userType === 2) ? '20%' : '17%'
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '交易数量',
        dataIndex: 'txCount',
        key: 'txCount',
      },
      {
        title: '生成时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => this.onClickBlockDetail(record)}>详情</a>
          </Space>
        ),
      },
    ]
    this.transactionColumns = [
      {
        title: '交易ID',
        dataIndex: 'txId',
        key: 'txId',
        ellipsis: true,
        width: '17%'
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '交易组织',
        dataIndex: 'txEndorseMsp',
        key: 'txEndorseMsp',
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
      },
      {
        title: '生成时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => this.onClickTransactionDetail(record)}>详情</a>
          </Space>
        ),
      },
    ]
  }

  componentDidMount() {
    // this.getBlockList()
    // this.getTransactionList()
  }

  onChangeBarType = e => {
    this.setState({ barType: e.target.value })
  }

  // 获取交易列表
  getTransactionList = () => {
    const params = {
      companyId: 1,
      limit: 1,
      paginator: 0
    }
    this.props.dispatch({
      type: 'Dashboard/getTransactionList',
      payload: params
    })
  }

  // 查看交易详情
  onClickTransactionDetail = record => {
    history.push({
      pathname: `/about/channel/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    })
  }

  // 获取区块列表
  getBlockList = () => {
    const params = {
      blockHash: '',
      limit: 1,
      paginator: 0
    }
    this.props.dispatch({
      type: 'Block/getBlockList',
      payload: params
    })
  }

  // 查看区块详情
  onClickBlockDetail = record => {
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    })
  }

  render() {
    const { qryBlockLoading, qryTransactionLoading } = this.props;
    const { blockList, transactionList } = this.props.Dashboard
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <StatisticsCard statisticsList={statisticsList} imgList={imgList} />
          <div className={style['network-topo-wrapper']}>
            <div className={style['network-topo-title']}>网络拓扑图</div>
            <NetworkTopo />
          </div>
          <div className={`${style['network-topo-bar-wrapper']} page-content-shadow`}>
            <div className={style['network-topo-bar-header']}>
              <div className={style.title}>交易时间表</div>
              <Radio.Group value={this.state.barType} onChange={this.onChangeBarType}>
                <Radio.Button value='seven' >7天</Radio.Button>
                <Radio.Button value='thirty' >30天</Radio.Button>
              </Radio.Group>
            </div>
            <LeagueBar type={this.state.barType} />
          </div>
          <Table
            rowKey='_id'
            columns={this.blockColums}
            loading={qryBlockLoading}
            dataSource={blockList}
            className='page-content-shadow'
          />
          <Table
            rowKey='_id'
            columns={this.transactionColumns}
            loading={qryTransactionLoading}
            dataSource={transactionList}
            className='page-content-shadow'
          />
        </div>
      </div>
    );
  }
}

export default connect(({ Layout, Dashboard, loading }) => ({
  Layout,
  Dashboard,
  qryBlockLoading: loading.effects['Dashboard/getBlockList'],
  qryTransactionLoading: loading.effects['Dashboard/getTransactionList'],
}))(UnionDetail)
