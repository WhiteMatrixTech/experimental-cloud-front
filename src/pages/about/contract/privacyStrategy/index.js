import React, { Component } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Table, Space, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import EditStrategy from './components/EditStrategy';
import ConfigStrategy from './components/ConfigStrategy';
import baseConfig from 'utils/config';
import style from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem.push({
  menuName: '隐私保护策略',
  menuHref: `/`,
});

class PrivacyStrategy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,
      configModalVisible: false, // 配置策略是否可见
      editModalVisible: false, // 新增、修改策略是否可见
      strategyObj: {}, // 当前操作的策略
      operateType: 'new', // 打开弹窗类型--新增、修改
    };
    this.columns = [
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
            <a onClick={() => this.onClickModify(record)}>修改</a>
            {record.strategyStatus === 1 ? (
              <a onClick={() => this.onClickToConfirm(record, 'stop')}>停用</a>
            ) : (
              <a onClick={() => this.onClickToConfirm(record, 'enable')}>启用</a>
            )}
            <a onClick={() => this.onClickConfig(record)}>配置策略</a>
            {/* <a onClick={() => this.onClickDetail(record)}>隐私保护记录</a> */}
          </Space>
        ),
      },
    ];
  }

  componentDidMount() {
    this.getPageListOPrivacyStrategy();
    this.getPrivacyStrategyTotalDocs();
  }

  // 获取策略列表
  getPageListOPrivacyStrategy = (current) => {
    const { pageNum, pageSize } = this.state;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      networkName: this.props.User.networkName,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
    };
    this.props.dispatch({
      type: 'PrivacyStrategy/getPageListOPrivacyStrategy',
      payload: params,
    });
  };

  //获取策略列表的totalDocs
  getPrivacyStrategyTotalDocs = () => {
    const { networkName } = this.props.User;
    this.props.dispatch({
      type: 'PrivacyStrategy/getPrivacyStrategyTotalDocs',
      payload: { networkName },
    });
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
    this.getPageListOPrivacyStrategy(pageInfo.current);
  };

  // 关闭 新增&修改 策略 弹窗
  onCloseModal = () => {
    this.setState({ editModalVisible: false, configModalVisible: false });
  };

  // 点击新增策略
  onClickAdd = () => {
    this.setState({ operateType: 'new', editModalVisible: true, strategyObj: {} });
  };

  // 点击修改策略
  onClickModify = (record) => {
    this.setState({ operateType: 'modify', editModalVisible: true, strategyObj: record });
  };

  // 点击配置策略
  onClickConfig = (record) => {
    this.setState({ configModalVisible: true, strategyObj: record });
  };

  // 点击操作按钮, 进行二次确认
  onClickToConfirm = (record, type) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'stop':
        tipTitle = '停用';
        callback = () => this.changeStrategyStatus(record, 0);
        break;
      case 'enable':
        tipTitle = '启用';
        callback = () => this.changeStrategyStatus(record, 1);
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
  changeStrategyStatus = (record, strategyStatus) => {
    this.props
      .dispatch({
        type: 'PrivacyStrategy/updateStrategyStatus',
        payload: {
          networkName: this.props.User.networkName,
          strategyStatus,
          strategyName: record.strategyName,
        },
      })
      .then((res) => {
        if (res) {
          this.getPageListOPrivacyStrategy();
        }
      });
  };

  // 查看策略详情
  onClickDetail = (record) => {
    history.push({
      pathname: `/about/contract/privacyStrategy/protectRecord`,
      query: {
        id: record.strategyName,
        strategyName: record.strategyName,
        strategyStatus: record.strategyStatus,
        strategyDesc: record.strategyDesc,
        networkName: this.props.User.networkName,
      },
    });
  };

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum, editModalVisible, configModalVisible, operateType, strategyObj } = this.state;
    const { strategyList, strategyTotal } = this.props.PrivacyStrategy;
    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content page-content-shadow table-wrapper">
          <div className={style['table-header-btn-wrapper']}>
            <Button type="primary" onClick={this.onClickAdd}>
              新增策略
            </Button>
          </div>
          <Table
            rowKey="_id"
            columns={this.columns}
            loading={qryLoading}
            dataSource={strategyList}
            onChange={this.onPageChange}
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
            onCancel={this.onCloseModal}
            getPrivacyStrategyTotalDocs={this.getPrivacyStrategyTotalDocs}
            getPageListOPrivacyStrategy={this.getPageListOPrivacyStrategy}
          />
        )}
        {configModalVisible && (
          <ConfigStrategy
            visible={configModalVisible}
            editParams={strategyObj}
            onCancel={this.onCloseModal}
            getPrivacyStrategyTotalDocs={this.getPrivacyStrategyTotalDocs}
            getPageListOPrivacyStrategy={this.getPageListOPrivacyStrategy}
          />
        )}
      </div>
    );
  }
}

export default connect(({ User, PrivacyStrategy, loading }) => ({
  User,
  PrivacyStrategy,
  qryLoading: loading.effects['PrivacyStrategy/getPageListOPrivacyStrategy'],
}))(PrivacyStrategy);
