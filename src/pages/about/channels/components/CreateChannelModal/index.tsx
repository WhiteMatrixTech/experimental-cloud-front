import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal } from 'antd';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};
export interface CreateChannelModalProps {
  visible: boolean;
  User: ConnectState['User'];
  onCancel: any;
  dispatch: Dispatch;
  addLoading: boolean;
  Organization: ConnectState['Organization'];
}
function CreateChannelModal({ visible, User, onCancel, dispatch, addLoading, Organization }: CreateChannelModalProps) {
  const { orgInUseList } = Organization;
  const { networkName } = User;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          networkName: User.networkName
        };
        const res = await dispatch({
          type: 'Channel/createChannel',
          payload: params
        });
        if (res) {
          onCancel(true);
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgInUseList',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: Intl.formatMessage('BASS_CHANNEL_CREATE'),
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" loading={addLoading} onClick={handleSubmit} type="primary">
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label={Intl.formatMessage('BASS_CHANNEL_NAME')}
          name="channelId"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CHANNEL_INPUT_NAME')
            },
            {
              min: 4,
              max: 20,
              type: 'string',
<<<<<<< HEAD
              pattern: /^[a-z0-9-]{4,20}$/,
              message: '通道名称必须由4-20位的小写字母或数字组成, 字母开头',
            },
          ]}
        >
          <Input placeholder="请输入通道名称" />
=======
              pattern: /^[a-z0-9\-]{4,20}$/,
              message: Intl.formatMessage('BASS_CHANNEL_NAME_LENGTH')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_CHANNEL_INPUT_NAME')} />
>>>>>>> feat: :art: Internationalising the page
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CHANNEL_ALIAS')}
          name="channelNameAlias"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CHANNEL_INPUT_ALIAS')
            },
            {
              min: 3,
              max: 19,
              type: 'string',
              pattern: /^([\u4E00-\u9FA5]|[A-Za-z0-9]){1,50}$/,
              message: Intl.formatMessage('BASS_CHANNEL_ALIAS_LENGTH')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_CHANNEL_INPUT_ALIAS')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')}
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
            placeholder={Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')}
            mode="multiple">
            {orgInUseList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CHANNEL_DESCRIBE')}
          name="description"
          initialValue=""
          rules={[
            {
              min: 0,
              max: 300,
              type: 'string',
              message: Intl.formatMessage('BASS_CHANNEL_DESCRIBE_LENGTH')
            }
          ]}>
          <TextArea rows={3} placeholder={Intl.formatMessage('BASS_CHANNEL_INPUT_DESCRIBE')} />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Channel, Organization, loading }: ConnectState) => ({
  User,
  Channel,
  Organization,
  addLoading: loading.effects['Channel/createChannel']
}))(CreateChannelModal);
