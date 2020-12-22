import React, { Component } from 'react';
import { connect } from "dva";
import { history } from 'umi';
import { Table, Space, Badge, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import EditContract from './components/EditContract';
import baseConfig from 'utils/config';
import { chainCodeStatus } from './_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false)
breadCrumbItem.push({
  menuName: "我的合约",
  menuHref: `/`,
})

class MyContract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,
      chainCodeName: '', // 合约名称搜索关键字
      editModalVisible: false, // 新增、修改、升级合约弹窗是否可见
      operateType: 'new', // 打开弹窗类型--新增、修改、升级
    }
    this.columns = [
      {
        title: '合约ID',
        dataIndex: '_id',
        key: '_id',
        ellipsis: true,
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '创建组织',
        dataIndex: 'createOrgName',
        key: 'createOrgName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '状态',
        dataIndex: 'chainCodeStatus',
        key: 'chainCodeStatus',
        render: text => text ? <Badge color={chainCodeStatus[text].color} text={chainCodeStatus[text].text} style={{ color: chainCodeStatus[text].color }} /> : ''
      },
      {
        title: '操作',
        key: 'action',
        width: '18%',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => this.onDownloadContract(record)}>下载</a>
            {record.chainCodeStatus === 2 && <a onClick={() => this.onClickModify(record)}>修改</a>}
            {(record.chainCodeStatus === 4 || record.chainCodeStatus === 6) && <a onClick={() => this.onClickInstall(record)}>安装</a>}
            {(record.chainCodeStatus === 5 || record.chainCodeStatus === 8) && <a onClick={() => this.onClickRelease(record)}>发布</a>}
            {record.chainCodeStatus === 7 && <a onClick={() => this.onClickUpgrade(record)}>升级</a>}
            {(record.chainCodeStatus === 1 || record.chainCodeStatus === 3) &&
              <>
                <a onClick={() => this.onClickToConfirm(record, 'agree')}>通过</a>
                <a onClick={() => this.onClickToConfirm(record, 'reject')}>驳回</a>
              </>
            }
            <a onClick={() => this.onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ]
  }

  componentDidMount() {
    this.getPageListOfChainCode();
    this.getPageTotalDocsOfChainCode();
  }

  // 获取合约列表
  getPageListOfChainCode = (current, seachChainCodeName) => {
    const { pageNum, pageSize, chainCodeName } = this.state;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
    }
    // 判断输入搜索合约名称
    if (seachChainCodeName || chainCodeName) {
      params.chainCodeName = seachChainCodeName || chainCodeName
    }
    // 判断盟主身份存在leagueId
    if (this.leagueId) {
      params.leagueId = this.leagueId
    }
    // 判断企业身份存在companyId
    if (this.companyId) {
      params.companyId = this.companyId
    }
    this.props.dispatch({
      type: 'Contract/getPageListOfChainCode',
      payload: params
    })
  }
  //获取合约列表的totalDocs
  getPageTotalDocsOfChainCode = () => {
    this.props.dispatch({
      type: 'Contract/getPageTotalDocsOfChainCode',
      payload: '',
    })
  }

  // 按合约名称查找
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, chainCodeName: value || '' })
      this.getPageListOfChainCode(1, value)
    }
  }

  // 翻页
  onPageChange = pageInfo => {
    this.setState({ pageNum: pageInfo.current })
    this.getPageListOfChainCode(pageInfo.current, '')
  }

  // 点击操作按钮, 进行二次确认
  onClickToConfirm = (record, type) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'agree':
        tipTitle = '通过'
        callback = () => this.approvalContract(record, 4)
        break
      case 'reject':
        tipTitle = '驳回'
        callback = () => this.approvalContract(record, 2)
        break
      default:
        break
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要${tipTitle}合约 【${record.chainCodeName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback
    });
  }

  // 关闭 新增&修改&升级合约 弹窗
  onCloseModal = () => {
    this.setState({ editModalVisible: false })
  }

  // 点击新增合约
  onClickAdd = () => {
    this.setState({ operateType: 'new', editModalVisible: true })
  }

  // 点击修改合约
  onClickModify = () => {
    this.setState({ operateType: 'modify', editModalVisible: true })
  }

  // 下载合约
  onDownloadContract = () => {

  }

  // 安装合约
  onClickInstall = () => {

  }

  // 发布合约
  onClickRelease = () => {

  }

  // 升级合约
  onClickUpgrade = () => {
    this.setState({ operateType: 'upgrate', editModalVisible: true })
  }

  // 通过 & 驳回 合约
  approvalContract = (record, chainCodeStatus) => {
    this.props.dispatch({
      type: 'Contract/setChainCodeApproveReject',
      payload: {
        chainCodeStatus,
        chainCodeId: record._id
      }
    }).then(res => {
      if (res) {
        this.getPageListOfChainCode()
      }
    })
  }

  // 查看合约详情
  onClickDetail = record => {
    history.push({
      pathname: `/about/contract/myContract/contractDetail`,
      query: {
        chainCodeId: record._id,
        chainCodeName: record.chainCodeName,
        channelName: record.channelName
      },
    })
  }

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum, editModalVisible, operateType } = this.state;
    const { myContractList, myContractTotal } = this.props.Contract
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content page-content-shadow'>
          <SearchBar placeholder='输入合约名称' onSearch={this.onSearch} btnName='创建合约' onClickBtn={this.onClickAdd} />
          <Table
            rowKey='_id'
            columns={this.columns}
            loading={qryLoading}
            dataSource={myContractList}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: myContractTotal, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
        {editModalVisible && <EditContract visible={editModalVisible} operateType={operateType} onCancel={this.onCloseModal} />}
      </div >
    )
  }
}

export default connect(({ Contract, loading }) => ({
  Contract,
  qryLoading: loading.effects['Contract/getPageListOfChainCode']
}))(MyContract);

