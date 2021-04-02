import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Breadcrumb } from 'components';
import { Table, Button, Space, Form, Row, Col, Select, message } from 'antd';
import CreateFabricUserModal from './components/CreateFabricUserModal';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { orgStatusEnum } from '../organizations/_config';
import baseConfig from 'utils/config';
import styles from './index.less';

const { Item } = Form;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/fabricUsers');

function FabricRoleManagement(props) {
  const { dispatch, qryLoading = false } = props;
  const { orgList } = props.Organization;
  const { networkName, userRole } = props.User;
  const { fabricRoleList, fabricRoleTotal, myOrgInfo } = props.FabricRole;

  const [form] = Form.useForm();
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [searchParams, setSearchParams] = useState({ orgName: '' });

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const getFabricRoleList = () => {
    const { orgName } = searchParams;
    const params = {
      networkName,
    };
    if (orgName) {
      params.orgName = orgName;
      dispatch({
        type: 'FabricRole/getFabricRoleListWithOrg',
        payload: params,
      });
      return;
    }
    dispatch({
      type: 'FabricRole/getFabricRoleList',
      payload: params,
    });
  };

  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const onClickCreate = () => {
    if (myOrgInfo.orgStatus && myOrgInfo.orgStatus === orgStatusEnum.InUse) {
      setCreateModalVisible(true);
    } else {
      message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
    }
  };

  const onCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const onDownLoadSDK = (record) => {
    // token校验
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken,
    };

    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`,
      {
        headers,
        mode: 'cors',
        method: 'GET',
        responseType: 'blob',
      },
    ).then((res) => {
      const blob = new Blob([res]);
      saveAs(blob, `${record.userId}.json`);
    });
  };

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          orgName: values.orgName,
        };
        setSearchParams(params);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, []);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setSearchParams({ orgName: '' });
  };

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgList',
      payload: { networkName },
    });
  }, []);

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '用户名',
        dataIndex: 'userId',
        key: 'userId',
        ellipsis: true,
      },
      {
        title: '账户类型',
        dataIndex: 'explorerRole',
        key: 'explorerRole',
      },
      {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        ellipsis: true,
      },
      {
        title: '属性集',
        dataIndex: 'attrs',
        key: 'attrs',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="small">
            <a onClick={() => onDownLoadSDK(record)}>下载SDK配置</a>
          </Space>
        ),
      },
    ];
    setColumns(data);
  }, [userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getFabricRoleList();
  }, [pageNum, searchParams]);

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getMyOrgInfo',
      payload: { networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className="table-top-search-wrapper">
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label="组织名称" name="orgName" initialValue={null}>
                  <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="选择组织">
                    {orgList.map((item) => (
                      <Option key={item.orgName} value={item.orgName}>
                        {item.orgName}
                      </Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                <Space size="middle">
                  <Button onClick={resetForm}>重置</Button>
                  <Button type="primary" onClick={onSearch}>
                    查询
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="table-wrapper page-content-shadow">
          <div className={styles['table-header-btn-wrapper']}>
            <Button type="primary" onClick={onClickCreate}>
              新增用户
            </Button>
          </div>
          <Table
            rowKey={(record) => `${record.orgName}-${record.userId}`}
            loading={qryLoading}
            columns={columns}
            dataSource={fabricRoleList}
            onChange={onPageChange}
            pagination={{
              pageSize: baseConfig.pageSize,
              total: fabricRoleTotal,
              current: pageNum,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>
      </div>
      {createModalVisible && (
        <CreateFabricUserModal
          visible={createModalVisible}
          onCancel={onCloseCreateModal}
          getFabricRoleList={getFabricRoleList}
        />
      )}
    </div>
  );
}

export default connect(({ User, Organization, Layout, FabricRole, loading }) => ({
  User,
  Organization,
  Layout,
  FabricRole,
  qryLoading: loading.effects['FabricRole/getFabricRoleList'],
}))(FabricRoleManagement);
