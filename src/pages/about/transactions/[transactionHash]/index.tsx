import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Spin, Descriptions } from 'antd';
import { Breadcrumb, PageTitle } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { renderDateWithDefault } from '~/utils/date';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/transactions');
breadCrumbItem.push({
  menuName: '交易详情',
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
          label: '交易哈希',
          value: transactionDetail.txHash
        },
        {
          label: '所属区块',
          value: transactionDetail.blockHash
        },
        // {
        //   label: '所属联盟',
        //   value: transactionDetail.leagueName,
        // },
        {
          label: '交易通道',
          value: transactionDetail.channelId
        },
        {
          label: '交易组织',
          value: transactionDetail.txMsp
        },
        {
          label: '背书组织',
          value: JSON.stringify(transactionDetail.txEndorseMsp)
        },
        {
          label: '交易时间',
          value: renderDateWithDefault(transactionDetail.createdAt)
        },
        {
          label: '所用合约',
          value: transactionDetail.chainCodeName
        },
        {
          label: '交易参数',
          value: JSON.stringify(transactionDetail.txArgs)
        }
      ];
    }
    return [];
  }, [transactionDetail]);

  useEffect(() => {
    dispatch({
      type: 'Transactions/getTransactionDetail',
      payload: { txHash: transactionHash, networkName }
    });
  }, [dispatch, networkName, transactionHash]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="交易详情" />
      <Spin spinning={qryLoading}>
        <div className="page-content">
          <Descriptions column={2} title="交易信息" className="descriptions-wrapper">
            {detailList.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </Spin>
    </div>
  );
};

export default connect(({ User, Transactions, loading }: ConnectState) => ({
  User,
  Transactions,
  qryLoading: loading.effects['Transactions/getTransactionDetail']
}))(TransactionDetail);
