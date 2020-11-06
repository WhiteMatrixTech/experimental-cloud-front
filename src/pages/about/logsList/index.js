import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { Table, Row, Col, Form, DatePicker, Input, Button } from 'antd';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const { Item } = Form;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 8, },
  wrapperCol: { span: 16 }
};
const initSearchObj = {
  logIp: '',
  createTimeStart: 0,
  createTimeEnd: 0,
  logContent: ''
}

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/logsList')

function LogsList(props) {
  const { Logs, qryLoading } = props;
  const { logsList, logsTotal } = Logs;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState(initSearchObj);

  const columns = [
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'IP地址',
      dataIndex: 'logIp',
      key: 'logIp',
    },
    {
      title: '日志内容',
      dataIndex: 'logContent',
      key: 'logContent',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
  ]

  // 查询列表
  const getLogsList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      ...queryParams,
      offset,
      isLeague: -1,
      limit: pageSize,
      from: Number(moment(new Date()).format('x'))
    }
    dispatch({
      type: 'Logs/getLogsList',
      payload: params
    })
  }

  // 搜索
  const onSearch = useCallback(() => {
    form.validateFields().then(values => {
      const params = {
        logIp: values.logIp,
        createTimeStart: isEmpty(values.createTime) ? 0 : Number(values.createTime[0].format('x')),
        createTimeEnd: isEmpty(values.createTime) ? 0 : Number(values.createTime[1].format('x')),
        logContent: values.logContent
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

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getLogsList();
  }, [pageNum, queryParams]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <div className={styles['search-wrapper']}>
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label='IP地址' name='logIp' initialValue=''>
                  <Input placeholder='请输入IP地址' />
                </Item>
              </Col>
              <Col span={8}>
                <Item label='申请时间' name='createTime' initialValue={[]}>
                  <RangePicker
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                    style={{ width: '100%' }}
                    showTime
                  />
                </Item>
              </Col>
              <Col span={8} >
                <Item label='操作内容' name='logContent' initialValue=''>
                  <Input placeholder='请输入操作内容' />
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
          rowKey='id'
          columns={columns}
          loading={qryLoading}
          dataSource={logsList}
          onChange={onPageChange}
          pagination={{ pageSize, total: logsTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  )
}

export default connect(({ Logs, loading }) => ({
  Logs,
  qryLoading: loading.effects['Logs/getLogsList'],
}))(LogsList);
