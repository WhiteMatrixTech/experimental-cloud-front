import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { DidSchema, Dispatch, history } from 'umi';
import { Breadcrumb } from '~/components';
import { Table, Button, Space, Form, Row, Col, Input, Modal } from 'antd';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import baseConfig from '~/utils/config';
import { ConnectState } from '~/models/connect';
import { TableColumnsAttr } from '~/utils/types';

const { Item } = Form;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/did', false);
breadCrumbItem.push({
  menuName: 'DID管理',
  menuHref: `/`,
});
export interface DidManagementProps {
  dispatch: Dispatch;
  qryLoading: boolean;
  User: ConnectState['User'];
  DID: ConnectState['DID'];
}
function DidManagement(props: DidManagementProps) {
  const { dispatch, qryLoading = false } = props;
  const { networkName, userRole } = props.User;
  const { didList, didTotal } = props.DID;

  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [searchParams, setSearchParams] = useState({ did: '' });

  const getDidList = () => {
    const { did } = searchParams;
    const params = {
      networkName,
      paginator: 'did',
    };
    if (did) {
      dispatch({
        type: 'DID/getDetailByDid',
        payload: { did, networkName },
      });
      return;
    }
    dispatch({
      type: 'DID/getDidList',
      payload: params,
    });
  };

  const onClickDetail = (record: DidSchema) => {
    history.push({
      pathname: `/about/did/did-management/did-detail`,
      state: record,
    });
  };

  // 搜索
  const onSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const params = {
          did: values.did,
        };
        setPageNum(1);
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

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const columns: TableColumnsAttr[] = useMemo(() => {
    return [
      {
        title: 'DID',
        dataIndex: 'did',
        key: 'did',
        width: '20%',
        ellipsis: true,
      },
      {
        title: 'DID名称',
        dataIndex: 'idName',
        key: 'idName',
        ellipsis: true,
      },
      {
        title: 'DID类型',
        dataIndex: 'idType',
        key: 'idType',
      },
      {
        title: 'DID角色',
        dataIndex: 'role',
        key: 'role',
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: DidSchema) => (
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
  }, [searchParams]);

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
          <Table
            rowKey={(record: DidSchema) => `${record.did}-${record.idName}`}
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
    </div>
  );
}

export default connect(({ User, Layout, DID, loading }: ConnectState) => ({
  User,
  Layout,
  DID,
  qryLoading: loading.effects['DID/getDidList'],
}))(DidManagement);
