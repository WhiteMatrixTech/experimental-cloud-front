/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import ConfigStrategy from '../components/ConfigStrategy';
import baseConfig from 'utils/config';

class PrivacyStrategyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,
      methodName: '',

      configModalVisible: false, // 配置策略是否可见
      strategyObj: {}, // 当前操作的策略
    };
    this.columns = [
      {
        title: '方法名',
        dataIndex: 'methodName',
        key: 'methodName',
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
      },
      {
        title: '合约版本',
        dataIndex: 'chainCodeVersion',
        key: 'chainCodeVersion',
      },
      {
        title: '所属联盟',
        dataIndex: 'leagueName',
        key: 'leagueName',
      },
      {
        title: '所属通道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '加密字段',
        dataIndex: 'dataRoleArgs',
        key: 'dataRoleArgs',
      },
    ];
  }

  componentDidMount() {
    this.getPageListOfRecord();
  }

  // 获取 隐私保护记录列表
  getPageListOfRecord = (current, methodName) => {
    const { pageNum, pageSize } = this.state;
    const {
      location: {
        query: { id = '' },
      },
    } = this.props;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      id,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      networkName: this.props.User.networkName,
    };
    if (methodName) {
      params.methodName = methodName;
    }
    this.props.dispatch({
      type: 'PrivacyStrategy/getPageListOfRecord',
      payload: params,
    });
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
    this.getPageListOfRecord(pageInfo.current);
  };

  // 按 方法名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, methodName: value || '' });
      this.getPageListOfRecord(1, value);
    }
  };

  // 关闭 配置策略 弹窗
  onCloseModal = () => {
    this.setState({ configModalVisible: false });
  };

  // 点击配置策略
  onClickConfig = () => {
    const {
      location: {
        query: { strategyName = '', strategyStatus = '', strategyDesc = '' },
      },
    } = this.props;
    this.setState({ configModalVisible: true, strategyObj: { strategyName, strategyStatus, strategyDesc } });
  };

  render() {
    const {
      qryLoading = false,
      location: {
        query: { strategyName = '', strategyStatus = '', strategyDesc = '' },
      },
    } = this.props;
    const { pageSize, pageNum, configModalVisible, strategyObj } = this.state;
    const { protectRecordList, protectRecordTotal } = this.props.PrivacyStrategy;
    const strategyInfoList = [
      {
        label: '策略名称',
        value: strategyName,
      },
      {
        label: '策略状态',
        value: strategyStatus === 0 ? '停用' : '启用',
      },
      {
        label: '策略描述',
        fullRow: true,
        value: strategyDesc,
      },
    ];
    let breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
    breadCrumbItem = breadCrumbItem.concat([
      {
        menuName: '隐私保护策略',
        menuHref: `/about/contract/privacyStrategy`,
        isLeftMenu: true,
      },
      {
        menuName: '隐私保护记录',
        menuHref: `/`,
      },
    ]);
    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <DetailCard cardTitle="策略详情" detailList={strategyInfoList} boxShadow="0 4px 12px 0 rgba(0,0,0,.05)" />
          <SearchBar placeholder="输入方法名" onSearch={this.onSearch} btnName="配置策略" onClickBtn={this.onClickConfig} />
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={this.columns}
            className="page-content-shadow"
            dataSource={protectRecordList}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: protectRecordTotal, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
        {configModalVisible && (
          <ConfigStrategy
            visible={configModalVisible}
            editParams={strategyObj}
            onCancel={this.onCloseModal}
            getPageListOPrivacyStrategy={this.getPageListOfRecord}
          />
        )}
      </div>
    );
  }
}

export default connect(({ User, PrivacyStrategy, loading }) => ({
  User,
  PrivacyStrategy,
  qryLoading: loading.effects['PrivacyStrategy/getPageListOfRecord'],
}))(PrivacyStrategyDetail);
