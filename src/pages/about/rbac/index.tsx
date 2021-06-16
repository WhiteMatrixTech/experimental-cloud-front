import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, history, RbacRole } from 'umi';
import { Table, Space, Button, Divider } from 'antd';
import { Breadcrumb } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { DisabledRole } from './_config';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

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
      title: Intl.formatMessage('BASS_RBAC_ROLE_NAME'),
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_RBAC_ROLE_TYPE'),
      dataIndex: 'roleType',
      key: 'roleType',
      ellipsis: true,
      render: (_: any, record: RbacRole) => {
        if (DisabledRole.includes(record.roleName)) {
          return Intl.formatMessage('BASS_RBAC_DEFAULT_ROLE');
        }
        return Intl.formatMessage('BASS_RBAC_CUSTOM_ROLE');
      }
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      render: (text, record: RbacRole) => (
        <Space size="small">
          {!DisabledRole.includes(record.roleName) && (
            <div>
              <a href={`/about/rbac/${record.roleName}/config`} onClick={(e) => onClickRbacConfig(e, record)}>
                {Intl.formatMessage('BASS_MEMBER_MANAGEMENT_CONFIG')}
              </a>
              <Divider type="vertical" />
            </div>
          )}
          <a href={`/about/rbac/${record.roleName}/detail`} onClick={(e) => onClickRbacDetail(e, record)}>
            {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
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
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content table-wrapper page-content-shadow">
        <div className="table-header-btn-wrapper">
          <Button type="primary" onClick={onClickCreateConfig}>
            {Intl.formatMessage('BASS_RBAC_ACCESS_ROLE')}
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
