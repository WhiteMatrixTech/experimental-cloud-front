import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Spin } from 'antd';
import { isObject } from 'lodash';
import { Breadcrumb, DetailCard } from '~/components';
import ReactJson from 'react-json-view';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { ConnectState } from '~/models/connect';
import { Dispatch, EvidenceSchema, Location } from 'umi';
import { DetailViewAttr } from '~/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/evidence');
breadCrumbItem.push({
  menuName: '存证上链详情',
  menuHref: `/`,
});
export interface EvidenceDataDetailProps {
  User: ConnectState['User'];
  Evidence: ConnectState['Evidence'];
  qryLoading: boolean;
  location: Location<EvidenceSchema>;
  dispatch: Dispatch;
  match: { params: { evidenceHash: string } };
}
function EvidenceDataDetail({
  match: {
    params: { evidenceHash },
  },
  User,
  Evidence,
  qryLoading = false,
  location,
  dispatch,
}: EvidenceDataDetailProps) {
  const { networkName } = User;
  const { evidenceDataDetail } = Evidence;
  const detailList: DetailViewAttr[] = [
    {
      label: '存证哈希',
      value: evidenceDataDetail && evidenceDataDetail.evidenceHash,
    },
    {
      label: '所属通道',
      value: evidenceDataDetail && evidenceDataDetail.channelId,
    },
    {
      label: '创建用户',
      value: evidenceDataDetail && evidenceDataDetail.companyName,
    },
    {
      label: '上链时间',
      value: evidenceDataDetail && moment(evidenceDataDetail.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '所属网络',
      value: evidenceDataDetail && evidenceDataDetail.networkName,
    },
    {
      label: '存证用户',
      value: evidenceDataDetail && evidenceDataDetail.createUser,
    },
  ];

  const getEvidenceData = () => {
    let evidenceData: { evidenceData: string } = { evidenceData: '' };
    if (evidenceDataDetail && evidenceDataDetail.evidenceData) {
      try {
        let parsedData = null;
        parsedData = JSON.parse(evidenceDataDetail.evidenceData);
        evidenceData = parsedData;
        if (!isObject(parsedData)) {
          evidenceData = { evidenceData: parsedData };
        }
      } catch (err) {
        evidenceData = { evidenceData: evidenceDataDetail.evidenceData };
      }
      return evidenceData;
    }
    return evidenceData;
  };

  useEffect(() => {
    dispatch({
      type: 'Evidence/getEvidenceDataDetail',
      payload: { channelId: location?.query?.channelId, evidenceHash, networkName },
    });
  }, [dispatch, evidenceHash, location?.query?.channelId, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="基本信息" detailList={detailList} />
          <div className={styles['detail-card-wrapper']}>
            <div className={styles['detail-card-title']}>
              <span className={styles['detail-title-content']}>存证信息</span>
            </div>
            <div className={styles['detail-info-wrapper']}>
              <ReactJson name={null} src={getEvidenceData()} />
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
  qryLoading: loading.effects['certificateChain/getEvidenceDataDetail'],
}))(EvidenceDataDetail);
