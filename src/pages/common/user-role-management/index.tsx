import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table } from 'antd';
import { connect, history, Dispatch } from 'umi';
import { RolesMapNames } from '~/utils/roles';
import { ConnectState } from '~/models/connect';
import { UserInfo } from '~/models/user-role';
import { PageTitle } from '~/components';

export type UserManagementProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  UserRole: ConnectState['UserRole'];
};

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const { qryLoading, dispatch, UserRole } = props;
  const { userList } = UserRole;

  const [pageNum, setPageNum] = useState(1);
  const columns = [
    {
      title: '用户名',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true
    },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail'
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName'
    },
    {
      title: '注册角色',
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => <span>{RolesMapNames[text]}</span>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserInfo) => (
        <Space size="small">
          <a
            href={`/common/user-role-management/user-roles/${record.companyName}`}
            onClick={(e) => onClickConfig(e, record)}>
            配置访问角色
          </a>
        </Space>
      )
    }
  ];

  const onClickConfig = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: UserInfo) => {
    e.preventDefault();
    await dispatch({
      type: 'UserRole/getRoleNameList',
      payload: {}
    });
    history.push({
      pathname: `/common/user-role-management/user-roles/${record.companyName}`,
      state: { ...record }
    });
  };

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const getUserList = useCallback(() => {
    const params = {
      offset: (pageNum - 1) * 10,
      limit: 10
    };
    dispatch({
      type: 'UserRole/getUserList',
      payload: params
    });
    dispatch({
      type: 'UserRole/getUserTotal',
      payload: {}
    });
  }, [dispatch, pageNum]);

  useEffect(() => {
    getUserList();
  }, [getUserList, pageNum]);

  return (
    <div className="page-wrapper">
      <PageTitle label="用户角色管理" />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="companyName"
          columns={columns}
          dataSource={userList}
          loading={qryLoading}
          onChange={onPageChange}
          pagination={{
            pageSize: 10,
            total: 0,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter']
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ UserRole, loading }: ConnectState) => ({
  UserRole,
  qryLoading: loading.effects['UserRole/getUserList']
}))(UserManagement);
