import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Space, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, Dispatch, UserInfoSchema } from 'umi';
import { Roles, RolesMapNames } from '~/utils/roles';
import { ConnectState } from '~/models/connect';
import { PageTitle } from '~/components';
import { ColumnsType } from 'antd/lib/table';

export type UserManagementProps = {
  qryLoading: boolean;
  dispatch: Dispatch;
  UserRole: ConnectState['UserRole'];
};

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const { qryLoading, dispatch, UserRole } = props;
  const { userList, userTotal } = UserRole;

  const [pageNum, setPageNum] = useState(1);
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

  const onClickSetAdmin = useCallback(
    (record: UserInfoSchema) => {
      const callback = async () => {
        const res = await dispatch({
          type: 'UserRole/setUserAdmin',
          payload: { email: record.email }
        });
        if (res) {
          getUserList();
        }
      };
      Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: `确认要将用户 【${record.name}】 设置为系统管理员吗?`,
        okText: '确认',
        cancelText: '取消',
        onOk: callback
      });
    },
    [dispatch, getUserList]
  );

  const onClickUnSetAdmin = useCallback(
    (record: UserInfoSchema) => {
      const callback = async () => {
        const res = await dispatch({
          type: 'UserRole/unsetUserAdmin',
          payload: { email: record.email }
        });
        if (res) {
          getUserList();
        }
      };
      Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: `确认要将用户 【${record.name}】 设置为普通成员吗?`,
        okText: '确认',
        cancelText: '取消',
        onOk: callback
      });
    },
    [dispatch, getUserList]
  );

  const onClickResetPassword = useCallback(
    (record: UserInfoSchema) => {
      const callback = async () => {
        const res = await dispatch({
          type: 'UserRole/resetPassword',
          payload: { email: record.email }
        });
        if (res) {
          getUserList();
        }
      };
      Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: `确认要重置用户 【${record.name}】 的登录密码为初始值吗?`,
        okText: '确认',
        cancelText: '取消',
        onOk: callback
      });
    },
    [dispatch, getUserList]
  );

  const columns: ColumnsType<UserInfoSchema> = [
    {
      title: '用户名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '手机号',
      dataIndex: 'phoneNo',
      key: 'phoneNo'
    },
    {
      title: '系统角色',
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => <span>{RolesMapNames[text]}</span>
    },
    {
      title: '操作',
      key: 'action',
      width: '18%',
      render: (_: string, user) => (
        <Space size="small">
          {user.role === Roles.SUPER ? null : user.role === Roles.ADMIN ? (
            <span role="button" className="table-action-span" onClick={() => onClickUnSetAdmin(user)}>
              设置为普通成员
            </span>
          ) : (
            <span role="button" className="table-action-span" onClick={() => onClickSetAdmin(user)}>
              设置为管理员
            </span>
          )}
          <span role="button" className="table-action-span" onClick={() => onClickResetPassword(user)}>
            重置密码
          </span>
        </Space>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <PageTitle label="用户管理" />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="email"
          columns={columns}
          dataSource={userList}
          loading={qryLoading}
          onChange={onPageChange}
          pagination={{
            pageSize: 10,
            total: userTotal,
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
