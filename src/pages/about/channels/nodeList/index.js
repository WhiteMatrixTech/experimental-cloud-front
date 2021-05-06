import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu';
import { peerStatus } from '../../nodes/_config';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看节点',
  menuHref: `/`,
});

class NodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      peerName: '',
    };
    this.columns = [
      {
        title: '节点名称',
        dataIndex: 'nodeName',
        key: 'peerName',
      },
      {
        title: '节点别名',
        dataIndex: 'nodeAliasName',
        key: 'peerAliasName',
      },
      {
        title: '节点全名',
        dataIndex: 'nodeFullName',
        key: 'nodeFullName',
      },
      {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '状态',
        dataIndex: 'nodeStatus',
        key: 'nodeStatus',
        render: (text) =>
          text ? (
            <Badge
              color={peerStatus[text].color}
              text={peerStatus[text].text}
              style={{ color: peerStatus[text].color }}
            />
          ) : (
            ''
          ),
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];
  }

  componentDidMount() {
    const { User, location } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    this.props.dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params,
    });
    this.getNodeListOfChannel();
  }

  // 获取 通道下的节点
  getNodeListOfChannel = (peerName) => {
    const { User, location } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    if (peerName) {
      params.orgName = peerName;
    }
    this.props.dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params,
    });
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
  };

  // 按 组织名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, peerName: value || '' });
      this.getNodeListOfChannel(value);
    }
  };

  render() {
    const { qryLoading = false, location } = this.props;
    const { pageSize, pageNum } = this.state;
    const { userRole } = this.props.User;
    const { nodeListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = this.props.Channel;
    const channelInfoList = [
      {
        label: '通道名称',
        value: location?.state?.channelId,
      },
      {
        label: '组织数量',
        value: orgTotalOfChannel,
      },
      {
        label: '节点总数',
        value: nodeTotalOfChannel,
      },
    ];
    if (userRole === Roles.NetworkAdmin) {
      channelInfoList.slice(1, 0, {
        label: '所属联盟',
        value: location?.state?.leagueName,
      });
      channelInfoList.slice(3, 0, {
        label: '我的节点数',
        value: location?.state?.companyPeerCount,
      });
    }
    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <DetailCard cardTitle="基本信息" detailList={channelInfoList} boxShadow="0 4px 12px 0 rgba(0,0,0,.05)" />
          {/* <SearchBar placeholder='输入节点名称' onSearch={this.onSearch} /> */}
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={this.columns}
            className="page-content-shadow table-wrapper"
            dataSource={nodeListOfChannel}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: nodeTotalOfChannel, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ Channel, Layout, User, loading }) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getNodeListOfChannel'],
}))(NodeList);
