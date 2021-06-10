import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import baseConfig from '~/utils/config';
import { serverPurpose } from '../../_config';
import { ColumnsType } from 'antd/lib/table';
import { Dispatch, ElasticServerSchema, Location } from 'umi';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';
const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_ELASTIC_CLOUD_INSTANCE_DATA'),
  menuHref: `/`
});

const columns: ColumnsType<any> = [
  {
    title: Intl.formatMessage('BASS_ELASTIC_CLOUD_INSTANCE_NAME'),
    dataIndex: 'instanceName',
    key: 'instanceName'
  },
  {
    title: Intl.formatMessage('BASS_ELASTIC_CLOUD_INSTANCE_TYPE'),
    dataIndex: 'instanceType',
    key: 'instanceType'
  },
  {
    title: Intl.formatMessage('BASS_ELASTIC_CLOUD_EXTERNAL_IP'),
    dataIndex: 'publicIpAddress',
    key: 'publicIpAddress',
    ellipsis: true
  },
  {
    title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
  }
];
export interface ResourceUsageProps {
  qryLoading: boolean;
  location: Location<ElasticServerSchema>;
  dispatch: Dispatch;
  ElasticServer: ConnectState['ElasticServer'];
  match: { params: { serverName: string } };
}
function ResourceUsage(props: ResourceUsageProps) {
  const {
    qryLoading = false,
    location,
    dispatch,
    ElasticServer,
    match: {
      params: { serverName }
    }
  } = props;
  const { nodeList, nodeTotal } = ElasticServer;
  const [pageNum, setPageNum] = useState(1);

  const getNodeList = useCallback(() => {
    const offset = (pageNum - 1) * baseConfig.pageSize;

    const params = {
      limit: baseConfig.pageSize,
      offset: offset,
      ascend: false,
      serverName
    };
    dispatch({
      type: 'ElasticServer/getNodeList',
      payload: params
    });
    dispatch({
      type: 'ElasticServer/getNodeTotal',
      payload: { serverName }
    });
  }, [dispatch, pageNum, serverName]);

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };
  const serverInfoList = useMemo(
    () => [
      {
        label: Intl.formatMessage('BASS_ELASTIC_CLOUD_SERVER_NAME'),
        value: location?.state?.serverName
      },
      {
        label: Intl.formatMessage('BASS_USER_INFO_USER_NAME'),
        value: location?.state?.username
      },
      {
        label: Intl.formatMessage('BASS_ELASTIC_CLOUD_TYPE_OF_USE'),
        value: serverPurpose[location?.state?.serverPurpose]
      },
      {
        label: Intl.formatMessage('BASS_ELASTIC_CLOUD_INSTANCE_TOTAL'),
        value: nodeTotal
      }
    ],
    [location?.state, nodeTotal]
  );

  useEffect(() => {
    getNodeList();
  }, [getNodeList, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard
          cardTitle={Intl.formatMessage('BASS_ELASTIC_CLOUD_SERVER_INFORMATION')}
          detailList={serverInfoList}
          boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
        />
        <Table
          rowKey="instanceId"
          loading={qryLoading}
          columns={columns}
          className="page-content-shadow table-wrapper"
          dataSource={nodeList}
          onChange={onPageChange}
          pagination={{
            pageSize: baseConfig.pageSize,
            total: nodeTotal,
            current: pageNum,
            position: ['bottomCenter']
          }}
        />
      </div>
    </div>
  );
}

export default connect(({ ElasticServer, Layout, User, loading }: ConnectState) => ({
  ElasticServer,
  Layout,
  User,
  qryLoading: loading.effects['ElasticServer/getNodeList']
}))(ResourceUsage);
