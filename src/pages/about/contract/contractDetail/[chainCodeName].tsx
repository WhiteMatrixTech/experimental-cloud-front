import React from 'react';
import { connect } from 'dva';
import { Dispatch, Location } from 'umi';
import moment from 'moment';
import { Breadcrumb, DetailCard, PageTitle, PlaceHolder } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { DetailViewAttr } from '~/utils/types';
import { ConnectState } from '~/models/connect';
import { ChainCodeSchema } from '~/models/contract';
import { Descriptions } from 'antd';
import { renderDateWithDefault } from '~/utils/date';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', true);
breadCrumbItem.push({
  menuName: '合约详情',
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
      label: '合约名称',
      value: chaincodeInfo.chainCodeName
    },
    {
      label: '所属通道',
      value: chaincodeInfo.channelId
    },
    {
      label: '当前版本',
      value: chaincodeInfo.chainCodeVersion
    },
    {
      label: '创建组织',
      value: chaincodeInfo.createOrgName
    },
    {
      label: '背书策略',
      fullRow: true,
      value: chaincodeInfo.endorsementPolicy
    },
    {
      label: '创建时间',
      value: renderDateWithDefault(chaincodeInfo.createTime)
    },
    {
      label: '合约描述',
      fullRow: true,
      value: <PlaceHolder text={chaincodeInfo.description} />
    }
  ];
  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="合约详情" />
      <div className="page-content">
        <Descriptions title="合约信息" className="descriptions-wrapper">
          {contractInfoList.map((item) => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    </div>
  );
};

export default connect(({ User, Contract }: ConnectState) => ({
  User,
  Contract
}))(ContractDetail);
