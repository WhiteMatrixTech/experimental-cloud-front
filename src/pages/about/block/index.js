import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Table, Space } from 'antd';
import moment from 'moment';
import { Breadcrumb, SearchBar } from 'components';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/block');

function Block(props) {
  const { Block, qryLoading, dispatch, User } = props;
  const { networkName, userRole } = User;
  const { blockList, blockTotal } = Block;
  const [columns, setColumns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [blockHash, setBlockHash] = useState('');
  const [pageSize] = useState(baseConfig.pageSize);

  //查询列表的totalDocs
  const getBlockTotalDocs = () => {
    const params = {
      networkName,
    };
    dispatch({
      type: 'Block/getBlockTotalDocs',
      payload: params,
    });
  };
  //查询列表current
  const getBlockList = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      networkName,
      limit: pageSize,
      offset: offset,
      ascend: false,
    };
    dispatch({
      type: 'Block/getBlockList',
      payload: params,
    });
  };

  // 搜索
  const onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPageNum(1);
      setBlockHash(value || '');
    }
  };

  //搜索列表
  const onSearchList = () => {
    const params = {
      networkName,
      blockHash,
    };
    dispatch({
      type: 'Block/onSearch',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  // 点击查看详情
  const onClickDetail = (record) => {
    history.push({
      pathname: `/about/block/${record.blockHash}`,
      query: {
        blockHash: record.blockHash,
      },
    });
  };

  // 用户身份改变时，表格展示改变
  useEffect(() => {
    const data = [
      {
        title: '区块HASH',
        dataIndex: 'blockHash',
        key: 'blockHash',
        ellipsis: true,
        width: userRole === Roles.NetworkMember ? '17%' : '20%',
      },
      {
        title: '所属通道',
        dataIndex: 'channelId',
        key: 'channelId',
      },
      {
        title: '交易数量',
        dataIndex: 'txCount',
        key: 'txCount',
      },
      {
        title: '生成时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => onClickDetail(record)}>详情</a>
          </Space>
        ),
      },
    ];
    if (userRole === Roles.NetworkMember) {
      const insertColumn = {
        title: '所属联盟',
        dataIndex: 'leagueName',
        key: 'leagueName',
      };
      data.splice(1, 0, insertColumn);
    }
    setColumns(data);
  }, [User.userRole]);

  // 页码改变时,或blockHash=''时重新查询列表
  // 搜索值改变时
  useEffect(() => {
    if (blockHash) {
      onSearchList();
    } else {
      getBlockList();
      getBlockTotalDocs();
    }
  }, [blockHash, pageNum]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <SearchBar placeholder="区块HASH" onSearch={onSearch} />
        <Table
          rowKey="blockHash"
          columns={columns}
          loading={qryLoading}
          dataSource={blockList}
          onChange={onPageChange}
          pagination={{ pageSize, total: blockTotal, current: pageNum, position: ['bottomCenter'] }}
        />
      </div>
    </div>
  );
}

export default connect(({ User, Block, loading }) => ({
  User,
  Block,
  qryLoading: loading.effects['Block/getBlockList'],
}))(Block);
