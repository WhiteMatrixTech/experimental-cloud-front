import React, { useMemo } from 'react';
import { connect } from 'dva';
import { Descriptions, Spin } from 'antd';
import { Breadcrumb, PageTitle } from '~/components';
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import { statusList } from '../_config';
import { ConnectState } from '~/models/connect';
import * as memberApi from '~/services/member';
import { EnterpriseMemberSchema, useParams } from 'umi';
import { DetailViewAttr } from '~/utils/types';
import moment from 'moment';
import { useRequest } from 'ahooks';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/member');
breadCrumbItem.push({
  menuName: '成员详情',
  menuHref: `/`
});
export interface MemberDetailProps {
  User: ConnectState['User'];
}
const MemberDetail: React.FC<MemberDetailProps> = (props) => {
  const { User } = props;

  const { networkName } = User;

  const routerParams = useParams() as any;
  const memberEmail = useMemo(() => routerParams.memberEmail, [routerParams]);

  const { data: memberDetail, loading: queryLoading } = useRequest(
    async () => {
      const res = await memberApi.getMemberDetail({ networkName, email: memberEmail });
      const { result } = res;
      return result as EnterpriseMemberSchema;
    },
    {
      refreshDeps: [memberEmail]
    }
  );

  const basicInfo: DetailViewAttr[] = [
    {
      label: '用户名称',
      value: memberDetail?.name
    },
    {
      label: '公司名称',
      value: memberDetail?.enterpriseName
    },
    {
      label: '统一社会信用代码',
      value: memberDetail?.enterpriseUsci
    }
  ];

  const contactsInfo: DetailViewAttr[] = [
    {
      label: '手机号码',
      value: memberDetail?.phoneNo
    },
    {
      label: '联系邮箱',
      value: memberDetail?.email
    },
    {
      label: '联系地址',
      value: memberDetail?.address
    },
    {
      label: '访问策略名称',
      value: memberDetail?.roleName
    },
    {
      label: '当前审批状态',
      value: memberDetail?.status ? statusList[memberDetail?.status] : '--'
    },
    {
      label: '当前启用状态',
      value: memberDetail?.disabled ? '停用' : '启用'
    },
    {
      label: '申请时间',
      value: memberDetail?.applicationTime ? moment(memberDetail?.applicationTime).format('YYYY-MM-DD HH:mm:ss') : '--'
    },
    {
      label: '审批时间',
      value: memberDetail?.approveTime ? moment(memberDetail?.approveTime).format('YYYY-MM-DD HH:mm:ss') : '--'
    }
  ];

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <PageTitle label="成员详情" />
      <Spin spinning={queryLoading}>
        <div className="page-content">
          <Descriptions title="基本信息" className="descriptions-wrapper">
            {basicInfo.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
          <Descriptions title="详细信息" className="descriptions-wrapper">
            {contactsInfo.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </Spin>
    </div>
  );
};

export default connect(({ User, Member }: ConnectState) => ({
  User,
  Member
}))(MemberDetail);
