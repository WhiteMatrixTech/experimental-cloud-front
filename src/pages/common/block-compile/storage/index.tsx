import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, notification, Space, Table } from 'antd';
import { connect, Dispatch, ImageDetail } from 'umi';
import { Breadcrumb } from '~/components';
import { ConnectState } from '~/models/connect';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import baseConfig from '../../../../utils/config';
import { ColumnsType } from 'antd/lib/table';
import AddCustomImageModal from './components/AddCustomImageModal';
import moment from 'moment';
import { Roles } from '~/utils/roles';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_CUSTOM_IMAGE_MANAGEMENT'),
  menuHref: `/`
});

const OperationalRole = [Roles.Admin, Roles.SuperUser];
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
    { title: Intl.formatMessage('BASS_CUSTOM_IMAGE_ADDRESS'), dataIndex: 'imageUrl', key: 'imageUrl', ellipsis: true },
    { title: Intl.formatMessage('BASS_CUSTOM_IMAGE_TYPE'), dataIndex: 'imageType', key: 'imageType', ellipsis: true },
    { title: Intl.formatMessage('BASS_CUSTOM_IMAGE_ID'), dataIndex: '_id', key: '_id', ellipsis: true },
    {
      title: Intl.formatMessage('BASS_CUSTOM_IMAGE_REGISTER_SERVER'),
      dataIndex: 'registerServer',
      key: 'registerServer',
      ellipsis: true,
      render: (_: string, record: ImageDetail) => record.credential?.registryServer || ''
    },
    {
      title: Intl.formatMessage('BASS_COMMON_CREATE_TIME'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: Intl.formatMessage('BASS_CUSTOM_IMAGE_CREATION_TIME'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: Intl.formatMessage('BASS_COMMON_OPERATION'),
      dataIndex: 'operation',
      key: 'operation',
      render: (_: string, record: ImageDetail) => (
        <Space size="small">
          {OperationalRole.includes(userInfo.role) && (
            <span role="button" className="table-action-span" onClick={() => onClickDelete(record)}>
              {Intl.formatMessage('BASS_COMMON_DELETE')}
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
      content: Intl.formatMessage('BASS_CONFIRM_DELETE_IMAGE_MODAL_CONTENT'),
      okText: Intl.formatMessage('BASS_COMMON_CONFIRM'),
      cancelText: Intl.formatMessage('BASS_COMMON_CANCEL'),
      onOk: async () => {
        const res = await dispatch({
          type: 'CustomImage/deleteCustomImage',
          payload: {
            imageId: record._id
          }
        });
        const { statusCode, result } = res;
        if (statusCode === 'ok' && result.status) {
          getImageList();
          notification.success({
            message: Intl.formatMessage('BASS_NOTIFICATION_CUSTOM_IMAGE_DELETE_SUCCESS'),
            top: 64,
            duration: 3
          });
        } else {
          notification.error({
            message: result.message || Intl.formatMessage('BASS_NOTIFICATION_CUSTOM_IMAGE_DELETE_FAILED'),
            top: 64,
            duration: 3
          });
        }
      }
    });
  };

  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        {OperationalRole.includes(userInfo.role) && (
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={onClickAddMirrorImage}>
              {Intl.formatMessage('BASS_CUSTOM_IMAGE_ADD')}
            </Button>
          </div>
        )}
        <Table
          rowKey="_id"
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
  qryLoading: loading.effects['ElasticServer/getServerList']
}))(CustomImage);
