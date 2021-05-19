import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, history } from 'umi';
import { Pagination, Spin, Row, Col } from 'antd';
import moment from 'moment';
import { Breadcrumb } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import RepositoryCard from './components/RepositoryCard';
import DeployContract from './components/DeployContract';
import style from './index.less';
import { ConnectState } from '@/models/connect';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem.push({
  menuName: '合约仓库',
  menuHref: `/`,
});

export interface ContractRepositoryProps {
  ContractStore: ConnectState['ContractStore'];
  qryLoading: boolean;
  User: ConnectState['User'];
  loading: boolean;
  dispatch: Dispatch;
}
function ContractRepository(props: ContractRepositoryProps) {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [curRepository, setCurRepository] = useState(null); //当前仓库
  const [deployModalVisible, setDeployModalVisible] = useState(false); //当前合约是否可见
  const { repositoryList, repositoryTotal } = props.ContractStore;
  const { qryLoading = false } = props;

  useEffect(() => {
    getRepositoryListOfChainCode();
  }, [pageNum]);

  // 获取 合约仓库列表
  const getRepositoryListOfChainCode = () => {
    const offset = (pageNum - 1) * pageSize;
    const params = {
      offset,
      ascend: false,
      limit: pageSize,
      from: Number(moment(new Date()).format('x')),
      networkName: props.User.networkName,
    };
    props.dispatch({
      type: 'ContractStore/getRepositoryListOfChainCode',
      payload: params,
    });
  };

  // 翻页
  const onPageChange = (page: number) => {
    setPageNum(page);
  };

  // 关闭 部署合约 弹窗
  const onCloseDeployModal = () => {
    setCurRepository(null);
    setDeployModalVisible(false);
  };

  // 点击部署合约
  const onClickDeploy = (record: any) => {
    setCurRepository(record);
    setDeployModalVisible(true);
  };

  // 点击查看合约仓库详情
  const viewDetail = (record: any) => {
    props.dispatch({
      type: 'ContractStore/common',
      payload: { curRepository: record },
    });
    history.push({
      pathname: `/about/contract/contractStore/contractStoreDetail`,
      query: {
        chainCodeName: record.chainCodeName,
      },
    });
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <Spin spinning={qryLoading}>
          <div className={style['repository-list']}>
            <Row gutter={[16, 24]}>
              {repositoryList.map((item) => (
                //TODO:model中repositoryList数组中是对象-->repositoryList: Array<object>, // 合约仓库列表
                //TODO:这个数组里没有数据，打印出来是空数组，我也没有办法去model中给它添加属性
                <Col key={item._id} span={8}>
                  <RepositoryCard
                    record={item}
                    deployContract={() => onClickDeploy(item)}
                    //TODO:点击查看合约，item是一个object，传给了合约管理详情页
                    viewDetail={() => viewDetail(item)}
                  />
                </Col>
              ))}
            </Row>
            <Pagination
              //TODO:Pagination上面没有pageNum属性
              //pageNum={pageNum}
              pageSize={pageSize}
              total={repositoryTotal}
              onChange={onPageChange}
              showTotal={(total) => `共 ${total} 条`}
              style={{ textAlign: 'center' }}
            />
          </div>
        </Spin>
      </div>
      {deployModalVisible && (
        <DeployContract visible={deployModalVisible} record={curRepository} onCancel={onCloseDeployModal} />
      )}
    </div>
  );
}

export default connect(({ User, ContractStore, loading }: ConnectState) => ({
  User,
  ContractStore,
  qryLoading: loading.effects['ContractStore/getRepositoryListOfChainCode'],
}))(ContractRepository);
