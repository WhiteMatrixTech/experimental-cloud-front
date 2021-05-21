import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Table, Space, Button } from 'antd';
import { Breadcrumb } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { DisabledRole } from './_config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/rbac');

function RbacConfig(props) {
  const { RBAC, qryLoading, dispatch, User } = props;
  const { networkName } = User;
  const { roleList } = RBAC;

  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true,
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      key: 'roleType',
      ellipsis: true,
      render: (_, record) => {
        if (DisabledRole.includes(record.roleName)) {
          return '默认角色';
        }
        return '自定义角色';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          {!DisabledRole.includes(record.roleName) && <a onClick={() => onClickRbacConfig(record)}>配置</a>}
          <a onClick={() => onClickRbacDetail(record)}>详情</a>
        </Space>
      ),
    },
  ];

  // 查询列表
  const getRoleList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize,
    };
    dispatch({
      type: 'RBAC/getRoleList',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const onClickCreateConfig = () => {
    history.push({
      pathname: `/about/rbac/new`,
    });
  };

  const onClickRbacConfig = (record) => {
    history.push({
      pathname: `/about/rbac/config`,
      state: {
        roleName: record.roleName,
      },
    });
  };

  const onClickRbacDetail = (record) => {
    history.push({
      pathname: `/about/rbac/detail`,
      state: {
        roleName: record.roleName,
      },
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
            position: ['bottomCenter'],
          }}
        />
      </div>
    </div>
  );
}

export default connect(({ User, Layout, RBAC, loading }) => ({
  User,
  Layout,
  RBAC,
  qryLoading: loading.effects['RBAC/getRbacRoleList'],
}))(RbacConfig);
