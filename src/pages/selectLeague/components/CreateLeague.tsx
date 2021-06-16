import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

export type CreateLeagueProps = {
  addLoading: boolean;
  dispatch: Dispatch;
  visible: boolean;
  User: ConnectState['User'];
  onCancel: (callback: boolean) => void;
};

const CreateLeague: React.FC<CreateLeagueProps> = (props) => {
  const { dispatch, visible, onCancel, addLoading = false } = props;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          role: 'networkAdmin'
        };
        const res = await dispatch({
          type: 'User/createLeague',
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

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: Intl.formatMessage('BASS_CONSORTIUM_CREATE_CONSORTIUM'),
    onCancel: () => onCancel(false),
    footer: [
      <Button key="cancel" onClick={() => onCancel(false)}>
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
          label={Intl.formatMessage('BASS_CONSORTIUM_NAME')}
          name="leagueName"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONSORTIUM_INPUT_NAME')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_CONSORTIUM_INPUT_NAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_USER_INFO_NETWORK_NAME')}
          name="networkName"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_USER_INFO_INPUT_NETWORK_NAME')
            },
            {
              min: 6,
              max: 15,
              type: 'string',
              pattern: /^[a-zA-Z0-9]+$/,
              message: Intl.formatMessage('BASS_USER_INFO_NETWORK_NAME_LENGTH')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_USER_INFO_INPUT_NETWORK_NAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_USER_INFO_CONSORTIUM_DESCRIPTION')}
          name="description"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_USER_INFO_INPUT_CONSORTIUM_DESCRIPTION')
            },
            {
              min: 1,
              max: 100,
              type: 'string',
              message: Intl.formatMessage('BASS_USER_INFO_CONSORTIUM_DESCRIPTION_LENGTH')
            }
          ]}>
          <TextArea placeholder={Intl.formatMessage('BASS_USER_INFO_INPUT_CONSORTIUM_DESCRIPTION')} />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  addLoading: loading.effects['User/createLeague']
}))(CreateLeague);
