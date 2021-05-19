import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { Table, Space, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Breadcrumb } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import EditStrategy from './components/EditStrategy';
import ConfigStrategy from './components/ConfigStrategy';
import baseConfig from '@/utils/config';
import { ConnectState } from '@/models/connect';
import { TableColumnsAttr } from '@/utils/types';
import { StrategyListState } from '@/models/privacy-strategy';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem.push({
  menuName: '隐私保护策略',
  menuHref: `/`,
});
const pageSize = baseConfig.pageSize;
export interface PrivacyStrategyProps {
  User: ConnectState['User'];
  PrivacyStrategy: ConnectState['PrivacyStrategy'];
  qryLoading: boolean;
  dispatch: Dispatch;
}
function PrivacyStrategy(props: PrivacyStrategyProps) {
  const [pageNum, setPageNum] = useState(1);
  const [configModalVisible, setConfigModalVisible] = useState(false); // 配置策略是否可见
  const [editModalVisible, setEditModalVisible] = useState(false); // 新增、修改策略是否可见
  const [strategyObj, setStrategyObj] = useState<StrategyListState>({}); // 当前操作的策略
  const [operateType, setOperateType] = useState('new'); // 打开弹窗类型--新增、修改
  const { networkName } = props.User;
  const { strategyList, strategyTotal } = props.PrivacyStrategy;
  const { qryLoading = false } = props;

  const columns: TableColumnsAttr[] = [
    {
      title: '隐私保护策略名称',
      dataIndex: 'strategyName',
      key: 'strategyName',
      width: '26%',
    },
    {
      title: '描述',
      dataIndex: 'strategyDesc',
      key: 'strategyDesc',
      width: '26%',
    },
    {
      title: '状态',
      dataIndex: 'strategyStatus',
      key: 'strategyStatus',
      width: '26%',
      render: (text) => (text === 0 ? '停用' : '启用'),
    },
    {
      title: '操作',
      key: 'action',
      width: '22%',
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => onClickModify(record)}>修改</a>
          {record.strategyStatus === 1 ? (
            <a onClick={() => onClickToConfirm(record, 'stop')}>停用</a>
          ) : (
            <a onClick={() => onClickToConfirm(record, 'enable')}>启用</a>
          )}
          <a onClick={() => onClickConfig(record)}>配置策略</a>
          {/* <a onClick={() => onClickDetail(record)}>隐私保护记录</a> */}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getPageListOPrivacyStrategy();
    getPrivacyStrategyTotalDocs();
  }, [pageNum]);
  // 获取策略列表
  const getPageListOPrivacyStrategy = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      networkName,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
    };
    props.dispatch({
      type: 'PrivacyStrategy/getPageListOPrivacyStrategy',
      payload: params,
    });
  };

  //获取策略列表的totalDocs
  const getPrivacyStrategyTotalDocs = () => {
    props.dispatch({
      type: 'PrivacyStrategy/getPrivacyStrategyTotalDocs',
      payload: { networkName },
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 关闭 新增&修改 策略 弹窗
  const onCloseModal = () => {
    setConfigModalVisible(false);
    setEditModalVisible(false);
  };

  // 点击新增策略
  const onClickAdd = () => {
    setOperateType('new');
    setEditModalVisible(true);
    setStrategyObj({});
  };

  // 点击修改策略
  const onClickModify = (record: StrategyListState) => {
    setOperateType('modify');
    setEditModalVisible(true);
    setStrategyObj(record);
  };

  // 点击配置策略
  const onClickConfig = (record: StrategyListState) => {
    setConfigModalVisible(true);
    setStrategyObj(record);
  };

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = (record: StrategyListState, type: string) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'stop':
        tipTitle = '停用';
        callback = () => changeStrategyStatus(record, 0);
        break;
      case 'enable':
        tipTitle = '启用';
        callback = () => changeStrategyStatus(record, 1);
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要${tipTitle}隐私保护策略 【${record.strategyName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  // 停用 & 启用 策略
  const changeStrategyStatus = (record: StrategyListState, strategyStatus: any) => {
    props
      .dispatch({
        type: 'PrivacyStrategy/updateStrategyStatus',
        payload: {
          networkName,
          strategyStatus,
          strategyName: record.strategyName,
        },
      })
      .then((res: any) => {
        if (res) {
          getPageListOPrivacyStrategy();
        }
      });
  };

  // 查看策略详情
  // const onClickDetail = (record: StrategyListState) => {
  //   history.push({
  //     pathname: `/about/contract/privacyStrategy/protectRecord`,
  //     query: {
  //       id: record.strategyName,
  //       strategyName: record.strategyName,
  //       strategyStatus: record.strategyStatus,
  //       strategyDesc: record.strategyDesc,
  //       networkName,
  //     },
  //   });
  // };
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickAdd}>
            新增策略
          </Button>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          loading={qryLoading}
          dataSource={strategyList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            total: strategyTotal,
            current: pageNum,
            position: ['bottomCenter'],
          }}
        />
      </div>
      {editModalVisible && (
        <EditStrategy
          visible={editModalVisible}
          operateType={operateType}
          editParams={strategyObj}
          onCancel={onCloseModal}
          getPrivacyStrategyTotalDocs={getPrivacyStrategyTotalDocs}
          getPageListOPrivacyStrategy={getPageListOPrivacyStrategy}
        />
      )}
      {configModalVisible && (
        <ConfigStrategy
          visible={configModalVisible}
          editParams={strategyObj}
          onCancel={onCloseModal}
          //TODO:ConfigStrategy组件中你没有接收getPrivacyStrategyTotalDocs方法
          //TODO:需要让ConfigStrategy让它接收这个方法吗？
          //getPrivacyStrategyTotalDocs={getPrivacyStrategyTotalDocs}
          getPageListOPrivacyStrategy={getPageListOPrivacyStrategy}
        />
      )}
    </div>
  );
}

export default connect(({ User, PrivacyStrategy, loading }: ConnectState) => ({
  User,
  PrivacyStrategy,
  qryLoading: loading.effects['PrivacyStrategy/getPageListOPrivacyStrategy'],
}))(PrivacyStrategy);
