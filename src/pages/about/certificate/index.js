import React, { useState, useEffect, useCallback } from 'react';
import { connect } from "dva";
import { Table, Row, Col, Form, Select, Input, Button, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import baseConfig from 'utils/config';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import CertificateUpload from './components/CertificateUpload';
import { SecretType } from './_config';
import styles from './index.less';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 8, },
  wrapperCol: { span: 16 }
};
const initSearchObj = {
  certificateName: '',
  certificateSecretType: ''
}

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/certificate')

function Certificate(props) {
  const { Certificate, qryLoading, dispatch,User } = props;
  const {networkName} = User;
  const { certificateList = [], certificateTotal = 0 } = Certificate;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(baseConfig.pageSize);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [queryParams, setQueryParams] = useState(initSearchObj);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '证书名称',
      dataIndex: 'certificateName',
      key: 'certificateName',
    },
    {
      title: '密钥类型',
      dataIndex: 'certificateSecretType',
      key: 'certificateSecretType',
      render: text => text || SecretType[text]
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <a>下载</a>
        </Space>
      ),
    },
  ]

  // 查询列表
  const getCertificateList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      ...queryParams,
      offset,
      ascend: false,
      limit: pageSize,
      from: Number(moment(new Date()).format('x'))
    }
    dispatch({
      type: 'Certificate/getCertificateList',
      payload: params
    })
  }

  // 搜索
  const onSearch = useCallback(() => {
    form.validateFields().then(values => {
      const params = {
        networkName,
        certificateName: values.certificateName,
        certificateSecretType: values.certificateSecretType
      }
      setQueryParams(params)
    }).catch(info => {
      console.log('校验失败:', info);
    })
  }, [])

  // 点击证书上传
  const onClickUpload = () => {
    setUploadVisible(true)
  }

  // 取消证书上传
  const onCloseUpload = () => {
    setUploadVisible(false)
  }

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
    getCertificateList();
  }, [pageNum, queryParams]);

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <div className={styles['search-wrapper']}>
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label='密钥类型' name='certificateSecretType' initialValue={null}>
                  <Select
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                    style={{ width: '100%' }}
                    placeholder='请选择密钥类型'
                  >
                    {Object.keys(SecretType).map(item =>
                      <Option key={item} value={item}>{SecretType[item]}</Option>
                    )}
                  </Select>
                </Item>
              </Col>
              <Col span={8}>
                <Item label='证书名称' name='certificateName' initialValue=''>
                  <Input placeholder='请输入证书名称' />
                </Item>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type='primary' onClick={onClickUpload} >证书上传</Button>
                <Button type='primary' style={{ marginLeft: '10px' }} onClick={onSearch} >查询</Button>
                <Button style={{ marginLeft: '10px' }} onClick={resetForm}>重置</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey='id'
          columns={columns}
          loading={qryLoading}
          onChange={onPageChange}
          dataSource={certificateList}
          pagination={{ pageSize, total: certificateTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
      {uploadVisible && <CertificateUpload visible={uploadVisible} onCancel={onCloseUpload} />}
    </div>
  )
}

export default connect(({User, Certificate, loading }) => ({
  User,
  Certificate,
  qryLoading: loading.effects['Certificate/getCertificateList'],
}))(Certificate);
