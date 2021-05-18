import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import baseConfig from '@/utils/config';
import { TableColumnsAttr } from '@/utils/types';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'umi';
import { Table } from 'antd';
import { Breadcrumb, DetailCard, SearchBar } from '@/components';
import ConfigStrategy from '../components/ConfigStrategy';
import { DetailViewAttr } from '@/utils/types';

export interface PrivacyStrategyDetailProps {
  User: ConnectState['User'];
  location: { query: { id: string; strategyName: string; strategyStatus: string; strategyDesc: string } };
  PrivacyStrategy: ConnectState['PrivacyStrategy'];
  dispatch: Dispatch;
  qryLoading: boolean;
}
const pageSize = baseConfig.pageSize;

function PrivacyStrategyDetail(props: PrivacyStrategyDetailProps) {
  const [pageNum, setPageNum] = useState(1);
  const [methodName, setMethodName] = useState('');
  const [configModalVisible, setConfigModalVisible] = useState(false); //配置策略是否可见
  const [strategyObj, setStrategyObj] = useState({}); //当前操作的策略
  const {
    location: {
      query: { id = '', strategyName = '', strategyStatus = '', strategyDesc = '' },
    },
  } = props;
  const { protectRecordList, protectRecordTotal } = props.PrivacyStrategy;
  const { networkName } = props.User;
  const { qryLoading = false } = props;

  let columns: TableColumnsAttr[] = [
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

  useEffect(() => {
    getPageListOfRecord();
  }, [pageNum, methodName]);

  // 获取 隐私保护记录列表
  const getPageListOfRecord = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      id,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      networkName,
    };
    props.dispatch({
      type: 'PrivacyStrategy/getPageListOfRecord',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 按 方法名 搜索
  const onSearch = (value: any, event: { type: string }) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setMethodName(value || '');
    }
  };

  // 关闭 配置策略 弹窗
  const onCloseModal = () => {
    setConfigModalVisible(false);
  };

  // 点击配置策略
  const onClickConfig = () => {
    setConfigModalVisible(true);
    setStrategyObj({ strategyName, strategyStatus, strategyDesc });
  };

  const strategyInfoList: DetailViewAttr[] = [
    {
      label: '策略名称',
      value: strategyName,
    },
    {
      label: '策略状态',
      //TODO:strategyStatus上面你写的‘’是string类型
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
        <SearchBar placeholder="输入方法名" onSearch={onSearch} btnName="配置策略" onClickBtn={onClickConfig} />
        <Table
          rowKey="_id"
          loading={qryLoading}
          columns={columns}
          className="page-content-shadow"
          dataSource={protectRecordList}
          onChange={onPageChange}
          pagination={{ pageSize, total: protectRecordTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {configModalVisible && (
        <ConfigStrategy
          visible={configModalVisible}
          editParams={strategyObj}
          onCancel={onCloseModal}
          getPageListOPrivacyStrategy={getPageListOfRecord}
        />
      )}
    </div>
  );
}

export default connect(({ User, PrivacyStrategy, loading }: ConnectState) => ({
  User,
  PrivacyStrategy,
  qryLoading: loading.effects['PrivacyStrategy/getPageListOfRecord'],
}))(PrivacyStrategyDetail);
