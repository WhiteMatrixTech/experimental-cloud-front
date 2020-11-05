import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "dva";
import { history } from 'umi';
import { Table, Space, Row, Col, Form, Select, DatePicker, Input, Button } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const { Item } = Form;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { span: 8, },
  wrapperCol: { span: 16 }
};

const statusList = [ // 审批状态
  { id: 0, name: '未审批' },
  { id: 1, name: '通过' },
  { id: 2, name: '驳回' }
]

function Channel(props) {
  const { Channel, qryLoading } = props;
  const { transactionList, transactionTotal } = Channel;
  const [pageNum, setPageNum] = useState(1);
  const { queryParams, setQueryParams } = useState({});
  const [pageSize] = useState(baseConfig.pageSize);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/enterpriseMember')
  const columns = [
    {
      title: '交易ID',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: '17%'
    },
    {
      title: '所属通道',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '交易组织',
      dataIndex: 'txEndorseMsp',
      key: 'txEndorseMsp',
    },
    {
      title: '合约名称',
      dataIndex: 'chainCodeName',
      key: 'chainCodeName',
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => onClickDetail(record)}>详情</a>
        </Space>
      ),
    },
  ]

  // 查询列表
  const getBlockList = () => {
    const paginator = (pageNum - 1) * pageSize;
    const params = {
      companyId: 1,
      limit: pageSize,
      paginator: paginator
    }
    dispatch({
      type: 'Channel/getTransactionList',
      payload: params
    })
  }

  // 搜索
  const onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setQueryParams(value || '')
    }
  }

  // 重置
  const resetForm = () => {

  }

  // 翻页
  const onPageChange = pageInfo => {
    setPageNum(pageInfo.current)
  }

  // 点击查看详情
  const onClickDetail = record => {
    history.push({
      pathname: `/about/channel/${record.txId}`,
      query: {
        channelId: record.txId,
      },
    })
  }

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getBlockList();
  }, [pageNum, queryParams]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content'>
        <div className={styles['search-wrapper']}>
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label='文件名称' name='companyName' initialValue=''>

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
                <Item label='审批状态' name='leagueCompanyStatus' initialValue={[]}>
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    placeholder='请选择审批状态'
                  >
                    {statusList.map(item =>
                      <Option key={item.id} value={item.id}>{item.name}</Option>
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
          rowKey='txId'
          columns={columns}
          loading={qryLoading}
          dataSource={transactionList}
          onChange={onPageChange}
          pagination={{ pageSize, total: transactionTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  )
}

export default connect(({ Layout, Channel, loading }) => ({
  Layout,
  Channel,
  qryLoading: loading.effects['Channel/getTransactionList'],
}))(Channel);
