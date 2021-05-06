import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { history } from 'umi';
import { Tabs, Input, Table, Button, Space } from 'antd';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { messageType } from './_config';
import baseConfig from 'utils/config';
import styles from './index.less';

const { TabPane } = Tabs;
const { Search } = Input;
const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/message');
const data = [];
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

class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchMesTitle: '',
      selectedRowKeys: [], // 表格中选中的行
      isShowViewAll: false, // 是否展示 查看全部消息按钮
      columns: [
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
          render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '状态',
          dataIndex: 'messageStatus',
          key: 'messageStatus',
          render: (text) => <span style={{ color: text === 0 ? '#000' : 'grey' }}>{text === 0 ? '未读' : '已读'}</span>,
        },
        {
          title: '消息类型',
          dataIndex: 'messageType',
          key: 'messageType',
          render: (text) => {
            const record = messageType.find((item) => item.id === text);
            return record ? record.name : '';
          },
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Space size="small">
              <a onClick={() => this.viewMesDetail(record)}>详情</a>
            </Space>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'Message/getAllUnreadMessage',
      payload: {},
    });
    this.props.dispatch({
      type: 'Message/getUnreadMesGroup',
      payload: {},
    });
    this.getMesList();
  }

  // 获取消息列表
  getMesList = (messageType, messageTitle, isShowViewAll) => {
    const { selectedMessageTab } = this.props.Message;
    const params = {
      messageType: messageType || selectedMessageTab,
      messageTitle: messageTitle || this.state.searchMesTitle,
      isShowViewAll: isShowViewAll || this.state.isShowViewAll,
    };
    this.props.dispatch({
      type: 'Message/getMessageList',
      payload: params,
    });
  };

  // 点击查看全部消息
  viewAllMess = () => {
    this.setState({ isShowViewAll: false });
    this.getMesList('', '', true);
  };

  // 点击查看未读消息
  viewUnreadMess = () => {
    this.setState({ isShowViewAll: true });
    this.getMesList('', '', false);
  };

  // 点击查看消息详情
  viewMesDetail = (record) => {
    history.push({
      pathname: `/about/message/${record.id}`,
      query: {
        messageId: record.id,
      },
    });
  };

  // 改变当前展示的消息类型
  onChangeMessageType = (activeKey) => {
    this.props.dispatch({
      type: 'Message/common',
      payload: { selectedMessageTab: activeKey },
    });
    this.getMesList(activeKey, '');
  };

  // 回车、点击搜索图标 进行搜索
  onSearch = (value) => {
    this.setState({ searchMesTitle: value });
    this.getMesList('', value);
  };

  // 搜索栏值改变
  onSearchChange = (e) => {
    this.setState({ searchMesTitle: e.target.value });
  };

  // 选中消息
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // 批量已读
  batchReadMes = () => {
    this.props
      .dispatch({
        type: 'Message/batchReadMes',
        payload: { messageIds: this.state.selectedRowKeys },
      })
      .then((res) => {
        if (res) {
          this.getMesList();
        }
      });
  };

  // 批量删除
  batchDeleteMes = () => {
    this.props
      .dispatch({
        type: 'Message/batchDeleteMes',
        payload: { messageIds: this.state.selectedRowKeys },
      })
      .then((res) => {
        if (res) {
          this.getMesList();
        }
      });
  };

  render() {
    const { selectedMessageTab } = this.props.Message;
    const { columns, loading, searchMesTitle, selectedRowKeys, isShowViewAll } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
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
              onSearch={this.onSearch}
              onChange={this.onSearchChange}
            />
          </div>
          <Tabs type="card" activeKey={selectedMessageTab} onChange={this.onChangeMessageType}>
            {messageType.map((item) => (
              <TabPane key={item.key} tab={item.name}></TabPane>
            ))}
          </Tabs>
          <div className={styles['table-btn-wrapper']}>
            <span>
              <Button type="primary" disabled={!hasSelected} loading={loading} onClick={this.batchReadMes}>
                标为已读
              </Button>
              <Button
                loading={loading}
                disabled={!hasSelected}
                onClick={this.batchDeleteMes}
                className={hasSelected ? 'default-blue-btn' : ''}
              >
                批量删除
              </Button>
            </span>
            {isShowViewAll ? (
              <Button className="default-blue-btn" onClick={this.viewAllMess}>
                查看全部消息
              </Button>
            ) : (
              <Button className="default-blue-btn" onClick={this.viewUnreadMess}>
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
}

export default connect(({ Message }) => ({ Message }))(Message);
