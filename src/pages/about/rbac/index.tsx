import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, history, RbacRole } from 'umi';
import { Table, Space, Button } from 'antd';
import { Breadcrumb } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { DisabledRole } from './_config';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');
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
        if (DisabledRole.includes(record.roleName)) {
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
          {!DisabledRole.includes(record.roleName) && (
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
  const getRoleList = () => {
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
  };

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
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content table-wrapper page-content-shadow">
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickCreateConfig}>
            创建访问角色
          </Button>
        </div>
        <Table
          rowKey="roleName"
          columns={columns}
          loading={qryLoading}
          dataSource={roleList}
          onChange={onPageChange}
          scroll={{ x: 1600, y: 300 }}
          pagination={{
            pageSize,
            current: pageNum,
            total: roleList.length,
            position: ['bottomCenter']
          }}
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
