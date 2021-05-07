import React, { useState, useEffect } from 'react';
import { Space, Table } from 'antd';
import { connect, history, Dispatch } from 'umi';
import { Roles } from '@/utils/roles';
import { ConnectState } from '@/models/connect';
import { User } from '@/models/user-role';
import cs from 'classnames';
import styles from './index.less';

export type UserManagementProps = {
  qryLoading: boolean,
  dispatch: Dispatch,
  UserRole: ConnectState['UserRole']
}

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const { qryLoading, dispatch, UserRole } = props;
  const { userList } = UserRole;

  const [pageNum, setPageNum] = useState(1);
  const columns = [
    {
      title: '用户名',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
    },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: '注册角色',
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => <span>{Roles[text]}</span>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="small">
          <a onClick={() => onClickConfig(record)}>配置访问角色</a>
        </Space>
      ),
    },
  ];

  const onClickConfig = async (record: User) => {
    await dispatch({
      type: 'UserRole/getRoleNameList',
      payload: {},
    });
    history.push({
      pathname: `/userManagement/user-roles`,
      state: { ...record },
    });
  }

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const getUserList = () => {
    const params = {
      offset: (pageNum - 1) * 10,
      limit: 10,
    }
    dispatch({
      type: 'UserRole/getUserList',
      payload: params,
    });
    dispatch({
      type: 'UserRole/getUserTotal',
      payload: {},
    });
  };

  useEffect(() => {
    getUserList();
  }, [pageNum]);

  return <div className={styles.main}>
    <div className={cs(styles['form-header-title'], 'page-content')}>
      <h3>用户角色管理</h3>
      <div className={styles['sub-title']}>平台中所有用户的列表，可在此管理用户在网络中的访问角色</div>
    </div>
    <div className="page-content page-content-shadow table-wrapper">
      <Table
        rowKey="blockHash"
        columns={columns}
        dataSource={userList}
        loading={qryLoading}
        onChange={onPageChange}
        pagination={{
          pageSize: 10,
          total: 0,
          current: pageNum,
          showSizeChanger: false,
          position: ['bottomCenter'],
        }}
      />
    </div>
  </div>
}

export default connect(({ UserRole, loading }: ConnectState) => ({
  UserRole,
  qryLoading: loading.effects['UserRole/getUserList'],
}))(UserManagement);
