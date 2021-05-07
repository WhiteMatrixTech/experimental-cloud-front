import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Spin } from 'antd';
import { Breadcrumb } from 'components';
import styles from './index.less';
import { MenuList, getCurBreadcrumb } from 'utils/menu';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/transactions');
breadCrumbItem.push({
  menuName: '交易详情',
  menuHref: `/`,
});

function TransactionDetail({
  match: {
    params: { transactionHash },
  },
  User,
  dispatch,
  qryLoading = false,
  Transactions,
}) {
  const { networkName } = User;
  const { transactionDetail } = Transactions;

  const detailList = [
    {
      label: '交易哈希',
      value: transactionDetail.txId,
    },
    {
      label: '所属区块',
      value: transactionDetail.blockHash,
    },
    {
      label: '所属联盟',
      value: transactionDetail.leagueName,
    },
    {
      label: '交易通道',
      value: transactionDetail.channelId,
    },
    {
      label: '交易组织',
      value: transactionDetail.txMsp,
    },
    {
      label: '背书组织',
      value: JSON.stringify(transactionDetail.txEndorseMsp),
    },
    {
      label: '交易时间',
      value: moment(transactionDetail.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '所用合约',
      value: transactionDetail.chainCodeName,
    },
    {
      label: '交易参数',
      value: JSON.stringify(transactionDetail.txArgs),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'Transactions/getTransactionDetail',
      payload: { txId: transactionHash, networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <Spin spinning={qryLoading}>
          <div className={styles['transaction-detail-wrapper']}>
            <div className={styles['transaction-detail-title']}>
              <div>交易信息</div>
            </div>
            <div className={styles['transaction-detail-content']}>
              <div className={styles.transactionInfoWrap}>
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                  {detailList.map((item) => (
                    <Fragment key={item.label}>
                      <Col className={styles['gutter-row-label']} span={4}>
                        {item.label}
                      </Col>
                      <Col className={styles['gutter-row-content']} span={20}>
                        {item.value}
                      </Col>
                    </Fragment>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, Transactions, loading }) => ({
  User,
  Transactions,
  qryLoading: loading.effects['Transactions/getTransactionDetail'],
}))(TransactionDetail);
