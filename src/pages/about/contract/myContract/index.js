/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Table, Space, Badge, Modal, Button, message, Spin } from 'antd';
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
  menuName: '合约列表',
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
      downloading: false,
    };
  }

  componentDidMount() {
    const { networkName } = this.props.User;
    this.props.dispatch({
      type: 'Contract/checkOrgInUse',
      payload: { networkName },
    });
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
    const { userOrgInuse } = this.props.Contract;
    if (!userOrgInuse) {
      message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
      return;
    }
    this.setState({ operateType: 'new', editModalVisible: true });
  };

  // 点击修改合约
  onClickModify = () => {
    this.setState({ operateType: 'modify', editModalVisible: true });
  };

  onDownLoadContract = (record) => {
    const { networkName } = this.props.User;
    // token校验
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken,
    };

    this.setState({ downloading: true });

    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/chainCodes/downLoadChainCode/${record.channelId}?chainCodeName=${record.chainCodeName}`,
      {
        headers,
        mode: 'cors',
        method: 'GET',
        responseType: 'blob',
      },
    )
      .then((res) => {
        this.setState({ downloading: false });
        const file = new File([res], `${record.chainCodeName}.tar.gz`, { type: 'application/tar+gzip' });
        saveAs(file);
      })
      .catch((error) => {
        this.setState({ downloading: false });
      });
  };

  // 点击调用合约
  onClickInvoke = (record) => {
    this.setState({ invokeVisible: true, editParams: record });
  };

  // 升级合约
  onClickUpgrade = (record) => {
    this.setState({
      operateType: 'upgrade',
      editModalVisible: true,
      editParams: record,
    });
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
    const { pageSize, pageNum, editModalVisible, invokeVisible, operateType, editParams, downloading } = this.state;
    const { myContractList, myContractTotal } = this.props.Contract;
    const columns = [
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
        render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
      },
      {
        title: '所属通道',
        dataIndex: 'channelId',
        key: 'channelId',
        render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
      },
      {
        title: '所属组织',
        dataIndex: 'createOrgName',
        key: 'createOrgName',
        render: (text) => text || <span className="a-forbidden-style">信息访问受限</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) =>
          text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : <span className="a-forbidden-style">信息访问受限</span>,
      },
      {
        title: '状态',
        dataIndex: 'chainCodeStatus',
        key: 'chainCodeStatus',
        render: (text) =>
          text ? (
            <Badge
              color={chainCodeStatusInfo[text].color}
              text={chainCodeStatusInfo[text].text}
              style={{ color: chainCodeStatusInfo[text].color }}
            />
          ) : (
            <span className="a-forbidden-style">信息访问受限</span>
          ),
      },
      {
        title: '操作',
        key: 'action',
        width: '18%',
        render: (_, record) => (
          // 非当前合约组织成员不可操作
          <Space size="small">
            <a onClick={() => this.onDownLoadContract(record)}>下载证书</a>
            {record.chainCodeStatus === ChainCodeStatus.Installed && record.createdAt && (
              <a onClick={() => this.onClickToConfirm(record, 'approve')}>发布</a>
            )}
            {record.chainCodeStatus === ChainCodeStatus.Approved && record.createdAt && (
              <a onClick={() => this.onClickUpgrade(record)}>升级</a>
            )}
            {record.chainCodeStatus === ChainCodeStatus.Approved && record.createdAt && (
              <a onClick={() => this.onClickInvoke(record)}>调用</a>
            )}
            {record.createdAt || record.createOrgName ? (
              <a onClick={() => this.onClickDetail(record)}>详情</a>
            ) : (
              <a className="a-forbidden-style">详情</a>
            )}
          </Space>
        ),
      },
    ];

    return (
      <div className="page-wrapper">
        <Spin spinning={downloading} tip="下载中..."></Spin>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={this.onClickAdd}>
              创建合约
            </Button>
          </div>
          <Table
            rowKey="chainCodeName"
            columns={columns}
            loading={qryLoading}
            dataSource={myContractList}
            onChange={this.onPageChange}
            pagination={{
              pageSize,
              total: myContractTotal,
              current: pageNum,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>
        {editModalVisible && (
          <EditContract
            visible={editModalVisible}
            operateType={operateType}
            onCancel={this.onCloseModal}
            editParams={editParams}
          />
        )}
        {invokeVisible && (
          <InvokeContract visible={invokeVisible} onCancel={this.onCloseModal} editParams={editParams} />
        )}
      </div>
    );
  }
}

export default connect(({ User, Contract, loading }) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/getPageListOfChainCode'],
}))(MyContract);
