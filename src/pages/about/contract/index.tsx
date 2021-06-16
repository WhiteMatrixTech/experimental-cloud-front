import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { ChainCodeSchema, Dispatch, history } from 'umi';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Table, Space, Badge, Modal, Button, message, Spin, Divider } from 'antd';
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
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

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

  // 获取合约列表
  const getChainCodeList = useCallback(() => {
    const { networkName } = props.User;
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false
    };
    dispatch({
      type: 'Contract/getChainCodeTotal',
      payload: { networkName }
    });
    dispatch({
      type: 'Contract/getChainCodeList',
      payload: params
    });
  }, [dispatch, pageNum, props.User]);

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
        tipTitle = Intl.formatMessage('BASS_CONTRACT_INSTALL');
        callback = () => installContract(record);
        break;
      case 'approve':
        tipTitle = Intl.formatMessage('BASS_CONTRACT_PUBLISH');
        callback = () => onClickRelease(record);
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: Intl.formatMessage('BASS_CONFIRM_CONTRACT_MODAL_CONTENT', {
        tipTitle: tipTitle,
        chainCodeName: record.chainCodeName
      }),
      okText: Intl.formatMessage('BASS_COMMON_CONFIRM'),
      cancelText: Intl.formatMessage('BASS_COMMON_CANCEL'),
      onOk: callback
    });
  };

  // 关闭 新增&修改&升级合约 弹窗
  const onCloseModal = (callback?: any) => {
    setEditModalVisible(false);
    setInvokeVisible(false);
    setApproveVisible(false);
    dispatch({
      type: 'Contract/common',
      payload: { invokeResult: null }
    });
    if (callback) {
      setTimeout(getChainCodeList, 500);
    }
  };

  // 点击新增合约
  const onClickAdd = () => {
    const { userOrgInuse } = props.Contract;
    if (!userOrgInuse) {
      message.warn(Intl.formatMessage('BASS_CONTRACT_MESSAGE_WARN_ADD_CONTRACT'));
      return;
    }
    setOperateType('new');
    setEditModalVisible(true);
  };

  const onDownLoadContract = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChainCodeSchema) => {
    e.preventDefault();
    const { networkName } = props.User;
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    const headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken
    };

    setDownloading(true);

    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/chainCodes/downLoadChainCode/${record.channelId}?chainCodeName=${record.chainCodeName}`,
      {
        headers,
        mode: 'cors',
        method: 'GET',
        responseType: 'blob'
      }
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
      endorsementPolicy: { ...record.endorsementPolicy }
    };
    const res = await dispatch({
      type: 'Contract/releaseContract',
      payload: params
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
        networkName: props.User.networkName
      }
    });
    if (res) {
      getChainCodeList();
    }
  };

  // 查看合约详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: ChainCodeSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/contract/contractDetail/${record.chainCodeName}`,
      state: record
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_CONTRACT_NAME'),
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
      render: (text) =>
        text || <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CHANNEL'),
      dataIndex: 'channelId',
      key: 'channelId',
      render: (text) =>
        text || <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_ORGANIZATION'),
      dataIndex: 'createOrgName',
      key: 'createOrgName',
      render: (text) =>
        text || <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) =>
        text ? (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ) : (
          <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
        )
    },
    {
      title: Intl.formatMessage('BASS_COMMON_STATUS'),
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
          <span className="a-forbidden-style">{Intl.formatMessage('BASS_COMMON_LIMIT_ACCESS')}</span>
        )
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      width: '20%',
      render: (_, record) => (
        // 非当前合约组织成员不可操作
        <Space size="small">
          {record.canDownload && (
            <div>
              <a
                href={`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/chainCodes/downLoadChainCode/${record.channelId}?chainCodeName=${record.chainCodeName}`}
                onClick={(e) => onDownLoadContract(e, record)}>
                {Intl.formatMessage('BASS_CONTRACT_DOWNLOAD_CONTRACTS')}
              </a>
              <Divider type="vertical" />
            </div>
          )}
          {VerifyStatusList.includes(record.chainCodeStatus) && userRole === Roles.NetworkAdmin && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickApprove(record)}>
                {Intl.formatMessage('BASS_CONTRACT_REVIEW')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          {record.chainCodeStatus === ChainCodeStatus.Verified && record.createdAt && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'install')}>
                {Intl.formatMessage('BASS_CONTRACT_INSTALL')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          {record.chainCodeStatus === ChainCodeStatus.Installed && record.createdAt && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'approve')}>
                {Intl.formatMessage('BASS_CONTRACT_PUBLISH')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          {UpdateStatusList.includes(record.chainCodeStatus) && record.createdAt && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickUpgrade(record)}>
                {Intl.formatMessage('BASS_CONTRACT_UPGRADE')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          {record.chainCodeStatus === ChainCodeStatus.Approved && record.canInvoke && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickInvoke(record)}>
                {Intl.formatMessage('BASS_CONTRACT_CALL')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          {record.createdAt || record.createOrgName ? (
            <a
              href={`/about/contract/contractDetail/${record.chainCodeName}`}
              onClick={(e) => onClickDetail(e, record)}>
              {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
            </a>
          ) : (
            <a
              href={`/about/contract/contractDetail/${record.chainCodeName}`}
              onClick={(e) => e.preventDefault()}
              className="a-forbidden-style">
              {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
            </a>
          )}
        </Space>
      )
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'Contract/checkOrgInUse',
      payload: { networkName }
    });
    getChainCodeList();
  }, [dispatch, getChainCodeList, networkName, pageNum]);

  return (
    <div className="page-wrapper">
      <Spin spinning={downloading} tip={Intl.formatMessage('BASS_CONTRACT_SPIN_TIP_VALUE')}>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={onClickAdd}>
              {Intl.formatMessage('BASS_CONTRACT_CREATE_CONTRACT')}
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
              position: ['bottomCenter']
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
  qryLoading: loading.effects['Contract/getPageListOfChainCode']
}))(MyContract);
