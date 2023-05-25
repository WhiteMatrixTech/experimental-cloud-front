import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { Descriptions, Divider, Table } from 'antd';
import { Breadcrumb, DetailCard, PageTitle } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import baseConfig from '~/utils/config';
import { serverPurpose } from '../../_config';
import { ColumnsType } from 'antd/lib/table';
import { Dispatch, ElasticServerSchema, Location } from 'umi';
import { ConnectState } from '~/models/connect';
import { renderDateWithDefault } from '~/utils/date';
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
    render: renderDateWithDefault
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
  }, [getNodeList, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="实例数据" />
      <div className="page-content">
        <Descriptions title="服务器信息" className="descriptions-wrapper">
          {serverInfoList.map(item =>
            <Descriptions.Item
              key={item.label}
              label={item.label}>
              {item.value}
            </Descriptions.Item>
          )}
        </Descriptions>
        <div className="table-wrapper page-content-shadow">
          <div className="table-header-title">实例列表</div>
          <Divider />
          <Table
            rowKey="instanceId"
            loading={qryLoading}
            columns={columns}
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
    </div>
  );
}

export default connect(({ ElasticServer, Layout, User, loading }: ConnectState) => ({
  ElasticServer,
  Layout,
  User,
  qryLoading: loading.effects['ElasticServer/getNodeList']
}))(ResourceUsage);
