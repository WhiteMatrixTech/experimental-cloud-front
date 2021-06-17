import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Select, Form, Button, Modal, notification } from 'antd';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { OrganizationSchema } from '~/models/organization';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};
export interface AddOrgProps {
  visible: boolean;
  onCancel: () => void;
  channelId: string | undefined;
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
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await dispatch({
          type: 'Channel/addOrgForChannel',
          payload: { networkName, channelId, orgName: values.peerOrgNames }
        });
        const { statusCode, result } = res;
        if (statusCode === 'ok') {
          onCancel();
          notification.success({
            message: Intl.formatMessage('BASS_NOTIFICATION_CHANNEL_ADD_ORGANISATION_SUCCESS'),
            top: 64,
            duration: 3
          });
        } else {
          notification.error({
            message: result.message || Intl.formatMessage('BASS_NOTIFICATION_CHANNEL_ADD_ORGANISATION_FAILED'),
            top: 64,
            duration: 3
          });
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
    title: Intl.formatMessage('BASS_ORGANSIZATION_ADD'),
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={addLoading}>
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label={Intl.formatMessage('BASS_ORGANSIZATION_NAME')}
          name="peerOrgNames"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')}>
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
  addLoading: loading.effects['Channel/addOrgForChannel']
}))(AddOrg);
