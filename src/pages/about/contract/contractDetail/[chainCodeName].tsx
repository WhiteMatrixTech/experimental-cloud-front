import React from 'react';
import { connect } from 'dva';
import { Dispatch, Location } from 'umi';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { DetailViewAttr } from '~/utils/types';
import { ConnectState } from '~/models/connect';
import { ChainCodeSchema } from '~/models/contract';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', true);
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_CONTRACT_DETAILS'),
  menuHref: `/`
});
export interface ContractDetailProps {
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  dispatch: Dispatch;
  location: Location<ChainCodeSchema>;
}

const ContractDetail: React.FC<ContractDetailProps> = (props) => {
  const chaincodeInfo = props.location.state;

  const contractInfoList: DetailViewAttr[] = [
    {
      label: Intl.formatMessage('BASS_CONTRACT_NAME'),
      value: chaincodeInfo.chainCodeName
    },
    {
      label: Intl.formatMessage('BASS_COMMON_CHANNEL'),
      value: chaincodeInfo.channelId
    },
    {
      label: Intl.formatMessage('BASS_CONTRACT_LANGUAGE_TYPE'),
      value: chaincodeInfo.chainCodePackageMetaData ? chaincodeInfo.chainCodePackageMetaData.language : ''
    },
    {
      label: Intl.formatMessage('BASS_CONTRACT_VERSION'),
      value: chaincodeInfo.chainCodeVersion
    },
    {
      label: Intl.formatMessage('BASS_CONTRACT_CREATE_AN_ORGANISATION'),
      value: chaincodeInfo.createOrgName
    },
    {
      label: Intl.formatMessage('BASS_COMMON_GENERATED_TIME'),
      value: chaincodeInfo.createdAt ? moment(chaincodeInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -'
    },
    {
      label: Intl.formatMessage('BASS_CONTRACT_ENDOESEMENT'),
      fullRow: true,
      value: chaincodeInfo.endorsementPolicy ? JSON.stringify(chaincodeInfo.endorsementPolicy.orgsToApprove) : ''
    },
    {
      label: Intl.formatMessage('BASS_CONTRACT_DESCRIPTION'),
      fullRow: true,
      value: chaincodeInfo.description
    }
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard
          cardTitle={Intl.formatMessage('BASS_CONTRACT_INFORMATION')}
          detailList={contractInfoList}
          columnsNum={3}
          boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
        />
      </div>
    </div>
  );
};

export default connect(({ User, Contract }: ConnectState) => ({
  User,
  Contract
}))(ContractDetail);
