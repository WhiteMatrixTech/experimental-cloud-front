import React, { useEffect, useMemo, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Spin } from 'antd';
import { Breadcrumb } from '~/components';
import styles from './index.less';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/transactions');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_RBAC_TRANSACTION_INFORMATION'),
  menuHref: `/`
});

export type TransactionDetailProps = {
  User: ConnectState['User'];
  dispatch: Dispatch;
  transactionHash: string;
  qryLoading: boolean;
  Transactions: ConnectState['Transactions'];
  match: { params: { transactionHash: string } };
};
const TransactionDetail: React.FC<TransactionDetailProps> = ({
  match: {
    params: { transactionHash }
  },
  User,
  dispatch,
  qryLoading = false,
  Transactions
}) => {
  const { networkName } = User;
  const { transactionDetail } = Transactions;

  const detailList = useMemo(() => {
    if (transactionDetail) {
      return [
        {
          label: Intl.formatMessage('BASS_TRANSACTION_HASH'),
          value: transactionDetail.txId
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_BLOCK'),
          value: transactionDetail.blockHash
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_CONSORTIUM'),
          value: transactionDetail.leagueName
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_CHANNEL'),
          value: transactionDetail.channelId
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_ORGANIZATION'),
          value: transactionDetail.txMsp
        },
        {
          label: Intl.formatMessage('BASS_CONTRACT_ENDORSEMENT'),
          value: JSON.stringify(transactionDetail.txEndorseMsp)
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_TIME'),
          value: moment(transactionDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_CONTRACT_USED'),
          value: transactionDetail.chainCodeName
        },
        {
          label: Intl.formatMessage('BASS_TRANSACTION_PARAMETERS'),
          value: JSON.stringify(transactionDetail.txArgs)
        }
      ];
    }
    return [];
  }, [transactionDetail]);

  useEffect(() => {
    dispatch({
      type: 'Transactions/getTransactionDetail',
      payload: { txId: transactionHash, networkName }
    });
  }, [dispatch, networkName, transactionHash]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <Spin spinning={qryLoading}>
          <div className={styles['transaction-detail-wrapper']}>
            <div className={styles['transaction-detail-title']}>
              <div>{Intl.formatMessage('BASS_RBAC_TRANSACTION_INFORMATION')}</div>
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
};

export default connect(({ User, Transactions, loading }: ConnectState) => ({
  User,
  Transactions,
  qryLoading: loading.effects['Transactions/getTransactionDetail']
}))(TransactionDetail);
