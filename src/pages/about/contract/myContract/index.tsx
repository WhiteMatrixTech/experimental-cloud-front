import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { request } from '@/utils/request';
import { saveAs } from 'file-saver';
import { Table, Space, Badge, Modal, Button, message, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Breadcrumb } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import EditContract from './components/EditContract';
import InvokeContract from './components/InvokeContract';
import ApproveContract from './components/ApproveContract';
import baseConfig from '@/utils/config';
import { Roles } from '@/utils/roles';
import {
  chainCodeStatusInfo,
  ChainCodeStatus,
  VerifyChainCodeStatus,
  VerifyStatusList,
  UpdateStatusList,
} from './_config';
import { ConnectState } from '@/models/connect';
import { TableColumnsAttr } from '@/utils/types';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem.push({
  menuName: '合约列表',
  menuHref: `/`,
});

const pageSize = baseConfig.pageSize;
export interface MyContractProps {
  User: ConnectState['User'];
  qryLoading: boolean;
  Contract: ConnectState['Contract'];
  dispatch: Dispatch;
}
function MyContract(props: MyContractProps) {
  const { networkName, userRole } = props.User;
  const { qryLoading = false } = props;
  const [pageNum, setPageNum] = useState(1);
  const { myContractList, myContractTotal } = props.Contract;
  const [chainCodeName, setChainCodeName] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false); // 新增、修改、升级合约弹窗是否可见
  const [invokeVisible, setInvokeVisible] = useState(false); // 合约调用弹窗 是否可见
  const [approveVisible, setApproveVisible] = useState(false); // 合约审批弹窗 是否可见
  const [operateType, setOperateType] = useState('new'); //打开弹窗类型--新增、修改、升级
  const [editParams, setEditParams] = useState({}); //修改、升级合约的信息
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    props.dispatch({
      type: 'Contract/checkOrgInUse',
      payload: { networkName },
    });
    getChainCodeList();
  }, [pageNum]);

  // 获取合约列表
  const getChainCodeList = () => {
    const { networkName } = props.User;
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
    };
    props.dispatch({
      type: 'Contract/getChainCodeTotal',
      payload: { networkName },
    });
    props.dispatch({
      type: 'Contract/getChainCodeList',
      payload: params,
    });
  };

  // 按合约名称查找
  const onSearch = (value, event) => {
    // if (event.type && (event.type === 'click' || event.type === 'keydown')) {
    //   this.setState({ pageNum: 1, chainCodeName: value || '' })
    //   this.getPageListOfChainCode(1, value)
    // }
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = (record: any, type: any) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'install':
        tipTitle = '安装';
        callback = () => installContract(record);
        break;
      case 'approve':
        tipTitle = '发布';
        callback = () => onClickRelease(record);
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
  const onCloseModal = (callback: any) => {
    setEditModalVisible(false);
    setInvokeVisible(false);
    setApproveVisible(false);
    props.dispatch({
      type: 'Contract/common',
      payload: { invokeResult: null },
    });
    if (callback) {
      setTimeout(getChainCodeList, 500);
    }
  };

  // 点击新增合约
  const onClickAdd = () => {
    const { userOrgInuse } = props.Contract;
    if (!userOrgInuse) {
      message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
      return;
    }
    setOperateType('new');
    setEditModalVisible(true);
  };

  // 点击修改合约
  const onClickModify = () => {
    setOperateType('modify');
    setEditModalVisible(true);
  };

  const onDownLoadContract = (record: any) => {
    const { networkName } = props.User;
    // token校验
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken,
    };

    setDownloading(true);

    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/chainCodes/downLoadChainCode/${record.channelId}?chainCodeName=${record.chainCodeName}`,
      {
        headers,
        mode: 'cors',
        method: 'GET',
        responseType: 'blob',
      },
    )
      .then((res: BlobPart) => {
        setDownloading(false);
        const file = new File([res], `${record.chainCodeName}.tar.gz`, { type: 'application/tar+gzip' });
        saveAs(file);
      })
      .catch(() => {
        setDownloading(false);
      });
  };

  const onClickApprove = (record: any) => {
    setApproveVisible(true);
    setEditModalVisible(record);
  };

  // 点击调用合约
  const onClickInvoke = (record: any) => {
    setInvokeVisible(true);
    setEditModalVisible(record);
  };

  // 升级合约
  const onClickUpgrade = (record: any) => {
    setOperateType('upgrade');
    setEditModalVisible(true);
    setEditParams(record);
  };

  // 发布合约
  const onClickRelease = async (record: any) => {
    const params = {
      networkName,
      channelId: record.channelId,
      chainCodeName: record.chainCodeName,
      endorsementPolicy: { ...record.endorsementPolicy },
    };
    const res = await props.dispatch({
      type: 'Contract/releaseContract',
      payload: params,
    });
    if (res) {
      getChainCodeList();
    }
  };

  // 安装合约
  const installContract = async (record: any) => {
    const res = await props.dispatch({
      type: 'Contract/installContract',
      payload: {
        channelId: record.channelId,
        chainCodeName: record.chainCodeName,
        networkName: props.User.networkName,
      },
    });
    if (res) {
      getChainCodeList();
    }
  };

  // 查看合约详情
  const onClickDetail = (record: any) => {
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

  const columns: TableColumnsAttr[] = [
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
      width: '20%',
      render: (_, record) => (
        // 非当前合约组织成员不可操作
        <Space size="small">
          {record.canDownload && <a onClick={() => onDownLoadContract(record)}>下载合约</a>}
          {VerifyStatusList.includes(record.chainCodeStatus) && userRole === Roles.NetworkAdmin && (
            <a onClick={() => onClickApprove(record)}>审核</a>
          )}
          {record.chainCodeStatus === ChainCodeStatus.Verified && record.createdAt && (
            <a onClick={() => onClickToConfirm(record, 'install')}>安装</a>
          )}
          {record.chainCodeStatus === ChainCodeStatus.Installed && record.createdAt && (
            <a onClick={() => onClickToConfirm(record, 'approve')}>发布</a>
          )}
          {UpdateStatusList.includes(record.chainCodeStatus) && record.createdAt && (
            <a onClick={() => onClickUpgrade(record)}>升级</a>
          )}
          {record.chainCodeStatus === ChainCodeStatus.Approved && record.canInvoke && (
            <a onClick={() => onClickInvoke(record)}>调用</a>
          )}
          {record.createdAt || record.createOrgName ? (
            <a onClick={() => onClickDetail(record)}>详情</a>
          ) : (
            <a className="a-forbidden-style">详情</a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <Spin spinning={downloading} tip="下载中...">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={onClickAdd}>
              创建合约
            </Button>
          </div>
          <Table
            rowKey={(record: any) => `${record.chainCodeName}-${record.channelId}`}
            columns={columns}
            loading={qryLoading}
            dataSource={myContractList}
            onChange={onPageChange}
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
            onCancel={onCloseModal}
            editParams={editParams}
          />
        )}
        {invokeVisible && <InvokeContract visible={invokeVisible} onCancel={onCloseModal} editParams={editParams} />}
        {approveVisible && <ApproveContract visible={approveVisible} onCancel={onCloseModal} editParams={editParams} />}
      </Spin>
    </div>
  );
}

export default connect(({ User, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/getPageListOfChainCode'],
}))(MyContract);
