/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Table, Space, Badge, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import EditContract from './components/EditContract';
import InvokeContract from './components/InvokeContract';
import baseConfig from 'utils/config';
import { chainCodeStatusInfo, ChainCodeStatus } from './_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem.push({
  menuName: '我的合约',
  menuHref: `/`,
});

class MyContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,
      chainCodeName: '', // 合约名称搜索关键字
      editModalVisible: false, // 新增、修改、升级合约弹窗是否可见
      invokeVisible: false, // 合约调用弹窗 是否可见
      operateType: 'new', // 打开弹窗类型--新增、修改、升级
      editParams: {}, // 修改、升级合约的信息
    };
  }

  componentDidMount() {
    this.getChainCodeList();
  }

  // 获取合约列表
  getChainCodeList = (current, searchChainCodeName) => {
    const { pageNum, pageSize, chainCodeName } = this.state;
    const { networkName } = this.props.User;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
    };
    // 判断输入搜索合约名称
    if (searchChainCodeName || chainCodeName) {
      params.chainCodeName = searchChainCodeName || chainCodeName;
    }
    this.props.dispatch({
      type: 'Contract/getChainCodeTotal',
      payload: { networkName },
    });
    this.props.dispatch({
      type: 'Contract/getChainCodeList',
      payload: params,
    });
  };

  // 按合约名称查找
  onSearch = (value, event) => {
    // if (event.type && (event.type === 'click' || event.type === 'keydown')) {
    //   this.setState({ pageNum: 1, chainCodeName: value || '' })
    //   this.getPageListOfChainCode(1, value)
    // }
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
    this.getChainCodeList(pageInfo.current, '');
  };

  // 点击操作按钮, 进行二次确认
  onClickToConfirm = (record, type) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'agree':
        tipTitle = '通过';
        callback = () => this.approvalContract(record, 4);
        break;
      case 'reject':
        tipTitle = '驳回';
        callback = () => this.approvalContract(record, 2);
        break;
      case 'approve':
        tipTitle = '发布';
        callback = () => this.onClickRelease(record);
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要${tipTitle}合约 【${record.chainCodeName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  // 关闭 新增&修改&升级合约 弹窗
  onCloseModal = (callback) => {
    this.setState({ editModalVisible: false, invokeVisible: false });
    this.props.dispatch({
      type: 'Contract/common',
      payload: { invokeResult: null },
    });
    if (callback) {
      this.getChainCodeList();
    }
  };

  // 点击新增合约
  onClickAdd = () => {
    this.setState({ operateType: 'new', editModalVisible: true });
  };

  // 点击修改合约
  onClickModify = () => {
    this.setState({ operateType: 'modify', editModalVisible: true });
  };

  // 点击调用合约
  onClickInvoke = (record) => {
    this.setState({ invokeVisible: true, editParams: record });
  };

  // 升级合约
  onClickUpgrade = (record) => {
    this.setState({ operateType: 'upgrade', editModalVisible: true, editParams: record });
  };

  // 发布合约
  onClickRelease = async (record) => {
    const { networkName } = this.props.User;
    const params = {
      networkName,
      channelId: record.channelId,
      chainCodeName: record.chainCodeName,
      endorsementPolicy: { ...record.endorsementPolicy },
    };
    const res = await this.props.dispatch({
      type: 'Contract/releaseContract',
      payload: params,
    });
    if (res) {
      this.getChainCodeList();
    }
  };

  // 通过 & 驳回 合约
  approvalContract = (record, chainCodeStatus) => {
    this.props
      .dispatch({
        type: 'Contract/setChainCodeApproveReject',
        payload: {
          networkName: this.props.User.networkName,
          chainCodeStatus,
          chainCodeId: record._id,
        },
      })
      .then((res) => {
        if (res) {
          this.getChainCodeList();
        }
      });
  };

  // 查看合约详情
  onClickDetail = (record) => {
    history.push({
      pathname: `/about/contract/myContract/contractDetail`,
      query: {
        chainCodeId: record._id,
        chainCodeName: record.chainCodeName,
        channelName: record.channelName,
      },
      state: record,
    });
  };

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum, editModalVisible, invokeVisible, operateType, editParams } = this.state;
    const { myContractList, myContractTotal } = this.props.Contract;
    const columns = [
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
        dataIndex: 'channelId',
        key: 'channelId',
      },
      {
        title: '所属组织',
        dataIndex: 'createOrgName',
        key: 'createOrgName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '状态',
        dataIndex: 'chainCodeStatus',
        key: 'chainCodeStatus',
        render: (text) =>
          text ? (
            <Badge color={chainCodeStatusInfo[text].color} text={chainCodeStatusInfo[text].text} style={{ color: chainCodeStatusInfo[text].color }} />
          ) : (
            ''
          ),
      },
      {
        title: '操作',
        key: 'action',
        width: '18%',
        render: (text, record) => (
          <Space size="small">
            {/* <a onClick={() => this.onDownloadContract(record)}>下载</a> */}
            {/* {record.chainCodeStatus === 2 && <a onClick={() => this.onClickModify(record)}>修改</a>} */}
            {record.chainCodeStatus === ChainCodeStatus.Installed && (
              // (userRole === Roles.NetworkAdmin) &&
              <a onClick={() => this.onClickToConfirm(record, 'approve')}>发布</a>
            )}
            {record.chainCodeStatus === ChainCodeStatus.Approved && <a onClick={() => this.onClickUpgrade(record)}>升级</a>}
            {record.chainCodeStatus === ChainCodeStatus.Approved && <a onClick={() => this.onClickInvoke(record)}>调用</a>}
            {/* {(record.chainCodeStatus === 1 || record.chainCodeStatus === 3) &&
              <>
                <a onClick={() => this.onClickToConfirm(record, 'agree')}>通过</a>
                <a onClick={() => this.onClickToConfirm(record, 'reject')}>驳回</a>
              </>
            } */}
            <a onClick={() => this.onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ];

    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={this.onClickAdd}>
              创建合约
            </Button>
          </div>
          <Table
            rowKey="_id"
            columns={columns}
            loading={qryLoading}
            dataSource={myContractList}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: myContractTotal, current: pageNum, showSizeChanger: false, position: ['bottomCenter'] }}
          />
        </div>
        {editModalVisible && <EditContract visible={editModalVisible} operateType={operateType} onCancel={this.onCloseModal} editParams={editParams} />}
        {invokeVisible && <InvokeContract visible={invokeVisible} onCancel={this.onCloseModal} editParams={editParams} />}
      </div>
    );
  }
}

export default connect(({ User, Contract, loading }) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/getPageListOfChainCode'],
}))(MyContract);
