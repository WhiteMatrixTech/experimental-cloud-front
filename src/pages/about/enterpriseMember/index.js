import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Modal, Table, Space, Row, Col, Form, Select, DatePicker, Input, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import cs from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';
import { statusList, validStatus } from './_config';

const { Item } = Form;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const initSearchObj = {
  companyName: '',
  createTimeStart: 0,
  createTimeEnd: 0,
  approvalStatus: 'any',
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterpriseMember');

function EnterpriseMember(props) {
  const { Member, qryLoading, dispatch, User } = props;
  const { networkName } = User;
  const { memberList, memberTotal } = Member;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState(initSearchObj);

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'companyCertBusinessNumber',
      key: 'companyCertBusinessNumber',
      ellipsis: true,
      width: '11%',
    },
    {
      title: '法人代表姓名',
      dataIndex: 'legalPersonName',
      key: 'legalPersonName',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactName',
      key: 'contactName',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '联系人手机号',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '联系人邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTimestamp',
      key: 'createTimestamp',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: '8%',
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      ellipsis: true,
      width: '8%',
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (text) => statusList[text],
      ellipsis: true,
      width: '8%',
    },
    {
      title: '可用状态',
      dataIndex: 'isValid',
      key: 'isValid',
      render: (text) => validStatus[text],
      ellipsis: true,
      width: '8%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          {record.approvalStatus === 'pending' && (
            <>
              <a onClick={() => onClickToConfirm(record, 'agree')}>通过</a>
              <a onClick={() => onClickToConfirm(record, 'reject')}>驳回</a>
            </>
          )}
          {record.isValid === 'valid' && record.approvalStatus === 'approved' && (
            <a onClick={() => onClickToConfirm(record, 'invalidate')}>停用</a>
          )}
          {record.isValid === 'invalid' && record.approvalStatus === 'approved' && (
            <a onClick={() => onClickToConfirm(record, 'validate')}>启用</a>
          )}
          <a onClick={() => onClickRbacConfig(record)}>访问策略配置</a>
          <a onClick={() => onClickDetail(record)}>详情</a>
        </Space>
      ),
    },
  ];

  const getMemberTotalDocs = () => {
    const params = {
      ...queryParams,
      networkName,
      from: Number(moment(new Date()).format('x')),
    };
    dispatch({
      type: 'Member/getMemberTotalDocs',
      payload: params,
    });
  };

  // 查询列表
  const getMemberList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      ...queryParams,
      networkName,
      offset,
      //isLeague: -1,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
    };
    dispatch({
      type: 'Member/getPageListOfCompanyMember',
      payload: params,
    });
  };

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          companyName: values.companyName,
          createTimeStart: isEmpty(values.createTime) ? 0 : Number(values.createTime[0].format('x')),
          createTimeEnd: isEmpty(values.createTime) ? 0 : Number(values.createTime[1].format('x')),
          approvalStatus: values.approvalStatus === null ? 'any' : values.approvalStatus,
        };
        setQueryParams(params);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, []);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setQueryParams(initSearchObj);
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  // 点击操作按钮, 进行二次确认
  const onClickToConfirm = (record, type) => {
    let tipTitle = '';
    let callback = null;
    switch (type) {
      case 'validate':
        tipTitle = '启用';
        callback = () => invalidateMember(record, 'valid');
        break;
      case 'invalidate':
        tipTitle = '停用';
        callback = () => invalidateMember(record, 'invalid');
        break;
      case 'agree':
        tipTitle = '通过';
        callback = () => approvalMember(record, 'approved');
        break;
      case 'reject':
        tipTitle = '驳回';
        callback = () => approvalMember(record, 'rejected');
        break;
      default:
        break;
    }
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要${tipTitle}成员 【${record.companyName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  // 停用 & 启用 企业成员
  const invalidateMember = (record, isValid) => {
    const params = {
      networkName,
      isValid,
      companyName: record.companyName,
    };
    dispatch({
      type: 'Member/setStatusOfLeagueConpany',
      payload: params,
    }).then((res) => {
      if (res) {
        getMemberList();
      }
    });
  };

  // 通过 & 驳回 企业成员
  const approvalMember = (record, approvalStatus) => {
    const params = {
      networkName,
      approvalStatus,
      companyName: record.companyName,
    };
    dispatch({
      type: 'Member/setCompanyApprove',
      payload: params,
    }).then((res) => {
      if (res) {
        getMemberList();
      }
    });
  };

  const onClickRbacConfig = (record) => {
    history.push({
      pathname: `/about/enterpriseMember/rbac-config`,
      state: {
        companyName: record.companyName,
      },
    });
  };

  // 点击查看详情
  const onClickDetail = (record) => {
    history.push({
      pathname: `/about/enterpriseMember/${record.companyCertBusinessNumber}`,
      state: {
        companyCertBusinessNumber: record.companyCertBusinessNumber,
        approvalStatus: record.approvalStatus,
        companyName: record.companyName,
        contactName: record.contactName,
        contactCell: record.contactCell,
        contactEmail: record.contactEmail,
      },
    });
  };

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getMemberList();
    getMemberTotalDocs();
  }, [queryParams, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className={cs(styles['search-wrapper'], 'page-content-shadow')}>
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label="企业名称" name="companyName" initialValue="">
                  <Input placeholder="请输入企业名称" />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="申请时间" name="createTime" initialValue={[]}>
                  <RangePicker
                    getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                    style={{ width: '100%' }}
                    showTime
                  />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="审批状态" name="approvalStatus" initialValue={null}>
                  <Select
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    placeholder="请选择审批状态"
                  >
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
            rowKey="_id"
            columns={columns}
            loading={qryLoading}
            dataSource={memberList}
            onChange={onPageChange}
            pagination={{
              pageSize,
              total: memberTotal,
              current: pageNum,
              position: ['bottomCenter'],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(({ User, Layout, Member, loading }) => ({
  User,
  Layout,
  Member,
  qryLoading: loading.effects['Member/getPageListOfCompanyMember'],
}))(EnterpriseMember);
