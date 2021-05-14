import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Select, Form, Button, Modal } from 'antd';
import { Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { OrganizationSchema } from '@/models/organization';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};
export interface AddOrgProps {
  visible: boolean;
  onCancel: () => void;
  channelId: string;
  addLoading: boolean;
  dispatch: Dispatch;
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  Organization: ConnectState['Organization'];
}
function AddOrg(props: AddOrgProps) {
  const { visible, onCancel, channelId, addLoading = false, dispatch, User, Channel, Organization } = props;
  const { networkName } = User;
  const { orgList } = Organization;
  const { orgListOfChannel } = Channel;

  const [form] = Form.useForm();

  const optionalOrgList = useMemo(() => {
    let orgData: OrganizationSchema[] = [];
    return orgList.reduce(function (pre, cur) {
      if (orgListOfChannel.every((item) => item.orgName !== cur.orgName)) {
        pre.push(cur);
      }
      return pre;
    }, orgData);
  }, [orgList, orgListOfChannel]);

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgList',
      payload: { networkName },
    });
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = dispatch({
          type: 'Channel/addOrgForChannel',
          payload: { networkName, channelId, orgName: values.peerOrgNames },
        });
        if (res) {
          onCancel();
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '添加组织',
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={addLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="组织名称"
          name="peerOrgNames"
          rules={[
            {
              required: true,
              message: '请选择组织',
            },
          ]}
        >
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择组织">
            {optionalOrgList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Channel, User, Organization, loading }: ConnectState) => ({
  User,
  Channel,
  Organization,
  addLoading: loading.effects['Channel/addOrgForChannel'],
}))(AddOrg);
