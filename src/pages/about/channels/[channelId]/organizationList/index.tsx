import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { Breadcrumb, DetailCard } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import AddOrg from '../../components/AddOrg';
import { ChannelStatusMap } from '../../_config';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { ColumnsType } from 'antd/lib/table';
import { ChannelSchema, Dispatch, Location } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';
import { Intl } from '~/utils/locales';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_CHANNEL_VIEW_ORGANIZATION'),
  menuHref: `/`
});

const columns: ColumnsType<any> = [
  {
    title: Intl.formatMessage('BASS_ORGANSIZATION_NAME'),
    dataIndex: 'orgName',
    key: 'orgName'
  },
  {
    title: Intl.formatMessage('BASS_ORGANSIZATION_ALIAS'),
    dataIndex: 'orgAliasName',
    key: 'orgAliasName'
  },
  {
    title: Intl.formatMessage('BASS_ORGANSIZATION_MSPID'),
    dataIndex: 'orgMspId',
    key: 'orgMspId'
  },
  {
    title: Intl.formatMessage('BASS_ORGANSIZATION_USER'),
    dataIndex: 'companyName',
    key: 'companyName'
  },
  {
    title: Intl.formatMessage('BASS_ORGANSIZATION_ADDRESS'),
    dataIndex: 'orgAddress',
    key: 'orgAddress'
  }
];

export interface OrganizationListProps {
  qryLoading: boolean;
  location: Location<ChannelSchema>;
  dispatch: Dispatch;
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  match: { params: { channelId: string } };
}
function OrganizationList(props: OrganizationListProps) {
  const {
    qryLoading = false,
    location,
    dispatch,
    match: {
      params: { channelId }
    }
  } = props;
  const { userRole, networkName } = props.User;
  const { orgListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;
  const [pageNum, setPageNum] = useState(1);
  const [addOrgVisible, setAddOrgVisible] = useState(false);

  const channelInfoList = useMemo(() => {
    const list: DetailViewAttr[] = [
      {
        label: Intl.formatMessage('BASS_CHANNEL_NAME'),
        value: channelId
      },
      {
        label: Intl.formatMessage('BASS_CHANNEL_NUMBER_OF_ORGANIZATION'),
        value: orgTotalOfChannel
      },
      {
        label: Intl.formatMessage('BASS_CHANNEL_TOTAL_NUMBER_OF_NODES'),
        value: nodeTotalOfChannel
      }
    ];
    return list;
  }, [channelId, orgTotalOfChannel, nodeTotalOfChannel]);

  // 获取 通道下的组织
  const getOrgListOfChannel = useCallback(() => {
    const params = {
      networkName,
      channelId
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params
    });
  }, [channelId, dispatch, networkName]);

  useEffect(() => {
    getOrgListOfChannel();
  }, [getOrgListOfChannel]);

  // 翻页
  const onPageChange = (pageInfo: any) => {
    setPageNum(pageInfo.current);
  };

  const onCloseModal = () => {
    setAddOrgVisible(false);
    getOrgListOfChannel();
  };

  const onClickAddOrg = () => {
    setAddOrgVisible(true);
  };

  const showAddOrg = useMemo(() => {
    return userRole === Roles.NetworkAdmin && location?.state?.channelStatus === ChannelStatusMap.InUse;
  }, [userRole, location?.state?.channelStatus]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content">
        <DetailCard
          cardTitle={Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')}
          detailList={channelInfoList}
          boxShadow="0 4px 12px 0 rgba(0,0,0,.05)"
          columnsNum={2}
        />
        <div className="page-content page-content-shadow table-wrapper">
          {showAddOrg && (
            <div className="table-header-btn-wrapper">
              <Button type="primary" onClick={onClickAddOrg}>
                {Intl.formatMessage('BASS_ORGANSIZATION_ADD')}
              </Button>
            </div>
          )}
          <Table
            rowKey="_id"
            loading={qryLoading}
            columns={columns}
            dataSource={orgListOfChannel}
            onChange={onPageChange}
            pagination={{
              pageSize: baseConfig.pageSize,
              total: orgTotalOfChannel,
              current: pageNum,
              position: ['bottomCenter']
            }}
          />
        </div>
      </div>
      {addOrgVisible && <AddOrg visible={addOrgVisible} channelId={channelId} onCancel={onCloseModal} />}
    </div>
  );
}

export default connect(({ Channel, Layout, User, loading }: ConnectState) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getOrgListOfChannel']
}))(OrganizationList);
