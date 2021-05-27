import React, { useState, useEffect } from 'react';
import { Button, Space, Table } from 'antd';
import { connect, Dispatch, ImageDetail } from 'umi';
import { Breadcrumb } from '~/components';
import { ConnectState } from '~/models/connect';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import baseConfig from '../../../../utils/config';
import { ColumnsType } from 'antd/lib/table';
import AddCustomImageModal from './components/AddCustomImageModal';
import moment from 'moment';
import { Roles } from '~/utils/roles';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem.push({
  menuName: '自定义镜像管理',
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

  const getImageList = () => {
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
  };

  useEffect(() => {
    getImageList();
  }, [pageNum]);

  const onClickAddMirrorImage = () => {
    setAddCustomImageVisible(true);
  };

  const onCloseModal = () => {
    getImageList();
    setAddCustomImageVisible(false);
  };

  const columns: ColumnsType<any> = [
    { title: '镜像地址', dataIndex: 'imageUrl', key: 'imageUrl', ellipsis: true },
    { title: '镜像类型', dataIndex: 'imageType', key: 'imageType', ellipsis: true },
    { title: '镜像ID', dataIndex: '_id', key: '_id', ellipsis: true },
    {
      title: '注册服务器',
      dataIndex: 'registerServer',
      key: 'registerServer',
      ellipsis: true,
      render: (_: string, record: ImageDetail) => record.credential?.registryServer || ''
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: string, record: ImageDetail) => (
        <Space size="small">
          {OperationalRole.includes(userInfo.role) && <a onClick={() => onClickDelete(record)}>删除</a>}
        </Space>
      )
    }
  ];

  const onClickDelete = (record: ImageDetail) => {
    dispatch({
      type: 'CustomImage/deleteCustomImage',
      payload: {
        imageId: record._id
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
              添加镜像
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
