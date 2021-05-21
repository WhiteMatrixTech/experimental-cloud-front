import React from 'react';
import { connect } from 'dva';
import { Dispatch, Location } from 'umi';
import { Spin } from 'antd';
import moment from 'moment';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { DetailViewAttr } from '~/utils/types';
import { ConnectState } from '~/models/connect';
import { ChainCodeSchema } from '~/models/contract';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', true);
breadCrumbItem.push({
  menuName: '合约详情',
  menuHref: `/`,
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
      label: '合约名称',
      value: chaincodeInfo.chainCodeName,
    },
    {
      label: '所属通道',
      value: chaincodeInfo.channelId,
    },
    {
      label: '合约语言类型',
      value: chaincodeInfo.chainCodePackageMetaData ? chaincodeInfo.chainCodePackageMetaData.language : '',
    },
    {
      label: '当前版本',
      value: chaincodeInfo.chainCodeVersion,
    },
    {
      label: '创建组织',
      value: chaincodeInfo.createOrgName,
    },
    {
      label: '创建时间',
      value: chaincodeInfo.createdAt ? moment(chaincodeInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : '- -',
    },
    {
      label: '背书组织',
      fullRow: true,
      value: chaincodeInfo.endorsementPolicy ? JSON.stringify(chaincodeInfo.endorsementPolicy.orgsToApprove) : '',
    },
    {
      label: '合约描述',
      fullRow: true,
      value: chaincodeInfo.description,
    },
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard
          cardTitle="合约信息"
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
  Contract,
}))(ContractDetail);
