import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard, SearchBar } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import { chainCodeStatusInfo } from '../../contract/myContract/_config';
import baseConfig from 'utils/config';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '查看合约',
  menuHref: `/`,
});

class ChaincodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      chainCodeName: '',
    };
    this.columns = [
      {
        title: '合约ID',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: '合约名称',
        dataIndex: 'chainCodeName',
        key: 'chainCodeName',
        render: (text) => text || '******',
      },
      {
        title: '创建组织',
        dataIndex: 'createOrgName',
        key: 'createOrgName',
        render: (text) => text || '******',
      },
      {
        title: '合约版本',
        dataIndex: 'chainCodeVersion',
        key: 'chainCodeVersion',
        render: (text) => text || '******',
      },
      {
        title: '状态',
        dataIndex: 'chainCodeStatus',
        key: 'chainCodeStatus',
        render: (text) =>
          text ? (
            <Badge
              color={chainCodeStatusInfo[text].color}
              text={chainCodeStatusInfo[text].text}
              style={{ color: chainCodeStatusInfo[text].color }}
            />
          ) : (
            '******'
          ),
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) =>
          text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '******',
      },
    ];
  }

  componentDidMount() {
    const { User, location, dispatch } = this.props;
    const { networkName } = User;
    const params = {
      networkName,
      channelId: location?.state?.channelId,
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params,
    });
    dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params,
    });
    dispatch({
      type: 'Channel/getContractTotalOfChannel',
      payload: params,
    });
    this.getContractListOfChannel();
  }

  // 获取 通道下的合约
  getContractListOfChannel = (current, chainCodeName) => {
    const { pageNum, pageSize } = this.state;
    const { User, location } = this.props;
    const { networkName } = User;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      networkName,
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      ascend: false,
      channelId: location?.state?.channelId,
    };
    if (chainCodeName) {
      params.orgName = chainCodeName;
    }
    this.props.dispatch({
      type: 'Channel/getContractListOfChannel',
      payload: params,
    });
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
    this.getContractListOfChannel(pageInfo.current);
  };

  // 按 合约名 搜索
  onSearch = (value, event) => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      this.setState({ pageNum: 1, chainCodeName: value || '' });
      this.getContractListOfChannel(1, value);
    }
  };

  render() {
    const { qryLoading = false, location } = this.props;
    const { pageSize, pageNum } = this.state;
    const {
      contractListOfChannel,
      contractTotalOfChannel,
      orgTotalOfChannel,
      nodeTotalOfChannel,
    } = this.props.Channel;
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
      {
        label: '合约总数',
        value: contractTotalOfChannel,
      },
    ];
    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <DetailCard
            cardTitle="基本信息"
            detailList={channelInfoList}
            boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
          />
          <div className="table-wrapper page-content-shadow">
            <SearchBar placeholder="输入合约名称" onSearch={this.onSearch} />
            <Table
              rowKey="_id"
              loading={qryLoading}
              columns={this.columns}
              dataSource={contractListOfChannel}
              onChange={this.onPageChange}
              pagination={{
                pageSize,
                total: contractTotalOfChannel,
                current: pageNum,
                position: ['bottomCenter'],
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ Channel, Layout, User, loading }) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getContractListOfChannel'],
}))(ChaincodeList);
