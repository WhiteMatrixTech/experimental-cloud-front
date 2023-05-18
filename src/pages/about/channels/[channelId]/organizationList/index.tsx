import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { Table, Button, Descriptions, Divider } from 'antd';
import { Breadcrumb, PageTitle, PlaceHolder } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import AddOrg from '../../components/AddOrg';
import { ChannelStatus } from '../../_config';
import baseConfig from '~/utils/config';
import { Roles } from '~/utils/roles';
import { ColumnsType } from 'antd/lib/table';
import { ChannelSchema, Dispatch, Location } from 'umi';
import { ConnectState } from '~/models/connect';
import { DetailViewAttr } from '~/utils/types';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/channels');
breadCrumbItem.push({
  menuName: '通道中组织数据',
  menuHref: `/`
});

const columns: ColumnsType<any> = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    key: 'orgName'
  },
  {
    title: '组织别名',
    dataIndex: 'orgAliasName',
    key: 'orgAliasName',
    render: (text) => <PlaceHolder text={text} />
  },
  {
    title: '组织MSPID',
    dataIndex: 'orgMspId',
    key: 'orgMspId'
  },
  {
    title: '所属用户',
    dataIndex: 'enterpriseName',
    key: 'enterpriseName',
    render: (text) => <PlaceHolder text={text} />
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
      params: { channelId: channelName }
    }
  } = props;
  const { userRole, networkName } = props.User;
  const { orgListOfChannel, orgTotalOfChannel, nodeTotalOfChannel } = props.Channel;
  const [pageNum, setPageNum] = useState(1);
  const [addOrgVisible, setAddOrgVisible] = useState(false);

  const channelInfoList = useMemo(() => {
    const list: DetailViewAttr[] = [
      {
        label: '通道名称',
        value: channelName
      },
      {
        label: '组织数量',
        value: orgTotalOfChannel
      },
      {
        label: '节点总数',
        value: nodeTotalOfChannel
      }
    ];
    return list;
  }, [channelName, orgTotalOfChannel, nodeTotalOfChannel]);

  // 获取 通道下的节点
  const getNodeListOfChannel = useCallback(() => {
    let params: { networkName: string; channelName?: string; orgName?: string } = {
      networkName,
      channelName
    };
    dispatch({
      type: 'Channel/getNodeListOfChannel',
      payload: params
    });
  }, [channelName, dispatch, networkName]);

  // 获取 通道下的组织
  const getOrgListOfChannel = useCallback(() => {
    const params = {
      networkName,
      channelName
    };
    dispatch({
      type: 'Channel/getOrgListOfChannel',
      payload: params
    });
  }, [channelName, dispatch, networkName]);

  useEffect(() => {
    getOrgListOfChannel();
    getNodeListOfChannel();
  }, [getNodeListOfChannel, getOrgListOfChannel]);

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
    return userRole === Roles.ADMIN && location?.state?.status === ChannelStatus.IN_USE;
  }, [userRole, location?.state?.status]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="通道中组织数据" />
      <div className="page-content">
        <Descriptions title="通道信息" className="descriptions-wrapper">
          {channelInfoList.map((item) => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <div className="page-content page-content-shadow table-wrapper">
          <div className="table-header-title">
            <span>组织列表</span>
            {showAddOrg && (
              <Button type="primary" onClick={onClickAddOrg}>
                添加组织
              </Button>
            )}
          </div>
          <Divider />
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
      {addOrgVisible && <AddOrg visible={addOrgVisible} channelName={channelName} onCancel={onCloseModal} />}
    </div>
  );
}

export default connect(({ Channel, Layout, User, loading }: ConnectState) => ({
  Channel,
  Layout,
  User,
  qryLoading: loading.effects['Channel/getOrgListOfChannel']
}))(OrganizationList);
