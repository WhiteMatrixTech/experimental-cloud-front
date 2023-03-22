import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, EnterpriseMemberSchema, history } from 'umi';
import { Modal, Table, Space, Spin, Row, Col, Form, Select, DatePicker, Input, Button, Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import cs from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { PageTitle } from '~/components';
import baseConfig from '~/utils/config';
import styles from './index.less';
import { statusList, validStatus } from './_config';
import ConfigMemberRole from './components/ConfigMemberRole';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const { Item } = Form;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const initSearchObj = {
  companyName: '',
  createTimeStart: 0,
  createTimeEnd: 0,
  approvalStatus: ''
};

export interface EnterpriseMemberProps {
  Member: ConnectState['Member'];
  qryLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
}
function EnterpriseMember(props: EnterpriseMemberProps) {
  const { Member, qryLoading, dispatch, User } = props;
  const { networkName } = User;
  const { memberList, memberTotal } = Member;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState(initSearchObj);

  const [memberRecord, setMemberRecord] = useState<EnterpriseMemberSchema | null>(null);
  const [configVisible, setConfigVisible] = useState(false);

  const renderMenu = (record: EnterpriseMemberSchema) => {
    return (
      <Menu>
        <Menu.Item>
          <span role="button" onClick={() => onClickRbacConfig(record)}>
            配置访问权限
          </span>
        </Menu.Item>
        <Menu.Item>
          <a
            href={`/about/enterprise-member/${record.companyCertBusinessNumber}`}
            onClick={(e) => onClickDetail(e, record)}>
            详情
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: '用户名',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
      fixed: 'left',
      width: 160
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactName',
      key: 'contactName',
      ellipsis: true,
      width: 120
    },
    {
      title: '联系人手机号',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      ellipsis: true,
      width: 120
    },
    {
      title: '联系人邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      ellipsis: true,
      width: 180
    },
    {
      title: '创建时间',
      dataIndex: 'createTimestamp',
      key: 'createTimestamp',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: 150
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: 150
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (text) => statusList[text],
      ellipsis: true,
      width: 120
    },
    {
      title: '可用状态',
      dataIndex: 'isValid',
      key: 'isValid',
      render: (text) => validStatus[text],
      ellipsis: true,
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record: EnterpriseMemberSchema) => (
        <Space size="small">
          {record.approvalStatus === 'pending' && (
            <>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'agree')}>
                通过
              </span>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'reject')}>
                驳回
              </span>
            </>
          )}
          {record.isValid === 'valid' && record.approvalStatus === 'approved' && (
            <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'invalidate')}>
              停用
            </span>
          )}
          {record.isValid === 'invalid' && record.approvalStatus === 'approved' && (
            <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'validate')}>
              启用
            </span>
          )}
          <Dropdown overlay={renderMenu(record)} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      )
    }
  ];

  const getMemberTotalDocs = useCallback(() => {
    const params = {
      ...queryParams,
      networkName,
      from: Number(moment(new Date()).format('x'))
    };
    dispatch({
      type: 'Member/getMemberTotalDocs',
      payload: params
    });
  }, [dispatch, networkName, queryParams]);

  // 查询列表
  const getMemberList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      ...queryParams,
      networkName,
      offset,
      //isLeague: -1,
      limit: pageSize,
      from: Number(moment(new Date()).format('x'))
    };
    dispatch({
      type: 'Member/getPageListOfCompanyMember',
      payload: params
    });
  }, [dispatch, networkName, pageNum, pageSize, queryParams]);

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          companyName: values.companyName,
          createTimeStart: isEmpty(values.createTime) ? 0 : Number(values.createTime[0].format('x')),
          createTimeEnd: isEmpty(values.createTime) ? 0 : Number(values.createTime[1].format('x')),
          approvalStatus: values.approvalStatus === null ? '' : values.approvalStatus
        };
        setQueryParams(params);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, [form]);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setQueryParams(initSearchObj);
  };

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = (record: EnterpriseMemberSchema, type: string) => {
    let tipTitle = '';
    let callback = () => {};
    switch (type) {
      case 'validate':
        tipTitle = `启用成员 【${record.companyName}】 `;
        callback = () => invalidateMember(record, 'valid');
        break;
      case 'invalidate':
        tipTitle = `停用成员 【${record.companyName}】 `;
        callback = () => invalidateMember(record, 'invalid');
        break;
      case 'agree':
        tipTitle = `通过成员 【${record.companyName}】 `;
        callback = () => approvalMember(record, 'approved');
        break;
      case 'reject':
        tipTitle = `驳回成员 【${record.companyName}】 `;
        callback = () => approvalMember(record, 'rejected');
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确定要${tipTitle}吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback
    });
  };

  // 停用 & 启用 用户成员
  const invalidateMember = (record: EnterpriseMemberSchema, isValid: string) => {
    const params = {
      networkName,
      isValid,
      companyName: record.companyName
    };
    dispatch({
      type: 'Member/setStatusOfLeagueCompany',
      payload: params
    }).then((res: any) => {
      if (res) {
        getMemberList();
      }
    });
  };

  // 通过 & 驳回 用户成员
  const approvalMember = (record: EnterpriseMemberSchema, approvalStatus: string) => {
    const params = {
      networkName,
      approvalStatus,
      companyName: record.companyName
    };
    dispatch({
      type: 'Member/setCompanyApprove',
      payload: params
    }).then((res: any) => {
      if (res) {
        getMemberList();
      }
    });
  };

  const onClickRbacConfig = (record: EnterpriseMemberSchema) => {
    setConfigVisible(true);
    setMemberRecord(record);
  };

  const onCloseModal = () => {
    setConfigVisible(false);
    setMemberRecord(null);
    getMemberList();
  };

  // 点击查看详情
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: EnterpriseMemberSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/enterprise-member/${record.companyCertBusinessNumber}`,
      state: record
    });
  };

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getMemberList();
    getMemberTotalDocs();
  }, [queryParams, pageNum, getMemberList, getMemberTotalDocs]);

  return (
    <div className="page-wrapper">
      <PageTitle label="成员管理" />
      <div className={cs(styles['enterprise-wrapper'], 'page-content')}>
        <Spin spinning={qryLoading}>
          <div className={cs(styles['search-wrapper'], 'page-content-shadow')}>
            <Form form={form}>
              <Row gutter={24} justify="space-between">
                <Col span={7}>
                  <Item label="用户名" name="companyName" initialValue="">
                    <Input placeholder="请输入用户名" />
                  </Item>
                </Col>
                <Col span={7}>
                  <Item label="创建时间" name="createTime" initialValue={[]}>
                    <RangePicker
                      getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
                      style={{ width: '100%' }}
                      showTime
                    />
                  </Item>
                </Col>
                <Col span={7}>
                  <Item label="审批状态" name="approvalStatus" initialValue={null}>
                    <Select
                      allowClear
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      placeholder="请选择审批状态">
                      {Object.keys(statusList).map((item) => (
                        <Option key={item} value={item}>
                          {statusList[item]}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Col>
                <Col span={8} offset={16} style={{ textAlign: 'right' }}>
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
            <Table
              rowKey="contactEmail"
              columns={columns}
              dataSource={memberList}
              onChange={onPageChange}
              scroll={{ x: 1540, y: 300 }}
              pagination={{
                pageSize,
                total: memberTotal,
                current: pageNum,
                position: ['bottomCenter']
              }}
            />
          </div>
        </Spin>
      </div>
      {configVisible && <ConfigMemberRole visible={configVisible} onCancel={onCloseModal} record={memberRecord} />}
    </div>
  );
}

export default connect(({ User, Layout, Member, loading }: ConnectState) => ({
  User,
  Layout,
  Member,
  qryLoading: loading.effects['Member/getPageListOfCompanyMember']
}))(EnterpriseMember);
