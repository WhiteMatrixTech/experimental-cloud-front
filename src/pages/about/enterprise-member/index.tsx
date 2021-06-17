import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, EnterpriseMemberSchema, history } from 'umi';
import { Modal, Table, Space, Row, Col, Form, Select, DatePicker, Input, Button, Divider, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import cs from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { Breadcrumb } from '~/components';
import baseConfig from '~/utils/config';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { statusList, validStatus } from './_config';
import ConfigMemberRole from './components/ConfigMemberRole';
import { ConnectState } from '~/models/connect';
import { ColumnsType } from 'antd/lib/table';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const initSearchObj = {
  companyName: '',
  createTimeStart: 0,
  createTimeEnd: 0,
  approvalStatus: 'any'
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterprise-member');
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

  const columns: ColumnsType<any> = [
    {
      title: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_USERNAME'),
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
      fixed: 'left',
      width: 160
    },
    // {
    //   title: '统一社会信用代码',
    //   dataIndex: 'companyCertBusinessNumber',
    //   key: 'companyCertBusinessNumber',
    //   ellipsis: true,
    //   width: 150,
    // },
    // {
    //   title: '法人代表姓名',
    //   dataIndex: 'legalPersonName',
    //   key: 'legalPersonName',
    //   ellipsis: true,
    //   width: 120,
    // },
    {
      title: Intl.formatMessage('BASS_USER_INFO_CONTACT_PERSON_NAME'),
      dataIndex: 'contactName',
      key: 'contactName',
      ellipsis: true,
      width: 120
    },
    {
      title: Intl.formatMessage('BASS_USER_INFO_CONTACT_PHONE'),
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      ellipsis: true,
      width: 120
    },
    {
      title: Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL'),
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      ellipsis: true,
      width: 180
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      dataIndex: 'createTimestamp',
      key: 'createTimestamp',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: 150
    },
    {
      title: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_APPROVAL_TIME'),
      dataIndex: 'approveTime',
      key: 'approveTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: 150
    },
    {
      title: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_APPROVAL_STATUS'),
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (text) => statusList[text],
      ellipsis: true,
      width: 120
    },
    {
      title: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_AVAILABLE_STATUS'),
      dataIndex: 'isValid',
      key: 'isValid',
      render: (text) => validStatus[text],
      ellipsis: true,
      width: 120
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      key: 'action',
      fixed: 'right',
      width: '22%',
      render: (text, record: EnterpriseMemberSchema) => (
        <Space size="small">
          {record.approvalStatus === 'pending' && (
            <>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'agree')}>
                {Intl.formatMessage('BASS_CONTRACT_PASSED')}
              </span>
              <Divider type="vertical" />
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'reject')}>
                {Intl.formatMessage('BASS_CONTRACT_NOT_PASSED')}
              </span>
              <Divider type="vertical" />
            </>
          )}
          {record.isValid === 'valid' && record.approvalStatus === 'approved' && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'invalidate')}>
                {Intl.formatMessage('BASS_MEMBER_MANAGEMENT_STOP')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          {record.isValid === 'invalid' && record.approvalStatus === 'approved' && (
            <div>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'validate')}>
                {Intl.formatMessage('BASS_MEMBER_MANAGEMENT_RESTART')}
              </span>
              <Divider type="vertical" />
            </div>
          )}
          <span role="button" className="table-action-span" onClick={() => onClickRbacConfig(record)}>
            {Intl.formatMessage('BASS_MEMBER_MANAGEMENT_CONFIG_ACCESS_LIMIT')}
          </span>
          <Divider type="vertical" />
          <a
            href={`/about/enterprise-member/${record.companyCertBusinessNumber}`}
            onClick={(e) => onClickDetail(e, record)}>
            {Intl.formatMessage('BASS_COMMON_DETAILED_INFORMATION')}
          </a>
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
          approvalStatus: values.approvalStatus === null ? 'any' : values.approvalStatus
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
    let callback = () => { };
    switch (type) {
      case 'validate':
        tipTitle = Intl.formatMessage('BASS_MEMBER_MANAGEMENT_RESTART');
        callback = () => invalidateMember(record, 'valid');
        break;
      case 'invalidate':
        tipTitle = Intl.formatMessage('BASS_MEMBER_MANAGEMENT_STOP');
        callback = () => invalidateMember(record, 'invalid');
        break;
      case 'agree':
        tipTitle = Intl.formatMessage('BASS_CONTRACT_PASSED');
        callback = () => approvalMember(record, 'approved');
        break;
      case 'reject':
        tipTitle = Intl.formatMessage('BASS_CONTRACT_NOT_PASSED');
        callback = () => approvalMember(record, 'rejected');
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: Intl.formatMessage('BASS_CONFIRM_ENTERPRISE_MEMBER_MODAL_CONTENT', {
        tipTitle,
        companyName: record.companyName
      }),
      okText: Intl.formatMessage('BASS_COMMON_CONFIRM'),
      cancelText: Intl.formatMessage('BASS_COMMON_CANCEL'),
      onOk: callback
    });
  };

  // 停用 & 启用 用户成员
  const invalidateMember = async (record: EnterpriseMemberSchema, isValid: string) => {
    const params = {
      networkName,
      isValid,
      companyName: record.companyName
    };
    const res = await dispatch({
      type: 'Member/setStatusOfLeagueCompany',
      payload: params
    });
    let { statusCode, result } = res;
    const succMessage =
      `${
        isValid === 'invalid'
          ? Intl.formatMessage('BASS_MEMBER_MANAGEMENT_STOP')
          : Intl.formatMessage('BASS_MEMBER_MANAGEMENT_RESTART')
      }  ` + Intl.formatMessage('BASS_NOTIFICATION_ENTERPRISE_MEMBER_STOP_USE');
    const failMessage =
      Intl.formatMessage('BASS_NOTIFICATION_ENTERPRISE_MEMBER_FAILED') +
      `${
        isValid === 'invalid'
          ? Intl.formatMessage('BASS_MEMBER_MANAGEMENT_STOP')
          : Intl.formatMessage('BASS_MEMBER_MANAGEMENT_RESTART')
      }  ` +
      Intl.formatMessage('BASS_NOTIFICATION_ENTERPRISE_MEMBER_USER');
    if (statusCode === 'ok' && result === 1) {
      getMemberList();
      notification.success({ message: succMessage, top: 64, duration: 3 });
    } else {
      notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
    }
  };

  // 通过 & 驳回 用户成员
  const approvalMember = async (record: EnterpriseMemberSchema, approvalStatus: string) => {
    const params = {
      networkName,
      approvalStatus,
      companyName: record.companyName
    };
    let res = await dispatch({
      type: 'Member/setCompanyApprove',
      payload: params
    });
    const { statusCode, result } = res;
    const succMessage =
      `${
        approvalStatus === 'isValid'
          ? Intl.formatMessage('BASS_CONTRACT_PASSED')
          : Intl.formatMessage('BASS_CONTRACT_NOT_PASSED')
      }  ` + Intl.formatMessage('BASS_NOTIFICATION_ENTERPRISE_MEMBER_STOP_USE');
    const failMessage =
      Intl.formatMessage('BASS_NOTIFICATION_ENTERPRISE_MEMBER_FAILED') +
      `${
        approvalStatus === 'isValid'
          ? Intl.formatMessage('BASS_CONTRACT_PASSED')
          : Intl.formatMessage('BASS_CONTRACT_NOT_PASSED')
      }  ` +
      Intl.formatMessage('BASS_NOTIFICATION_ENTERPRISE_MEMBER_USER');
    if (statusCode === 'ok' && result === 1) {
      getMemberList();
      notification.success({ message: succMessage, top: 64, duration: 3 });
    } else {
      notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
    }
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
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className={cs(styles['enterprise-wrapper'], 'page-content')}>
        <div className={cs(styles['search-wrapper'], 'page-content-shadow')}>
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label={Intl.formatMessage('BASS_MEMBER_MANAGEMENT_USERNAME')} name="companyName" initialValue="">
                  <Input placeholder={Intl.formatMessage('BASS_MEMBER_MANAGEMENT_INPUT_USERNAME')} />
                </Item>
              </Col>
              <Col span={8}>
                <Item label={Intl.formatMessage('BASS_COMMON_CREATE_TIME')} name="createTime" initialValue={[]}>
                  <RangePicker
                    getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
                    style={{ width: '100%' }}
                    showTime
                  />
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  label={Intl.formatMessage('BASS_MEMBER_MANAGEMENT_APPROVAL_STATUS')}
                  name="approvalStatus"
                  initialValue={null}>
                  <Select
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    placeholder={Intl.formatMessage('BASS_MEMBER_MANAGEMENT_SELECT_APPROVAL_STATUS')}>
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
          <Table
            rowKey="contactEmail"
            columns={columns}
            loading={qryLoading}
            dataSource={memberList}
            onChange={onPageChange}
            scroll={{ x: 1600, y: 300 }}
            pagination={{
              pageSize,
              total: memberTotal,
              current: pageNum,
              position: ['bottomCenter']
            }}
          />
        </div>
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
