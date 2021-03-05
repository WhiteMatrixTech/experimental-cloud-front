import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import AddOrg from '../components/AddOrg';
import baseConfig from 'utils/config';
import { Roles } from 'utils/roles.js';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看组织',
  menuHref: `/`,
});

class OrganizationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      orgName: '',

      addOrgVisible: false, // 添加组织是否可见
      peerObj: {}, // 当前操作的通道
    };
    this.columns = [
      {
        title: '组织名称',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '组织别名',
        dataIndex: 'orgAliasName',
        key: 'orgAliasName',
      },
      {
        title: '组织MSPID',
        dataIndex: 'orgMspId',
        key: 'orgMspId',
      },
      {
        title: '所属企业',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '组织地址',
        dataIndex: 'orgAddress',
        key: 'orgAddress',
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
      type: 'Channel/getNodeListOfChannel',
      payload: params,
    });
    this.getOrgListOfChannel();
  }

  // 获取 通道下的组织
  getOrgListOfChannel = (orgName) => {
    const { User, location } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    if (orgName) {
      params.orgName = orgName;
    }
    this.props.dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params,
    });
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
    this.getOrgListOfChannel(pageInfo.current);
  };

  // 按 组织名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, orgName: value || '' });
      this.getOrgListOfChannel(value);
    }
  };

  // 关闭 添加组织 弹窗
  onCloseModal = () => {
    this.setState({ addOrgVisible: false });
  };

  // 点击 添加组织
  onClickAddOrg = () => {
    const {
      location: {
        query: { cId },
      },
    } = this.props;
    this.setState({ addOrgVisible: true, peerObj: { _id: cId } });
  };

  render() {
    const { qryLoading = false, location } = this.props;
    const { pageSize, pageNum, addOrgVisible } = this.state;
    const { userRole } = this.props.User;
    const { orgListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = this.props.Channel;
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
    }
    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <DetailCard cardTitle="基本信息" detailList={channelInfoList} boxShadow="0 4px 12px 0 rgba(0,0,0,.05)" />
          {/* <SearchBar placeholder='输入组织名' onSearch={this.onSearch} btnName={userRole === Roles.NetworkAdmin ? '添加组织' : null} onClickBtn={this.onClickAddOrg} /> */}
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={this.columns}
            className="page-content-shadow table-wrapper"
            dataSource={orgListOfChannel}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: orgTotalOfChannel, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
        {addOrgVisible && <AddOrg visible={addOrgVisible} onCancel={this.onCloseModal} />}
      </div>
    );
  }
}

export default connect(({ Channel, Layout, User, loading }) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getOrgListOfChannel'],
}))(OrganizationList);