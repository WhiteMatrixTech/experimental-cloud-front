import { Button, Space, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, Dispatch, ImageDetail } from 'umi';
import { Breadcrumb } from '~/components';
import { ConnectState } from '~/models/connect';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import baseConfig from '../../../../utils/config';
import { ColumnsType } from 'antd/lib/table';
import AddCustomImageModal from './components/AddCustonImageModal';
import moment from 'moment';
import { Roles } from '~/utils/roles';

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/block-compile', false);
breadCrumbItem.push({
  menuName: '自定义镜像',
  menuHref: `/`
});

const OperatinalRole = [Roles.Admin, Roles.SuperUser];

export interface CustomImageProps {
  qryLoading: boolean;
  dispatch: Dispatch;
  CustomImage: ConnectState['CustomImage'];
  imageList: ImageDetail[];
  User: ConnectState['User'];
}
const pageSize = baseConfig.pageSize;
function CustomImage(props: CustomImageProps) {
  const { dispatch, qryLoading = false } = props;
  const { imageList, imageListTotal } = props.CustomImage;
  const { userInfo } = props.User;
  const [pageNum, setPageNum] = useState(1);
  const [addCustomImageVisible, setAddCustomImageVisible] = useState(false);

  useEffect(() => {
    const offset = (pageNum - 1) * 5;
    const params = {
      offset,
      limit: pageSize
    };
    //获取镜像列表
    dispatch({
      type: 'CustomImage/getImageListForForm',
      payload: params
    });
  }, [pageNum, addCustomImageVisible]);

  useEffect(() => {
    //获取镜像列表总数
    dispatch({
      type: 'CustomImage/getImageListTotal',
      payload: {}
    });
  }, [addCustomImageVisible]);

  //添加镜像
  const onClickAddMirrorImage = () => {
    setAddCustomImageVisible(true);
  };
  const columns: ColumnsType<any> = [
    { title: '镜像地址', dataIndex: 'imageUrl', key: 'imageUrl', ellipsis: true },
    { title: '镜像类型', dataIndex: 'imageType', key: 'imageType' },
    { title: '镜像ID', dataIndex: '_id', key: '_id' },
    {
      title: '注册服务器',
      dataIndex: 'registerServer',
      key: 'registerServer',
      render: (_: string, record: ImageDetail) => record.credential?.registryServer || ''
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
          {OperatinalRole.includes(userInfo.role) && <a onClick={() => onClickDelete(record)}>删除</a>}
        </Space>
      )
    }
  ];
  //删除
  const onClickDelete = (record: ImageDetail) => {
    dispatch({
      type: 'CustomImage/deleteCustomImage',
      payload: {
        imageId: record._id
      }
    });
  };
  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };
  const onCloseModal = () => {
    setAddCustomImageVisible(false);
  };
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        {OperatinalRole.includes(userInfo.role) && (
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
