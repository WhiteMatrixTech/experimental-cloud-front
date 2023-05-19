import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Space, Table } from 'antd';
import { connect, Dispatch, ImageDetail } from 'umi';
import { PageTitle } from '~/components';
import { ConnectState } from '~/models/connect';
import baseConfig from '../../../../utils/config';
import { ColumnsType } from 'antd/lib/table';
import AddCustomImageModal from './components/AddCustomImageModal';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const OperationalRole = [Roles.ADMIN, Roles.SUPER];
const pageSize = baseConfig.pageSize;

export interface CustomImageProps {
  qryLoading: boolean;
  dispatch: Dispatch;
  CustomImage: ConnectState['CustomImage'];
  imageList: ImageDetail[];
  User: ConnectState['User'];
}

function CustomImage(props: CustomImageProps) {
  const { dispatch, qryLoading = false } = props;
  const { imageList, imageListTotal } = props.CustomImage;
  const { userInfo } = props.User;
  const [pageNum, setPageNum] = useState(1);
  const [addCustomImageVisible, setAddCustomImageVisible] = useState(false);

  const getImageList = useCallback(() => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize
    };
    dispatch({
      type: 'CustomImage/getImageList',
      payload: params
    });
    dispatch({
      type: 'CustomImage/getImageListTotal',
      payload: {}
    });
  }, [dispatch, pageNum]);

  useEffect(() => {
    getImageList();
  }, [getImageList, pageNum]);

  const onClickAddMirrorImage = () => {
    setAddCustomImageVisible(true);
  };

  const onCloseModal = () => {
    getImageList();
    setAddCustomImageVisible(false);
  };

  const columns: ColumnsType<any> = [
    { title: '镜像ID', dataIndex: 'id', key: 'id', ellipsis: true },
    { title: '镜像名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '镜像类型', dataIndex: 'type', key: 'type', ellipsis: true },
    { title: '镜像版本', dataIndex: 'version', key: 'version', ellipsis: true },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: string, record: ImageDetail) => (
        <Space size="small">
          {OperationalRole.includes(userInfo.role) && (
            <span role="button" className="table-action-span" onClick={() => onClickDelete(record)}>
              删除
            </span>
          )}
        </Space>
      )
    }
  ];

  const onClickDelete = (record: ImageDetail) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除此镜像吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await dispatch({
          type: 'CustomImage/deleteCustomImage',
          payload: {
            imageId: record.id
          }
        });
        if (res) {
          getImageList();
        }
      }
    });
  };

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  return (
    <div className="page-wrapper">
      <PageTitle
        label="自定义镜像管理"
        extra={
          OperationalRole.includes(userInfo.role) ? (
            <Button type="primary" onClick={onClickAddMirrorImage}>
              添加镜像
            </Button>
          ) : null
        }
      />
      <div className="page-content page-content-shadow table-wrapper">
        <Table
          rowKey="id"
          loading={qryLoading}
          columns={columns}
          dataSource={imageList}
          onChange={onPageChange}
          pagination={{
            total: imageListTotal,
            current: pageNum,
            showSizeChanger: false,
            position: ['bottomCenter'],
            pageSize: pageSize
          }}
        />
      </div>
      {addCustomImageVisible && <AddCustomImageModal visible={addCustomImageVisible} onCancel={onCloseModal} />}
    </div>
  );
}
export default connect(({ User, Layout, loading, CustomImage }: ConnectState) => ({
  User,
  Layout,
  CustomImage,
  qryLoading: loading.effects['CustomImage/getImageList'] || loading.effects['CustomImage/getImageListTotal']
}))(CustomImage);
