import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table } from 'antd';
import { connect, history, Dispatch } from 'umi';
import { RolesMapNames } from '~/utils/roles';
import { ConnectState } from '~/models/connect';
import { UserInfo } from '~/models/user-role';
import { Breadcrumb } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/user-role-management', false);

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
      title: Intl.formatMessage('BASS_USER_INFO_USER_NAME'),
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL'),
      dataIndex: 'contactEmail',
      key: 'contactEmail'
    },
    {
      title: Intl.formatMessage('BASS_USER_INFO_CONTACT_PERSON_NAME'),
      dataIndex: 'contactName',
      key: 'contactName'
    },
    {
      title: Intl.formatMessage('BASS_RBAC_REGISTER_ROLE'),
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => <span>{RolesMapNames[text]}</span>
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (_: any, record: UserInfo) => (
        <Space size="small">
          <a
            href={`/common/user-role-management/user-roles/${record.companyName}`}
            onClick={(e) => onClickConfig(e, record)}>
            {Intl.formatMessage('BASS_MEMBER_MANAGEMENT_CONFIG_ACCESS_ROLE')}
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
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
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
