import React, { useState, useEffect, useMemo } from 'react';
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
const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/elastic-cloud-server');
breadCrumbItem.push({
  menuName: '实例数据',
  menuHref: `/`
});

const columns: ColumnsType<any> = [
  {
    title: '实例名称',
    dataIndex: 'instanceName',
    key: 'instanceName'
  },
  {
    title: '实例类型',
    dataIndex: 'instanceType',
    key: 'instanceType'
  },
  {
    title: '外网IP',
    dataIndex: 'publicIpAddress',
    key: 'publicIpAddress',
    ellipsis: true
  },
  {
    title: '创建时间',
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

  const getNodeList = () => {
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
  };

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };
  const serverInfoList = useMemo(
    () => [
      {
        label: '服务器名称',
        value: location?.state?.serverName
      },
      {
        label: '用户名称',
        value: location?.state?.username
      },
      {
        label: '用途类型',
        value: serverPurpose[location?.state?.serverPurpose]
      },
      {
        label: '实例总数',
        value: nodeTotal
      }
    ],
    [location?.state, nodeTotal]
  );

  useEffect(() => {
    getNodeList();
  }, [pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard cardTitle="服务器信息" detailList={serverInfoList} boxShadow="0 4px 12px 0 rgba(0,0,0,.05)" />
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
