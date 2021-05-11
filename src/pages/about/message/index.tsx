import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Dispatch, history } from 'umi';
import { Tabs, Input, Table, Button, Space } from 'antd';
import { Breadcrumb } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import { messageType } from './_config';
import baseConfig from '@/utils/config';
import styles from './index.less';
import { ConnectState } from '@/models/connect';

const { TabPane } = Tabs;
const { Search } = Input;
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/message');
//TODO:data现在是假数据，最终会来源于module
export interface DataSource {
  id: number;
  messageTitle: string;
  messageSendName: string;
  createTime: string;
  messageStatus: number;
  messageType: number;
}

let data: DataSource[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    id: i,
    messageTitle: `Edward King ${i}`,
    messageSendName: `南京第${i}人民医院`,
    createTime: '1604647467072',
    messageStatus: i % 2 === 0 ? 0 : 1,
    messageType: (i % 6) + 1,
  });
}

export interface Fun {
  (selectedRowKeys: any): void
}

export interface RowSelection {
  selectedRowKeys: number[];
  onChange: Fun;
}
export interface MessageProps {
  Message: { selectedMessageTab: string; };
  selectedMessageTab: string;
  dispatch: Dispatch;
}

function Message(props: MessageProps) {
  const [loading, setLoading] = useState(false);
  const [searchMesTitle, setSearchMesTitle] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);// 表格中选中的行
  const [isShowViewAll, setIsShowViewAll] = useState(false);// 是否展示 查看全部消息按钮
  const { selectedMessageTab } = props.Message;

  const columns = [
    {
      title: '消息标题',
      dataIndex: 'messageTitle',
      key: 'messageTitle',
      ellipsis: true,
    },
    {
      title: '发送方',
      dataIndex: 'messageSendName',
      key: 'messageSendName',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: moment.MomentInput) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'messageStatus',
      key: 'messageStatus',
      render: (text: number) => <span style={{
        color: text === 0 ? '#000' : 'grey'
      }}> {text === 0 ? '未读' : '已读'}</span >,
    },
    {
      title: '消息类型',
      dataIndex: 'messageType',
      key: 'messageType',
      render: (text: number) => {
        const record = messageType.find((item) => item.id === text);
        return record ? record.name : '';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space size="small">
          <a onClick={() => viewMesDetail(record)}>详情</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    props.dispatch({
      type: 'Message/getAllUnreadMessage',
      payload: {},
    });
    props.dispatch({
      type: 'Message/getUnreadMesGroup',
      payload: {},
    });
    //TODO:没有给它传参嗷~
    getMesList();
  }, [])

  // 获取消息列表
  const getMesList = (messageType: string | object, messageTitle: string, isShowViewAll: boolean): void => {
    const { selectedMessageTab } = props.Message;
    const params = {
      messageType: messageType || selectedMessageTab,
      messageTitle: messageTitle || searchMesTitle,
      isShowViewAll: isShowViewAll || isShowViewAll,
    };
    props.dispatch({
      type: 'Message/getMessageList',
      payload: params,
    });
  };

  // 点击查看全部消息
  const viewAllMess = (): void => {
    setIsShowViewAll(false)
    getMesList('', '', true);
  };

  // 点击查看未读消息
  const viewUnreadMess = (): void => {
    setIsShowViewAll(false)
    getMesList('', '', isShowViewAll);
  };

  // 点击查看消息详情
  const viewMesDetail = (record: any) => {
    history.push({
      pathname: `/about/message/${record.id}`,
      query: {
        messageId: record.id,
      },
    });
  };

  // 改变当前展示的消息类型
  const onChangeMessageType = (activeKey: string): void => {
    props.dispatch({
      type: 'Message/common',
      payload: { selectedMessageTab: activeKey },
    });
    getMesList(activeKey, '', isShowViewAll);
  };

  // 回车、点击搜索图标 进行搜索
  const onSearch = (value: string): void => {
    setSearchMesTitle(value)
    getMesList('', value, isShowViewAll);
  };

  // 搜索栏值改变
  const onSearchChange = (e: any): void => {
    setSearchMesTitle(e.target.value)
  };

  // 选中消息
  const onSelectChange = (selectedRowKeys: any): void => {
    setSelectedRowKeys(selectedRowKeys)
  };

  // 批量已读
  const batchReadMes = () => {
    props.dispatch({
      type: 'Message/batchReadMes',
      payload: { messageIds: selectedRowKeys },
    })
      .then((res: any) => {
        if (res) {
          //TODO:没有传参嗷~
          getMesList();
        }
      });
  };

  // 批量删除
  const batchDeleteMes = (): void => {
    props.dispatch({
      type: 'Message/batchDeleteMes',
      payload: { messageIds: selectedRowKeys },
    })
      .then((res: any) => {
        if (res) {
          getMesList();
        }
      });
  };

  //表格行是否可选
  const rowSelection: RowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content" style={{ position: 'relative' }}>
        <div className={styles['message-search-wrapper']}>
          <Search
            allowClear
            placeholder="输入消息标题"
            value={searchMesTitle}
            style={{ width: 300 }}
            onSearch={onSearch}
            onChange={onSearchChange}
          />
        </div>
        <Tabs type="card" activeKey={selectedMessageTab} onChange={onChangeMessageType}>
          {messageType.map((item) => (
            <TabPane key={item.key} tab={item.name}></TabPane>
          ))}
        </Tabs>
        <div className={styles['table-btn-wrapper']}>
          <span>
            <Button type="primary" disabled={!hasSelected} loading={loading} onClick={batchReadMes}>
              标为已读
              </Button>
            <Button
              loading={loading}
              disabled={!hasSelected}
              onClick={batchDeleteMes}
              className={hasSelected ? 'default-blue-btn' : ''}
            >
              批量删除
              </Button>
          </span>
          {isShowViewAll ? (
            <Button className="default-blue-btn" onClick={viewAllMess}>
              查看全部消息
            </Button>
          ) : (
            <Button className="default-blue-btn" onClick={viewUnreadMess}>
              查看未读消息
            </Button>
          )}
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          pagination={{ pageSize: baseConfig.pageSize, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  );
}

export default connect(({ Message }: ConnectState) => ({ Message }))(Message);
