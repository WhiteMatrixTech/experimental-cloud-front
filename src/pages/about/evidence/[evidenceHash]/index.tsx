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
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/evidence');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_EVIDENCE_DETAIL_OF_ON_CHAIN'),
  menuHref: `/`
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
    params: { evidenceHash }
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
      label: Intl.formatMessage('BASS_EVIDENCE_DEPOSITED_HASH'),
      value: evidenceDataDetail && evidenceDataDetail.evidenceHash
    },
    {
      label: Intl.formatMessage('BASS_COMMON_CHANNEL'),
      value: evidenceDataDetail && evidenceDataDetail.channelId
    },
    {
      label: Intl.formatMessage('BASS_EVIDENCE_CREATE_USER'),
      value: evidenceDataDetail && evidenceDataDetail.companyName
    },
    {
      label: Intl.formatMessage('BASS_EVIDENCE_TIME_FOR_ON_CHAIN'),
      value: evidenceDataDetail && moment(evidenceDataDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: Intl.formatMessage('BASS_EVIDENCE_NETWORK_NAME'),
      value: evidenceDataDetail && evidenceDataDetail.networkName
    },
    {
      label: Intl.formatMessage('BASS_EVIDENCE_EVIDENCE_USER'),
      value: evidenceDataDetail && evidenceDataDetail.createUser
    }
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
      payload: { channelId: location?.query?.channelId, evidenceHash, networkName }
    });
  }, [dispatch, evidenceHash, location?.query?.channelId, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle={Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')} detailList={detailList} />
          <div className={styles['detail-card-wrapper']}>
            <div className={styles['detail-card-title']}>
              <span className={styles['detail-title-content']}>
                {Intl.formatMessage('BASS_EVIDENCE_DEPOSITED_INFORMATION')}
              </span>
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
  qryLoading: loading.effects['certificateChain/getEvidenceDataDetail']
}))(EvidenceDataDetail);
