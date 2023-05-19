import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Table, Button, Space, Form, Row, Col, Select, message, notification, Spin } from 'antd';
import { PageTitle, PlaceHolder } from '~/components';
import CreateFabricUserModal from './components/CreateFabricUserModal';
import { OrgStatus } from '../organizations/_config';
import baseConfig from '~/utils/config';
import { Dispatch, FabricRoleSchema } from 'umi';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { cancelCurrentRequest } from '~/utils/request';
import { DownloadSdkModal } from './components/DownloadSdkModal';
import { renderDateWithDefault } from '~/utils/date';

const { Item } = Form;
const Option = Select.Option;
export interface FabricRoleManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  Organization: ConnectState['Organization'];
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  FabricRole: ConnectState['FabricRole'];
}
const FabricRoleManagement: React.FC<FabricRoleManagementProps> = (props) => {
  const { dispatch, Channel, qryLoading = false } = props;
  const { networkName } = props.User;
  const { fabricRoleList, fabricRoleTotal, myOrgInfo, myAccessibleOrgs,currentRoleChannelList } = props.FabricRole;

  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [searchParams, setSearchParams] = useState({ orgName: '' });

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [downloadSdkModalVisible, setDownloadSdkModalVisible] = useState(false);
  const [downloadSdkRecord, setDownloadSdkRecord] = useState<FabricRoleSchema | null>(null);

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
    if (myOrgInfo && myOrgInfo.orgStatus && myOrgInfo.orgStatus === OrgStatus.IN_USE) {
      setCreateModalVisible(true);
    } else {
      message.warn('请先在【组织管理】中添加您的组织，并确保您的组织在使用中');
    }
  };

  const onCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const onDownLoadSDK = (record: FabricRoleSchema) => {
    setDownloadSdkModalVisible(true);
    setDownloadSdkRecord(record);
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
      dataIndex: 'username',
      key: 'username',
      ellipsis: true
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      key: 'roleType'
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
      ellipsis: true,
      render: (text: string) => <PlaceHolder text={text} />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: renderDateWithDefault
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FabricRoleSchema) => (
        <Space size="small">
          <span className="action-link" onClick={() => onDownLoadSDK(record)}>
            下载SDK配置
          </span>
        </Space>
      )
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getMyAccessibleOrgs',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getCurrentRoleChannelList',
      payload: { networkName, org: downloadSdkRecord?.orgName }
    });
  }, [dispatch, downloadSdkRecord?.orgName, networkName]);

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
                      {myAccessibleOrgs.map((item) => (
                        <Option key={item} value={item}>
                          {item}
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
            rowKey={(record: FabricRoleSchema) => `${record.orgName}-${record.username}`}
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
      {downloadSdkModalVisible && downloadSdkRecord && (
        <DownloadSdkModal
          networkName={networkName}
          record={downloadSdkRecord}
          onCancel={() => {
            setDownloadSdkModalVisible(false);
            setDownloadSdkRecord(null);
          }}
          channelList={currentRoleChannelList}
        />
      )}
    </div>
  );
};

export default connect(({ User, Organization, Layout, Channel, FabricRole, loading }: ConnectState) => ({
  User,
  Organization,
  Layout,
  FabricRole,
  Channel,
  qryLoading: loading.effects['FabricRole/getFabricRoleList'] || loading.effects['FabricRole/getFabricRoleListWithOrg']
}))(FabricRoleManagement);
