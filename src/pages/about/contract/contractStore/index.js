import React, { Component } from 'react';
import { connect } from "dva";
import { history } from 'umi';
import { Pagination, Spin, Row, Col } from 'antd';
import moment from 'moment';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import RepositoryCard from './components/RepositoryCard';
import DeployContract from './components/DeployContract';
import baseConfig from 'utils/config';
import style from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false)
breadCrumbItem.push({
  menuName: "合约仓库",
  menuHref: `/`,
})

class ContractRepository extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: baseConfig.pageSize,

      curRepository: null, // 当前仓库
      deployModalVisible: false, // 部署合约是否可见
    }

  }

  componentDidMount() {
    this.getRepositoryListOfChainCode()
  }

  // 获取 合约仓库列表
  getRepositoryListOfChainCode = current => {
    const { pageNum, pageSize } = this.state;
    const offset = ((current || pageNum) - 1) * pageSize;
    const params = {
      offset,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
    }
    this.props.dispatch({
      type: 'Contract/getRepositoryListOfChainCode',
      payload: params
    })
  }

  // 翻页
  onPageChange = page => {
    this.setState({ pageNum: page })
    this.getRepositoryListOfChainCode(page)
  }

  // 关闭 部署合约 弹窗
  onCloseDeployModal = () => {
    this.setState({ curRepository: null, deployModalVisible: false })
  }

  // 点击部署合约
  onClickDeploy = record => {
    this.setState({ curRepository: record, deployModalVisible: true })
  }

  // 点击查看合约仓库详情
  viewDetail = record => {
    this.props.dispatch({
      type: 'Contract/common',
      payload: { curRepository: record }
    })
    history.push({
      pathname: `/about/contract/contractStore/contractStoreDetail`,
      query: {
        chainCodeName: record.chainCodeName,
      },
    })
  }

  render() {
    const { qryLoading = false } = this.props;
    const { pageSize, pageNum, deployModalVisible, curRepository } = this.state;
    const { repositoryList, repositoryTotal } = this.props.Contract;

    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content page-content-shadow'>
          <Spin spinning={qryLoading}>
            <div className={style['repository-list']}>
              <Row gutter={[16, 24]}>
                {repositoryList.map(item =>
                  <Col key={item._id} span={8}>
                    <RepositoryCard record={item} deployContract={() => this.onClickDeploy(item)} viewDetail={() => this.viewDetail(item)} />
                  </Col>
                )}
              </Row>
              <Pagination
                pageNum={pageNum}
                pageSize={pageSize}
                total={repositoryTotal}
                onChange={this.onPageChange}
                showTotal={total => `共 ${total} 条`}
                style={{ textAlign: 'center' }}
              />
            </div>
          </Spin>
        </div>
        {deployModalVisible && <DeployContract visible={deployModalVisible} record={curRepository} onCancel={this.onCloseDeployModal} />}
      </div >
    )
  }
}

export default connect(({ Contract, loading }) => ({
  Contract,
  qryLoading: loading.effects['Contract/getRepositoryListOfChainCode']
}))(ContractRepository);
