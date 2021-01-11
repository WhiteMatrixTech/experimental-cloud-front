import React, { Component } from 'react';
import { Table, Space, Col, Row } from 'antd';
import { connect } from "dva";
import { history } from 'umi';
import moment from 'moment';
import { StatisticsCard, Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { unionStatus } from '../_config';
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
    this.getStatisInfo();
    this.getBlockList();
    this.getTransactionList();
  }

  onChangeBarType = e => {
    this.setState({ barType: e.target.value })
  }

  // 获取汇总信息
  getStatisInfo = () => {
    const { dispatch, location, User } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Union/getStatisInfo',
      payload: params,
    });
  }

  // 获取交易列表
  getTransactionList = () => {
    const { dispatch, location, User } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      offset: 0,
      limit: 6,
      ascend: false,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Union/getTransactionsListOfUnion',
      payload: params,
    });
  }

  // 查看交易详情
  onClickTransactionDetail = record => {
    this.props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/transactions' }
    });
    history.push({
      pathname: `/about/transactions/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    });
  }

  // 获取区块列表和总数
  getBlockList = () => {
    const { dispatch, location, User } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      offset: 0,
      limit: 6,
      ascend: false,
      channelId: location?.state?.channelId
    };
    dispatch({
      type: 'Union/getBlockListOfUnion',
      payload: params,
    });
  }

  // 查看区块详情
  onClickBlockDetail = record => {
    this.props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/block' }
    });
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    });
  }

  render() {
    const { location, qryBlockLoading, qryTransactionLoading } = this.props;
    const {
      blockListOfUnion,
      transactionListOfUnion,
      orgTotalOfUnion,
      peerTotalOfUnion,
      blockTotalOfUnion,
      contractListOfUnion,
      transactionTotalOfUnion
    } = this.props.Union;
    const statisticsList = [
      { label: '组织', num: orgTotalOfUnion },
      { label: '节点', num: peerTotalOfUnion },
      { label: '区块', num: blockTotalOfUnion },
      { label: '交易', num: contractListOfUnion },
      { label: '合约', num: transactionTotalOfUnion }
    ]
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <div className={style['league-basic-info']}>
            <Row  >
              <Col span={8}>
                <label>通道ID：</label>
                <span>{location?.state?._id}</span>
              </Col>
              <Col span={8} >
                <label>通道名称：</label>
                <span>{location?.state?.channelId}</span>
              </Col>
              <Col span={8} >
                <label>通道别名：</label>
                <span>{location?.state?.channelAliasName}</span>
              </Col>
              <Col span={8} >
                <label>创建时间：</label>
                <span>{location?.state?.createdAt ? moment(location?.state?.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
              </Col>
              <Col span={8} >
                <label>状态：</label>
                <span>{location?.state?.channelStatus ? unionStatus[location?.state?.channelStatus].text : ''}</span>
              </Col>
            </Row>
          </div>
          <StatisticsCard statisticsList={statisticsList} imgList={imgList} />
          {/* <div className={style['network-topo-wrapper']}>
            <div className={style['network-topo-title']}>网络拓扑图</div>
            <NetworkTopo />
          </div> */}
          {/* <div className={`${style['network-topo-bar-wrapper']} page-content-shadow`}>
            <div className={style['network-topo-bar-header']}>
              <div className={style.title}>交易时间表</div>
              <Radio.Group value={this.state.barType} onChange={this.onChangeBarType}>
                <Radio.Button value='seven' >7天</Radio.Button>
                <Radio.Button value='thirty' >30天</Radio.Button>
              </Radio.Group>
            </div>
            <LeagueBar type={this.state.barType} />
          </div> */}
          <Table
            rowKey='_id'
            columns={this.blockColums}
            loading={qryBlockLoading}
            dataSource={blockListOfUnion}
            className='page-content-shadow'
          />
          <Table
            rowKey='_id'
            columns={this.transactionColumns}
            loading={qryTransactionLoading}
            dataSource={transactionListOfUnion}
            className='page-content-shadow'
          />
        </div>
      </div>
    );
  }
}

export default connect(({ Layout, Union, User, loading }) => ({
  Layout,
  Union,
  User,
  qryBlockLoading: loading.effects['Union/getBlockListOfUnion'],
  qryTransactionLoading: loading.effects['Union/getTransactionList'],
}))(UnionDetail)
