import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Breadcrumb } from '~/components';
import { Table, Button, Space, Form, Row, Col, Select, message, notification, Spin } from 'antd';
import CreateFabricUserModal from './components/CreateFabricUserModal';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { OrgStatusEnum } from '../organizations/_config';
import baseConfig from '~/utils/config';
import styles from './index.less';
import { Dispatch, FabricRoleSchema } from 'umi';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { cancelCurrentRequest } from '~/utils/request';

const { Item } = Form;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/fabricUsers');
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
    if (myOrgInfo && myOrgInfo.orgStatus && myOrgInfo.orgStatus === OrgStatusEnum.InUse) {
      setCreateModalVisible(true);
    } else {
      message.warn('????????????????????????????????????????????????????????????????????????????????????');
    }
  };

  const onCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const onDownLoadSDK = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: FabricRoleSchema) => {
    e.preventDefault();

    setDownloading(true);

    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`,
      {
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
          notification.error({ message: 'SDK??????????????????', top: 64, duration: 3 });
        }
      });
  };

  // ??????
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
        console.log('????????????:', info);
      });
  }, [form]);

  // ??????
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setSearchParams({ orgName: '' });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Fabric?????????',
      dataIndex: 'userId',
      key: 'userId',
      ellipsis: true
    },
    {
      title: '????????????',
      dataIndex: 'explorerRole',
      key: 'explorerRole'
    },
    {
      title: '????????????',
      dataIndex: 'orgName',
      key: 'orgName',
      ellipsis: true
    },
    {
      title: '?????????',
      dataIndex: 'attrs',
      key: 'attrs',
      ellipsis: true
    },
    {
      title: '????????????',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '??????',
      key: 'action',
      render: (_: any, record: FabricRoleSchema) => (
        <Space size="small">
          <a
            href={`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`}
            onClick={(e) => onDownLoadSDK(e, record)}>
            ??????SDK??????
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

  // ??????????????????????????????????????????????????????
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
      <Spin spinning={downloading} tip="?????????...">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <div className="table-top-search-wrapper">
            <Form {...formItemLayout} colon={false} form={form}>
              <Row gutter={24}>
                <Col span={8}>
                  <Item label="????????????" name="orgNameSearch" initialValue={null}>
                    <Select
                      allowClear
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      placeholder="????????????">
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
                    <Button onClick={resetForm}>??????</Button>
                    <Button type="primary" onClick={onSearch}>
                      ??????
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="table-wrapper page-content-shadow">
            <div className={styles['table-header-btn-wrapper']}>
              <Button type="primary" onClick={onClickCreate}>
                ??????Fabric??????
              </Button>
            </div>
            <Table
              rowKey={(record: FabricRoleSchema) => `${record.orgName}-${record.userId}`}
              loading={qryLoading}
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
          </div>
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
  qryLoading: loading.effects['FabricRole/getFabricRoleList']
}))(FabricRoleManagement);
