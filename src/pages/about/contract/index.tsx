/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { ChainCodeSchema, Dispatch, history } from 'umi';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Table, Space, Badge, Modal, Button, message, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Breadcrumb } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import EditContract from './components/EditContract';
import InvokeContract from './components/InvokeContract';
import ApproveContract from './components/ApproveContract';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { chainCodeStatusInfo, ChainCodeStatus, VerifyStatusList, UpdateStatusList } from './_config';
import { ConnectState } from '~/models/connect';
import { TableColumnsAttr } from '~/utils/types';
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);

const pageSize = baseConfig.pageSize;
export interface MyContractProps {
  User: ConnectState['User'];
  qryLoading: boolean;
  Contract: ConnectState['Contract'];
  dispatch: Dispatch;
}

const MyContract: React.FC<MyContractProps> = (props) => {
  const { networkName, userRole } = props.User;
  const { qryLoading = false, dispatch } = props;
  const [pageNum, setPageNum] = useState(1);
  const { myContractList, myContractTotal } = props.Contract;
  const [editModalVisible, setEditModalVisible] = useState(false); // 新增、修改、升级合约弹窗是否可见
  const [invokeVisible, setInvokeVisible] = useState(false); // 合约调用弹窗 是否可见
  const [approveVisible, setApproveVisible] = useState(false); // 合约审批弹窗 是否可见
  const [operateType, setOperateType] = useState('new'); //打开弹窗类型--新增、修改、升级
  const [editParams, setEditParams] = useState<ChainCodeSchema>(); //修改、升级合约的信息
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    dispatch({
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
    dispatch({
      type: 'Contract/getChainCodeTotal',
      payload: { networkName },
    });
    dispatch({
      type: 'Contract/getChainCodeList',
      payload: params,
    });
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
  const onCloseModal = (callback?: any) => {
    setEditModalVisible(false);
    setInvokeVisible(false);
    setApproveVisible(false);
    dispatch({
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

  const onDownLoadContract = (record: ChainCodeSchema) => {
    const { networkName } = props.User;
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    const headers = {
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
      .then((res: any) => {
        setDownloading(false);
        const file = new File([res], `${record.chainCodeName}.tar.gz`, { type: 'application/tar+gzip' });
        saveAs(file);
      })
      .catch(() => {
        setDownloading(false);
      });
  };

  const onClickApprove = (record: ChainCodeSchema) => {
    setApproveVisible(true);
    setEditParams(record);
  };

  // 点击调用合约
  const onClickInvoke = (record: ChainCodeSchema) => {
    setInvokeVisible(true);
    setEditParams(record);
  };

  // 升级合约
  const onClickUpgrade = (record: ChainCodeSchema) => {
    setOperateType('upgrade');
    setEditModalVisible(true);
    setEditParams(record);
  };

  // 发布合约
  const onClickRelease = async (record: ChainCodeSchema) => {
    const params = {
      networkName,
      channelId: record.channelId,
      chainCodeName: record.chainCodeName,
      endorsementPolicy: { ...record.endorsementPolicy },
    };
    const res = await dispatch({
      type: 'Contract/releaseContract',
      payload: params,
    });
    if (res) {
      getChainCodeList();
    }
  };

  // 安装合约
  const installContract = async (record: ChainCodeSchema) => {
    const res = await dispatch({
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
  const onClickDetail = (record: ChainCodeSchema) => {
    history.push({
      pathname: `/about/contract/contractDetail`,
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
};

export default connect(({ User, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/getPageListOfChainCode'],
}))(MyContract);
