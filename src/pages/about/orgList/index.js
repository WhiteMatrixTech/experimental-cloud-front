import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { Table } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/orgList')

function OrganizationManagement(props) {
  const { Organization, qryLoading } = props;
  const { orgList, orgTotal } = Organization;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const dispatch = useDispatch();

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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  ];
  // 查询列表
  const getOrgList = () => {
    const paginator = (pageNum - 1) * pageSize;
    const params = {
      limit: pageSize,
      paginator: paginator
    }
    dispatch({
      type: 'Organization/getOrgList',
      payload: params
    })
  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 页码改变改变时，重新查询列表
  useEffect(() => {
    getOrgList();
  }, [pageNum]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <Table
          rowKey='peerOrgId'
          columns={columns}
          loading={qryLoading}
          dataSource={orgList}
          onChange={onPageChange}
          pagination={{ pageSize, total: orgTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  )
}

export default connect(({ Layout, Organization, loading }) => ({
  Layout,
  Organization,
  qryLoading: loading.effects['Organization/getOrgList'],
}))(OrganizationManagement);
