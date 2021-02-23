import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Spin } from 'antd';
import { isObject } from 'lodash';
import { Breadcrumb, DetailCard } from 'components';
import ReactJson from 'react-json-view';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import styles from './index.less';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/certificateChain');
breadCrumbItem.push({
  menuName: '存证上链详情',
  menuHref: `/`,
});

function certificateChainDetail({
  match: {
    params: { evidenceHash },
  },
  User,
  CertificateChain,
  qryLoading = false,
  location,
  dispatch,
}) {
  const { networkName } = User;
  const { certificateChainDetail } = CertificateChain;
  const detailList = [
    {
      label: '存证哈希',
      value: certificateChainDetail.evidenceHash,
    },
    {
      label: '所属通道',
      value: certificateChainDetail.channelId,
    },
    {
      label: '创建公司',
      value: certificateChainDetail.companyName,
    },
    {
      label: '上链时间',
      value: moment(certificateChainDetail.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '所属网络',
      value: certificateChainDetail.networkName,
    },
    {
      label: '存证用户',
      value: certificateChainDetail.createUser,
    },
  ];

  const getEvidenceData = () => {
    if (certificateChainDetail.evidenceData) {
      let evidenceData = '';
      try {
        let parsedData = null;
        parsedData = JSON.parse(certificateChainDetail.evidenceData);
        evidenceData = parsedData;
        if (!isObject(parsedData)) {
          evidenceData = { evidenceData: parsedData };
        }
      } catch (err) {
        evidenceData = { evidenceData: certificateChainDetail.evidenceData };
      }
      return evidenceData;
    }
    return '';
  };

  useEffect(() => {
    dispatch({
      type: 'CertificateChain/getCertificateChainDetail',
      payload: { channelId: location?.query?.channelId, evidenceHash, networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <Spin spinning={qryLoading}>
          <DetailCard cardTitle="基本信息" detailList={detailList} />
          <div className={styles['detail-card-wrapper']}>
            <div className={styles['detail-card-title']}>
              <span className={styles['detail-title-border']}></span>
              <span className={styles['detail-title-content']}>存证信息</span>
            </div>
            <div className={styles['detail-info-wrapper']}>
              <ReactJson name="evidenceData" src={getEvidenceData()} />
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default connect(({ User, Layout, CertificateChain, loading }) => ({
  User,
  CertificateChain,
  Layout,
  qryLoading: loading.effects['certificateChain/getCertificateChainDetail'],
}))(certificateChainDetail);
