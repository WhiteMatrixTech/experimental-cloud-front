import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, history, RbacRole } from 'umi';
import { Table, Space, Button } from 'antd';
import { useRequest } from 'ahooks';
import { ColumnsType } from 'antd/lib/table';
import { PageTitle } from '~/components';
import baseConfig from '~/utils/config';
import { ConnectState } from '~/models/connect';
import * as rbacApi from '~/services/rbac';

export interface RbacConfigProps {
  RBAC: ConnectState['RBAC'];
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
}
const RbacConfig: React.FC<RbacConfigProps> = (props) => {
  const { RBAC, qryLoading, dispatch, User } = props;
  const { networkName } = User;
  const { roleList } = RBAC;

  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);

  const { data: defaultRoleList, loading: queryDefaultRoleLoading } = useRequest(
    async () => {
      const res = await rbacApi.getDefaultRoleList({ networkName });
      const { result } = res;
      return result as string[];
    },
    {
      refreshDeps: [networkName]
    }
  );

  const columns: ColumnsType<any> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      key: 'roleType',
      ellipsis: true,
      render: (_: any, record: RbacRole) => {
        if (defaultRoleList?.includes(record.roleName)) {
          return '默认角色';
        }
        return '自定义角色';
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: RbacRole) => (
        <Space size="small">
          {!defaultRoleList?.includes(record.roleName) && (
            <a href={`/about/rbac/${record.roleName}/config`} onClick={(e) => onClickRbacConfig(e, record)}>
              配置
            </a>
          )}
          <a href={`/about/rbac/${record.roleName}/detail`} onClick={(e) => onClickRbacDetail(e, record)}>
            详情
          </a>
        </Space>
      )
    }
  ];

  // 查询列表
  const getRoleList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize
    };
    dispatch({
      type: 'RBAC/getRoleList',
      payload: params
    });
  }, [dispatch, networkName, pageNum, pageSize]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickCreateConfig = () => {
    history.push({
      pathname: `/about/rbac/new`,
      state: {
        type: 'new'
      }
    });
  };

  const onClickRbacConfig = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: RbacRole) => {
    e.preventDefault();
    history.push({
      pathname: `/about/rbac/${record.roleName}/config`,
      state: {
        roleName: record.roleName
      }
    });
  };

  const onClickRbacDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: RbacRole) => {
    e.preventDefault();
    history.push({
      pathname: `/about/rbac/${record.roleName}/detail`,
      state: {
        roleName: record.roleName
      }
    });
  };

  useEffect(() => {
    getRoleList();
  }, [getRoleList]);

  return (
    <div className="page-wrapper">
      <PageTitle
        label="访问策略管理"
        extra={
          <Button type="primary" onClick={onClickCreateConfig}>
            新增访问策略
          </Button>
        }
      />
      <div className="page-content table-wrapper page-content-shadow">
        <Table
          rowKey="roleName"
          columns={columns}
          dataSource={roleList}
          onChange={onPageChange}
          pagination={{
            pageSize,
            current: pageNum,
            total: roleList.length,
            position: ['bottomCenter']
          }}
          loading={qryLoading || queryDefaultRoleLoading}
        />
      </div>
    </div>
  );
};

export default connect(({ User, Layout, RBAC, loading }: ConnectState) => ({
  User,
  Layout,
  RBAC,
  qryLoading: loading.effects['RBAC/getRbacRoleList']
}))(RbacConfig);
