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
import { MemberApprovalStatus, statusList } from './_config';
import ConfigMemberRole from './components/ConfigMemberRole';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';

const { Item } = Form;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const initSearchObj = {
  email: '',
  applicationTimeStart: 0,
  applicationTimeEnd: 0
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
            配置访问策略
          </span>
        </Menu.Item>
        <Menu.Item>
          <a href={`/about/member/${record.name}`} onClick={(e) => onClickDetail(e, record)}>
            详情
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      fixed: 'left',
      width: 120
    },
    {
      title: '手机号',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
      ellipsis: true,
      width: 120
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      width: 180
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      ellipsis: true,
      width: 150
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => statusList[text],
      ellipsis: true,
      width: 120
    },
    {
      title: '可用状态',
      dataIndex: 'disabled',
      key: 'disabled',
      render: (text: boolean) => (text ? '停用' : '启用'),
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
          {record.status === MemberApprovalStatus.PENDING && (
            <>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'agree')}>
                通过
              </span>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'reject')}>
                驳回
              </span>
            </>
          )}
          {!record.disabled && record.status === MemberApprovalStatus.PASSED && (
            <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'invalidate')}>
              停用
            </span>
          )}
          {record.disabled && record.status === MemberApprovalStatus.PASSED && (
            <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'validate')}>
              启用
            </span>
          )}
          <Dropdown overlay={renderMenu(record)} trigger={['hover', 'click']}>
            <span role="button" className="table-action-span">
              更多 <DownOutlined />
            </span>
          </Dropdown>
        </Space>
      )
    }
  ];

  const getMemberTotal = useCallback(() => {
    const params = {
      ...queryParams,
      networkName,
      from: Number(moment(new Date()).format('x'))
    };
    dispatch({
      type: 'Member/getMemberTotal',
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
      limit: pageSize
    };
    dispatch({
      type: 'Member/getMemberList',
      payload: params
    });
  }, [dispatch, networkName, pageNum, pageSize, queryParams]);

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          email: values.email,
          applicationTimeStart: isEmpty(values.createTime) ? 0 : Number(values.createTime[0].format('x')),
          applicationTimeEnd: isEmpty(values.createTime) ? 0 : Number(values.createTime[1].format('x')),
          approvalStatus: values.approvalStatus
        };
        if (!params.approvalStatus) {
          delete params.approvalStatus;
        }
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
        tipTitle = `启用成员 【${record.name}】 `;
        callback = () => invalidateMember(record, false);
        break;
      case 'invalidate':
        tipTitle = `停用成员 【${record.name}】 `;
        callback = () => invalidateMember(record, true);
        break;
      case 'agree':
        tipTitle = `通过成员 【${record.name}】 `;
        callback = () => approvalMember(record, true);
        break;
      case 'reject':
        tipTitle = `驳回成员 【${record.name}】 `;
        callback = () => approvalMember(record, false);
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
  const invalidateMember = (record: EnterpriseMemberSchema, disable: boolean) => {
    const params = {
      networkName,
      disable,
      email: record.email
    };
    dispatch({
      type: 'Member/validateMember',
      payload: params
    }).then((res: any) => {
      if (res) {
        getMemberList();
      }
    });
  };

  // 通过 & 驳回 用户成员
  const approvalMember = (record: EnterpriseMemberSchema, passed: boolean) => {
    const params = {
      networkName,
      passed,
      email: record.email
    };
    dispatch({
      type: 'Member/approveMember',
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
      pathname: `/about/member/${record.email}`,
      state: record
    });
  };

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getMemberList();
    getMemberTotal();
  }, [queryParams, pageNum, getMemberList, getMemberTotal]);

  return (
    <div className="page-wrapper">
      <PageTitle label="成员管理" />
      <div className={cs(styles['enterprise-wrapper'], 'page-content')}>
        <Spin spinning={qryLoading}>
          <div className={cs(styles['search-wrapper'], 'page-content-shadow')}>
            <Form form={form}>
              <Row gutter={24} justify="space-between">
                <Col span={7}>
                  <Item label="用户邮箱" name="email" initialValue="">
                    <Input placeholder="请输入用户邮箱" />
                  </Item>
                </Col>
                <Col span={7}>
                  <Item label="审批时间" name="createTime" initialValue={[]}>
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
              rowKey="email"
              columns={columns}
              dataSource={memberList}
              onChange={onPageChange}
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
  qryLoading: loading.effects['Member/getMemberList']
}))(EnterpriseMember);
