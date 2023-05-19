import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Descriptions, Divider, Spin } from 'antd';
import { isObject } from 'lodash';
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
  menuName: '存证详情',
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
      label: '上链时间',
      value: renderDateWithDefault(evidenceDataDetail?.createdAt),
    },
    {
      label: '所属通道',
      value: evidenceDataDetail && evidenceDataDetail.channelId,
    },
    {
      label: '所属网络',
      value: evidenceDataDetail && evidenceDataDetail.networkName,
    },
    {
      label: '创建用户',
      value: evidenceDataDetail && evidenceDataDetail.createUser,
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
      payload: { channelId: location?.query?.channelId, evidenceHash, networkName },
    });
  }, [dispatch, evidenceHash, location?.query?.channelId, networkName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="存证详情" />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <Descriptions column={2} title="基本信息" className="descriptions-wrapper">
            {detailList.map(item =>
              <Descriptions.Item
                key={item.label}
                label={item.label}>
                {item.value}
              </Descriptions.Item>
            )}
          </Descriptions>
          <div className="table-wrapper page-content-shadow">
            <div className="table-header-title">存证数据</div>
            <Divider />
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
