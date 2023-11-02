import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Descriptions, Divider, Spin } from 'antd';
import { Breadcrumb, PageTitle } from '~/components';
import ReactJson from 'react-json-view';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, EvidenceSchema, Location } from 'umi';
import { DetailViewAttr } from '~/utils/types';
import { renderDateWithDefault } from '~/utils/date';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/evidence');
breadCrumbItem.push({
  menuName: '链上详情',
  menuHref: `/`
});
export interface EvidenceDataDetailProps {
  User: ConnectState['User'];
  Evidence: ConnectState['Evidence'];
  qryLoading: boolean;
  location: Location<EvidenceSchema>;
  dispatch: Dispatch;
  match: { params: { transactionHash: string } };
}
function EvidenceDataDetail({
  match: {
    params: { transactionHash }
  },
  User,
  Evidence,
  qryLoading = false,
  location,
  dispatch
}: EvidenceDataDetailProps) {
  const { networkName } = User;
  const { evidenceDataDetail } = Evidence;
  const detailList: DetailViewAttr[] = [
    {
      label: '交易哈希',
      value: evidenceDataDetail && evidenceDataDetail.transactionHash
    },
    {
      label: '上链时间',
      value: renderDateWithDefault(evidenceDataDetail?.createdAt)
    },
    {
      label: '合约名',
      value: evidenceDataDetail && evidenceDataDetail.chaincode
    },
    {
      label: '方法名',
      value: evidenceDataDetail && evidenceDataDetail.method
    },
    {
      label: '所属通道',
      value: evidenceDataDetail && evidenceDataDetail.channelId
    },
    {
      label: '所属网络',
      value: evidenceDataDetail && evidenceDataDetail.networkName
    },
    {
      label: '创建用户',
      value: evidenceDataDetail && evidenceDataDetail.createUser
    }
  ];

  useEffect(() => {
    dispatch({
      type: 'Evidence/getEvidenceDataDetail',
      payload: { channelId: location?.query?.channelId, transactionHash, networkName }
    });
  }, [dispatch, transactionHash, location?.query?.channelId, networkName]);

  const getResPayload = () => {
    let result = {}
    try {
      result = JSON.parse(evidenceDataDetail?.responsePayload || '')
    }catch(e){
      console.error(e);
      result = {
        result: evidenceDataDetail?.responsePayload || null
      }
    }
    return result;
  }

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="链上详情" />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <Descriptions column={2} title="基本信息" className="descriptions-wrapper">
            {detailList.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
          <div className="table-wrapper page-content-shadow">
            <div className="table-header-title">调用参数</div>
            <Divider />
            <div className={styles['detail-info-wrapper']}>
              <ReactJson name={null} src={evidenceDataDetail?.args || []} />
            </div>
          </div>
          <div className="table-wrapper page-content-shadow">
            <div className="table-header-title">响应</div>
            <Divider />
            <div className={styles['detail-info-wrapper']}>
              <ReactJson name={null} src={getResPayload()} />
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, Layout, Evidence, loading }: ConnectState) => ({
  User,
  Evidence,
  Layout,
  qryLoading: loading.effects['certificateChain/getEvidenceDataDetail']
}))(EvidenceDataDetail);
