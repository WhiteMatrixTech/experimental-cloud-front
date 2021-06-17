import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import request from 'umi-request';
import { saveAs } from 'file-saver';
import { Breadcrumb } from '~/components';
import { Table, Button, Space, Form, Row, Col, Select, message } from 'antd';
import CreateFabricUserModal from './components/CreateFabricUserModal';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { OrgStatusEnum } from '../organizations/_config';
import baseConfig from '~/utils/config';
import styles from './index.less';
import { Dispatch, FabricRoleSchema } from 'umi';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

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
      message.warn(Intl.formatMessage('BASS_CONTRACT_MESSAGE_WARN_ADD_CONTRACT'));
    }
  };

  const onCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const onDownLoadSDK = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: FabricRoleSchema) => {
    e.preventDefault();
    // token校验
    const accessToken = localStorage.getItem('accessToken');
    const roleToken = localStorage.getItem('roleToken');
    let headers = {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken
    };

    request(
      `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`,
      {
        headers,
        mode: 'cors',
        method: 'GET',
        responseType: 'blob'
      }
    ).then((res: any) => {
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
      title: Intl.formatMessage('BASS_FABRIC_CHARACTER_NAME'),
      dataIndex: 'userId',
      key: 'userId',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_FABRIC_CHARACTER_TYPE'),
      dataIndex: 'explorerRole',
      key: 'explorerRole'
    },
    {
      title: Intl.formatMessage('BASS_COMMON_ORGANIZATION'),
      dataIndex: 'orgName',
      key: 'orgName',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_FABRIC_ATTRIBUTE_SETS'),
      dataIndex: 'attrs',
      key: 'attrs',
      ellipsis: true
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      width: 230,
      render: (_: any, record: FabricRoleSchema) => (
        <Space size="small">
          <a
            href={`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/fabricRole/${record.orgName}/${record.userId}/getUserCcp`}
            onClick={(e) => onDownLoadSDK(e, record)}>
            {Intl.formatMessage('BASS_FABRIC_DOWNLOAD_SDK_CONFIGURATION')}
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
  }, [dispatch, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className="table-top-search-wrapper">
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label={Intl.formatMessage('BASS_ORGANSIZATION_NAME')} name="orgNameSearch" initialValue={null}>
                  <Select
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    placeholder={Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')}>
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
                  <Button onClick={resetForm}>{Intl.formatMessage('BASS_COMMON_RESET')}</Button>
                  <Button type="primary" onClick={onSearch}>
                    {Intl.formatMessage('BASS_COMMON_QUERY')}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="table-wrapper page-content-shadow">
          <div className={styles['table-header-btn-wrapper']}>
            <Button type="primary" onClick={onClickCreate}>
              {Intl.formatMessage('BASS_FABRIC_NEW_FABRIC_ROLE')}
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
