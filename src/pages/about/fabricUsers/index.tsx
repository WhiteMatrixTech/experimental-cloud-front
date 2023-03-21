import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Table, Button, Space, Form, Row, Col, Select, message, notification, Spin } from 'antd';
import { PageTitle } from '~/components';
import CreateFabricUserModal from './components/CreateFabricUserModal';
import { OrgStatus } from '../organizations/_config';
import baseConfig from '~/utils/config';
import { Dispatch, FabricRoleSchema } from 'umi';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { getTokenData } from '~/utils/encryptAndDecrypt';
import { cancelCurrentRequest } from '~/utils/request';

const { Item } = Form;
const Option = Select.Option;
export interface FabricRoleManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  Organization: ConnectState['Organization'];
  User: ConnectState['User'];
  FabricRole: ConnectState['FabricRole'];
}
const FabricRoleManagement: React.FC<FabricRoleManagementProps> = (props) => {
  const { dispatch, qryLoading = false } = props;
  const { orgList } = props.Organization;
  const { networkName } = props.User;
  const { fabricRoleList, fabricRoleTotal, myOrgInfo } = props.FabricRole;

  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [searchParams, setSearchParams] = useState({ orgName: '' });

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getFabricRoleList = useCallback(() => {
    const { orgName } = searchParams;
    const params: { networkName: string; orgName?: string } = {
      networkName
    };
    if (orgName) {
      params.orgName = orgName;
      dispatch({
        type: 'FabricRole/getFabricRoleListWithOrg',
        payload: params
      });
      return;
    }
    dispatch({
      type: 'FabricRole/getFabricRoleList',
      payload: params
    });
  }, [dispatch, networkName, searchParams]);

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onClickCreate = () => {
    if (myOrgInfo && myOrgInfo.orgStatus && myOrgInfo.orgStatus === OrgStatus.InUse) {
      setCreateModalVisible(true);
    } else {
      message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
    }
  };

  const onCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const onDownLoadSDK = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: FabricRoleSchema) => {
    e.preventDefault();
    // token校验
    const { accessToken, roleToken } = getTokenData();
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken
    };
    setDownloading(true);
    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`,
      {
        headers,
        mode: 'cors',
        method: 'GET',
        responseType: 'blob'
      }
    )
      .then((res: any) => {
        setDownloading(false);
        const blob = new Blob([res]);
        saveAs(blob, `${record.userId}.json`);
      })
      .catch((errMsg) => {
        // DOMException: The user aborted a request.
        if (!errMsg) {
          setDownloading(false);
          notification.error({ message: 'SDK配置下载失败', top: 64, duration: 3 });
        }
      });
  };

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          orgName: values.orgNameSearch
        };
        setSearchParams(params);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, [form]);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setSearchParams({ orgName: '' });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Fabric角色名',
      dataIndex: 'userId',
      key: 'userId',
      ellipsis: true
    },
    {
      title: '角色类型',
      dataIndex: 'explorerRole',
      key: 'explorerRole'
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      key: 'orgName',
      ellipsis: true
    },
    {
      title: '属性集',
      dataIndex: 'attrs',
      key: 'attrs',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FabricRoleSchema) => (
        <Space size="small">
          <a
            href={`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`}
            onClick={(e) => onDownLoadSDK(e, record)}>
            下载SDK配置
          </a>
        </Space>
      )
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgList',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getFabricRoleList();
  }, [getFabricRoleList, pageNum, searchParams]);

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getMyOrgInfo',
      payload: { networkName }
    });
    return () => cancelCurrentRequest();
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Spin spinning={downloading} tip="下载中...">
        <PageTitle
          label="Fabric角色管理"
          extra={
            <Button type="primary" onClick={onClickCreate}>
              新增Fabric角色
            </Button>
          }
        />
        <div className="table-wrapper page-content-shadow">
          <Spin spinning={qryLoading}>
            <div className="table-header-search-wrapper">
              <Form colon={false} form={form}>
                <Row gutter={24}>
                  <Col span={8}>
                    <Item label="组织名称" name="orgNameSearch" initialValue={null}>
                      <Select
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder="选择组织">
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
            <Table
              rowKey={(record: FabricRoleSchema) => `${record.orgName}-${record.userId}`}
              columns={columns}
              dataSource={fabricRoleList}
              onChange={onPageChange}
              pagination={{
                pageSize: baseConfig.pageSize,
                total: fabricRoleTotal,
                current: pageNum,
                showSizeChanger: false,
                position: ['bottomCenter']
              }}
            />
          </Spin>
        </div>
        {createModalVisible && (
          <CreateFabricUserModal
            visible={createModalVisible}
            onCancel={onCloseCreateModal}
            getFabricRoleList={getFabricRoleList}
          />
        )}
      </Spin>
    </div>
  );
};

export default connect(({ User, Organization, Layout, FabricRole, loading }: ConnectState) => ({
  User,
  Organization,
  Layout,
  FabricRole,
  qryLoading: loading.effects['FabricRole/getFabricRoleList'] || loading.effects['FabricRole/getFabricRoleListWithOrg']
}))(FabricRoleManagement);
