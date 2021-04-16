import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import moment from 'moment';
import { Breadcrumb } from 'components';
import { Table, Button, Space, Form, Row, Col, Select, Input, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CreateDIDModal from './components/CreateDIDModal';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import baseConfig from 'utils/config';
import styles from './index.less';

const { Item } = Form;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  menuName: 'DID管理',
  menuHref: `/`,
});

function DidManagement(props) {
  const { dispatch, qryLoading = false } = props;
  const { networkName, userRole } = props.User;
  const { didList, didTotal } = props.DID;

  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [record, setRecord] = useState(null);
  const [searchParams, setSearchParams] = useState({ did: '' });

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const getDidList = () => {
    const { did } = searchParams;
    const params = {
      networkName,
      paginator: pageNum.toString(),
      pageSize: baseConfig.pageSize.toString(),
    };
    if (did) {
      dispatch({
        type: 'DID/getDetailByDid',
        payload: { did },
      });
      return;
    }
    dispatch({
      type: 'DID/getDidList',
      payload: params,
    });
  };

  const onClickCreate = () => {
    setRecord(null);
    setCreateModalVisible(true);
  };

  const onClickModify = (record) => {
    setRecord(record);
    setCreateModalVisible(true);
  };

  const onClickDelete = (record) => {
    const callback = async () => {
      const res = await dispatch({
        type: 'DID/deleteDID',
        payload: { networkName, did: record.did },
      });
      if (res) {
        getDidList();
      }
    };
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除DID 【${record.didName}】 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: callback,
    });
  };

  const onClickDetail = (record) => {
    history.push({
      pathname: `/about/did/did-management/did-detail`,
      state: record,
    });
  };

  const onCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          did: values.did,
        };
        setSearchParams(params);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }, []);

  // 重置
  const resetForm = () => {
    form.resetFields();
    setPageNum(1);
    setSearchParams({ did: '' });
  };

  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const columns = useMemo(() => {
    return [
      {
        title: 'DID名称',
        dataIndex: 'didName',
        key: 'didName',
        width: '20%',
        ellipsis: true,
      },
      {
        title: 'DID类型',
        dataIndex: 'didType',
        key: 'didType',
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="small">
            {/* <a onClick={() => onClickModify(record)}>修改</a>
            <a onClick={() => onClickDelete(record)}>删除</a> */}
            <a onClick={() => onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ];
  }, [userRole]);

  // 页码改变、搜索值改变时，重新查询列表
  useEffect(() => {
    getDidList();
  }, [pageNum, searchParams]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <div className="table-top-search-wrapper">
          <Form {...formItemLayout} colon={false} form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Item label="DID" name="did" initialValue="">
                  <Input placeholder="输入DID" />
                </Item>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'right' }}>
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
          <div className={styles['table-header-btn-wrapper']}>
            <Button type="primary" onClick={onClickCreate}>
              新增DID
            </Button>
          </div>
          <Table
            rowKey={(record) => `${record.did}-${record.didName}`}
            loading={qryLoading}
            columns={columns}
            dataSource={didList}
            onChange={onPageChange}
            pagination={{
              pageSize: baseConfig.pageSize,
              total: didTotal,
              current: pageNum,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>
      </div>
      {createModalVisible && (
        <CreateDIDModal
          visible={createModalVisible}
          onCancel={onCloseCreateModal}
          getDidList={getDidList}
          record={record}
        />
      )}
    </div>
  );
}

export default connect(({ User, Layout, DID, loading }) => ({
  User,
  Layout,
  DID,
  qryLoading: loading.effects['DID/getDidList'],
}))(DidManagement);
