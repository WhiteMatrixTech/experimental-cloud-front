import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { history } from 'umi';
import { Popconfirm, Table, Space, Row, Col, Form, Select, DatePicker, Input, Button } from 'antd';
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
  labelCol: { span: 8, },
  wrapperCol: { span: 16 }
};
const initSearchObj = {
  companyName: '',
  createTimeStart: 0,
  createTimeEnd: 0,
  approvalStatus: -1
}

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterpriseMember')

function EnterpriseMember(props) {
  const { Member, qryLoading } = props;
  const { memberList, memberTotal } = Member;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState(initSearchObj);

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
      width: '11%'
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'companyCertBusinessNumber',
      key: 'companyCertBusinessNumber',
      ellipsis: true,
      width: '11%'
    },
    {
      title: '法人代表姓名',
      dataIndex: 'legalPersonName',
      key: 'legalPersonName',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactName',
      key: 'contactName',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '联系人手机号',
      dataIndex: 'contactCell',
      key: 'contactCell',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '联系人邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: text => statusList[text],
      ellipsis: true,
      width: '8%'
    },
    {
      title: '可用状态',
      dataIndex: 'isValid',
      key: 'isValid',
      render: text => validStatus[text],
      ellipsis: true,
      width: '8%'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {record.approvalStatus === 0 &&
            <>
              <Popconfirm
                title={`确认要通过 【${record.companyName}】 吗?`}
                onConfirm={() => approvalMember(record, 1)}
                okText="确认"
                cancelText="取消"
              ><a >通过</a>
              </Popconfirm>
              <Popconfirm
                title={`确认要驳回 【${record.companyName}】 吗?`}
                onConfirm={() => approvalMember(record, 2)}
                okText="确认"
                cancelText="取消"
              ><a >驳回</a>
              </Popconfirm>
            </>
          }
          {(record.isValid === 1 && record.approvalStatus === 1) &&
            <Popconfirm
              title={`确认要停用 【${record.companyName}】 吗?`}
              onConfirm={() => invalidateMember(record, 0)}
              okText="确认"
              cancelText="取消"
            ><a >停用</a>
            </Popconfirm>
          }
          {(record.isValid === 0 && record.approvalStatus === 1) &&
            <Popconfirm
              title={`确认要启用 【${record.companyName}】 吗?`}
              onConfirm={() => invalidateMember(record, 1)}
              okText="确认"
              cancelText="取消"
            ><a>启用</a>
            </Popconfirm>
          }
          <a onClick={() => onClickDetail(record)}>详情</a>
        </Space>
      ),
    },
  ]

  // 查询列表
  const getMemberList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      ...queryParams,
      offset,
      isLeague: -1,
      limit: pageSize,
      from: Number(moment(new Date()).format('x'))
    }
    dispatch({
      type: 'Member/getPageListOfCompanyMember',
      payload: params
    })
  }

  // 搜索
  const onSearch = useCallback(() => {
    form.validateFields().then(values => {
      const params = {
        companyName: values.companyName,
        createTimeStart: isEmpty(values.createTime) ? 0 : Number(values.createTime[0].format('x')),
        createTimeEnd: isEmpty(values.createTime) ? 0 : Number(values.createTime[1].format('x')),
        approvalStatus: values.approvalStatus === null ? -1 : values.approvalStatus
      }
      setQueryParams(params)
    }).catch(info => {
      console.log('校验失败:', info);
    })
  }, [])

  // 重置
  const resetForm = () => {
    form.resetFields()
    setPageNum(1)
    setQueryParams(initSearchObj)
  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 停用 & 启用 企业成员
  const invalidateMember = (record, isValid) => {
    dispatch({
      type: 'Member/setStatusOfLeagueConpany',
      payload: {
        isValid,
        id: record._id
      }
    }).then(res => {
      if (res) {
        getMemberList()
      }
    })
  }

  // 通过 & 驳回 企业成员
  const approvalMember = (record, approvalStatus) => {
    dispatch({
      type: 'Member/setCompanyApprove',
      payload: {
        approvalStatus,
        id: record._id
      }
    }).then(res => {
      if (res) {
        getMemberList()
      }
    })
  }

  // 点击查看详情
  const onClickDetail = record => {
    history.push({
      pathname: `/about/enterpriseMember/${record._id}`,
      query: {
        id: record._id,
      },
    })
  }

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getMemberList();
  }, [pageNum, queryParams]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <div className={styles['search-wrapper']}>
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label='企业名称' name='companyName' initialValue=''>

                  <Input placeholder='请输入企业名称' />
                </Item>
              </Col>
              <Col span={8}>
                <Item label='申请时间' name='createTime' initialValue={[]}>
                  <RangePicker
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                    style={{ width: '100%' }}
                    // format="YYYY-MM-DD HH:mm:ss"
                    showTime
                  />
                </Item>
              </Col>
              <Col span={8} >
                <Item label='审批状态' name='approvalStatus' initialValue={null}>
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    placeholder='请选择审批状态'
                  >
                    {Object.keys(statusList).map(item =>
                      <Option key={item} value={item}>{statusList[item]}</Option>
                    )}
                  </Select>
                </Item>
              </Col>
              <Col span={8} offset={16} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={onSearch} >查询</Button>
                <Button style={{ marginLeft: '10px' }} onClick={resetForm}>重置</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey='_id'
          columns={columns}
          loading={qryLoading}
          dataSource={memberList}
          onChange={onPageChange}
          pagination={{ pageSize, total: memberTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  )
}

export default connect(({ Layout, Member, loading }) => ({
  Layout,
  Member,
  qryLoading: loading.effects['Member/getPageListOfCompanyMember'],
}))(EnterpriseMember);
