import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, EnterpriseMemberSchema, history } from 'umi';
import { Modal, Table, Space, Row, Col, Form, Select, DatePicker, Input, Button, Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
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

  const renderMenu = (record: EnterpriseMemberSchema) => {
    return (
      <Menu>
        <Menu.Item>
          <span role="button" onClick={() => onClickRbacConfig(record)}>
            ??????????????????
          </span>
        </Menu.Item>
        <Menu.Item>
          <span role="button" onClick={() => onClickToConfirm(record, 'resetPassword')}>
            ????????????
          </span>
        </Menu.Item>
        <Menu.Item>
          <a
            href={`/about/enterprise-member/${record.companyCertBusinessNumber}`}
            onClick={(e) => onClickDetail(e, record)}>
            ??????
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: '?????????',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
      fixed: 'left',
      width: 160
    },
    {
      title: '???????????????',
      dataIndex: 'contactName',
      key: 'contactName',
      ellipsis: true,
      width: 120
    },
    {
      title: '??????????????????',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      ellipsis: true,
      width: 120
    },
    {
      title: '???????????????',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      ellipsis: true,
      width: 180
    },
    {
      title: '????????????',
      dataIndex: 'createTimestamp',
      key: 'createTimestamp',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: 150
    },
    {
      title: '????????????',
      dataIndex: 'approveTime',
      key: 'approveTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: 150
    },
    {
      title: '????????????',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (text) => statusList[text],
      ellipsis: true,
      width: 120
    },
    {
      title: '????????????',
      dataIndex: 'isValid',
      key: 'isValid',
      render: (text) => validStatus[text],
      ellipsis: true,
      width: 120
    },
    {
      title: '??????',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record: EnterpriseMemberSchema) => (
        <Space size="small">
          {record.approvalStatus === 'pending' && (
            <>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'agree')}>
                ??????
              </span>
              <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'reject')}>
                ??????
              </span>
            </>
          )}
          {record.isValid === 'valid' && record.approvalStatus === 'approved' && (
            <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'invalidate')}>
              ??????
            </span>
          )}
          {record.isValid === 'invalid' && record.approvalStatus === 'approved' && (
            <span role="button" className="table-action-span" onClick={() => onClickToConfirm(record, 'validate')}>
              ??????
            </span>
          )}
          <Dropdown overlay={renderMenu(record)} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              ?????? <DownOutlined />
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

  // ????????????
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

  // ??????
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
        console.log('????????????:', info);
      });
  }, [form]);

  // ??????
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setQueryParams(initSearchObj);
  };

  // ??????
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  // ??????????????????, ??????????????????
  const onClickToConfirm = (record: EnterpriseMemberSchema, type: string) => {
    let tipTitle = '';
    let callback = () => {};
    switch (type) {
      case 'validate':
        tipTitle = `???????????? ???${record.companyName}??? `;
        callback = () => invalidateMember(record, 'valid');
        break;
      case 'invalidate':
        tipTitle = `???????????? ???${record.companyName}??? `;
        callback = () => invalidateMember(record, 'invalid');
        break;
      case 'agree':
        tipTitle = `???????????? ???${record.companyName}??? `;
        callback = () => approvalMember(record, 'approved');
        break;
      case 'reject':
        tipTitle = `???????????? ???${record.companyName}??? `;
        callback = () => approvalMember(record, 'rejected');
        break;
      case 'resetPassword':
        tipTitle = `????????? ???${record.companyName}??? ????????????`;
        callback = () => resetPassword(record);
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `?????????${tipTitle}????`,
      okText: '??????',
      cancelText: '??????',
      onOk: callback
    });
  };

  const resetPassword = (record: EnterpriseMemberSchema) => {
    const params = {
      networkName,
      companyName: record.companyName
    };
    dispatch({
      type: 'Member/resetPassword',
      payload: params
    }).then((res: boolean) => {
      if (res) {
        getMemberList();
        getMemberTotalDocs();
      }
    });
  };

  // ?????? & ?????? ????????????
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

  // ?????? & ?????? ????????????
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

  // ??????????????????
  const onClickDetail = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: EnterpriseMemberSchema) => {
    e.preventDefault();
    history.push({
      pathname: `/about/enterprise-member/${record.companyCertBusinessNumber}`,
      state: record
    });
  };

  // ??????????????????????????????????????????????????????
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
                <Item label="?????????" name="companyName" initialValue="">
                  <Input placeholder="??????????????????" />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="????????????" name="createTime" initialValue={[]}>
                  <RangePicker
                    getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
                    style={{ width: '100%' }}
                    showTime
                  />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="????????????" name="approvalStatus" initialValue={null}>
                  <Select
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    placeholder="?????????????????????">
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
          <Table
            rowKey="contactEmail"
            columns={columns}
            loading={qryLoading}
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
