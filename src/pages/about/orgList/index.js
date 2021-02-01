import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Badge, Button } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';
import { orgStatus } from './_config';
import CreatePeerOrg from './components/CreatePeerOrg';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/orgList');

function OrganizationManagement(props) {
  const { Organization, qryLoading, dispatch, User } = props;
  const { networkName, userRole } = User;
  const { orgList, orgTotal } = Organization;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [createOrgVisible, setCreateOrgVisible] = useState(false)

  const columns = [
    {
      title: '组织名称',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '组织别名',
      dataIndex: 'orgAliasName',
      key: 'orgAliasName',
    },
    {
      title: '组织MSPID',
      dataIndex: 'orgMspId',
      key: 'orgMspId',
    },
    {
      title: '所属企业',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '组织地址',
      dataIndex: 'orgAddress',
      key: 'orgAddress',
    },
    {
      title: '当前状态',
      dataIndex: 'orgStatus',
      key: 'orgStatus',
      render: text => text ? <Badge color={orgStatus[text].color} text={orgStatus[text].text} style={{ color: orgStatus[text].color }} /> : ''
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 点击 创建组织
  const onClickCreateOrg = () => {
    setCreateOrgVisible(true)
  }

  // 关闭 创建组织弹窗
  const onCloseCreateOrg = (callback) => {
    setCreateOrgVisible(false);
    if (callback) {
      getOrgList();
    }
  }

  // 查询列表
  const getOrgList = () => {
    const paginator = (pageNum - 1) * pageSize;
    const params = {
      from: Number(moment(new Date()).format('x')),
      networkName,
      limit: pageSize,
      offset: paginator,
      networkVersion: '1.0.0',
    };
    dispatch({
      type: 'Organization/getOrgList',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  // 页码改变改变时，重新查询列表
  useEffect(() => {
    getOrgList();
  }, [pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <div className='table-header-btn-wrapper'>
          <Button type='primary' onClick={onClickCreateOrg}>创建组织</Button>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          loading={qryLoading}
          dataSource={orgList}
          onChange={onPageChange}
          pagination={{ pageSize, total: orgTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {createOrgVisible && <CreatePeerOrg visible={createOrgVisible} onCancel={onCloseCreateOrg} />}
    </div>
  );
}

export default connect(({ User, Layout, Organization, loading }) => ({
  User,
  Layout,
  Organization,
  qryLoading: loading.effects['Organization/getOrgList'],
}))(OrganizationManagement);
