import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Space, Button } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu';
import FieldDesc from '../components/FieldDesc';
import DeployContract from '../components/DeployContract';
import baseConfig from 'utils/config';

let breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem = breadCrumbItem.concat([
  {
    menuName: '合约仓库',
    menuHref: `/about/contract/contractStore`,
    isLeftMenu: true,
  },
  {
    menuName: '合约仓库详情',
    menuHref: `/`,
  },
]);

class ContractStoreDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,
      record: null, // 当前查看的表格记录
      fieldDescVisible: false, // 字段说明弹窗 是否可见
      deployContractVisible: false, // 部署合约弹窗 是否可见
    };
    this.columns = [
      {
        title: '方法名',
        dataIndex: 'chainCodeMethodName',
        key: 'chainCodeMethodName',
      },
      {
        title: '调用类型',
        dataIndex: 'chainCodeMethodType',
        key: 'chainCodeMethodType',
        render: (text) => (text === 1 ? 'invoke' : 'query'),
      },
      {
        title: '参数',
        dataIndex: 'chainCodeMethodArgs',
        key: 'chainCodeMethodArgs',
        ellipsis: true,
      },
      {
        title: '描述',
        dataIndex: 'chainCodeMethodDesc',
        key: 'chainCodeMethodDesc',
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <a onClick={() => this.onClickDetail(record)}>查看字段说明</a>
          </Space>
        ),
      },
    ];
  }

  componentDidMount() {
    this.getStoreSupplyListOfChainCode();
  }

  // 获取合约列表
  getStoreSupplyListOfChainCode = (current) => {
    const { pageNum, pageSize } = this.state;
    const {
      User,
      dispatch,
      location: {
        query: { chainCodeName = '' },
      },
    } = this.props;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      chainCodeName,
      networkName: User.networkName,
    };
    dispatch({
      type: 'ContractStore/getStoreSupplyListOfChainCode',
      payload: params,
    });
  };

  // 翻页
  onPageChange = (pageInfo) => {
    this.setState({ pageNum: pageInfo.current });
    this.getStoreSupplyListOfChainCode(pageInfo.current);
  };

  // 查看字段说明
  onClickDetail = (record) => {
    this.setState({
      record,
      fieldDescVisible: true,
    });
  };

  // 关闭字段说明弹窗
  onCloseFieldDescModal = () => {
    this.setState({
      record: null,
      fieldDescVisible: false,
    });
  };

  // 点击部署合约
  onClickDeploy = () => {
    this.setState({ deployContractVisible: true });
  };

  // 关闭 部署合约 弹窗
  onCloseDeployModal = () => {
    this.setState({ deployContractVisible: false });
  };

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum, record, fieldDescVisible, deployContractVisible } = this.state;
    const { curRepository, repositoryDetailList, repositoryDetailTotal } = this.props.ContractStore;
    const contractInfoList = [
      {
        label: '合约名称',
        value: curRepository.chainCodeName,
      },
      {
        label: '合约版本',
        value: curRepository.chainCodeVersion,
      },
      {
        label: '编写语言',
        value: curRepository.compileLanguage,
      },
      {
        label: '创建时间',
        value: curRepository.createdAt ? moment(curRepository.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
      },
      {
        label: '最近更新时间',
        value: curRepository.updatedAt ? moment(curRepository.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
      },
      {
        label: '合约描述',
        fullRow: true,
        value: curRepository.chainCodeDesc,
      },
    ];
    return (
      <div className="page-wrapper">
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className="page-content">
          <DetailCard
            cardTitle="合约信息"
            detailList={contractInfoList}
            columnsNum={3}
            boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
          />
          <div className="table-header-btn-wrapper">
            <Button type="primary" onClick={this.onClickDeploy}>
              部署合约
            </Button>
          </div>
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={this.columns}
            className="page-content-shadow"
            dataSource={repositoryDetailList}
            onChange={this.onPageChange}
            pagination={{ pageSize, total: repositoryDetailTotal, current: pageNum, position: ['bottomCenter'] }}
          />
        </div>
        {fieldDescVisible && (
          <FieldDesc visible={fieldDescVisible} record={record} onCancel={this.onCloseFieldDescModal} />
        )}
        {deployContractVisible && (
          <DeployContract visible={DeployContract} record={curRepository} onCancel={this.onCloseDeployModal} />
        )}
      </div>
    );
  }
}

export default connect(({ User, ContractStore, loading }) => ({
  User,
  ContractStore,
  qryLoading: loading.effects['ContractStore/getStoreSupplyListOfChainCode'],
}))(ContractStoreDetail);
