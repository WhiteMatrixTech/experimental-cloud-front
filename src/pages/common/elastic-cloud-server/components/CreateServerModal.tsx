import React from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { serverPurpose } from '../_config';
import { Dispatch, ElasticServerSchema } from 'umi';
import { ConnectState } from '~/models/connect';
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
export interface CreateServerModalProps {
  record: ElasticServerSchema | null;
  visible: boolean;
  onCancel: () => void;
  submitLoading: boolean;
  dispatch: Dispatch;
  getServerList: () => void;
}
function CreateServerModal(props: CreateServerModalProps) {
  const { record, visible, onCancel, submitLoading = false, dispatch } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = { ...values };
        let apiProgress = false;
        if (record) {
          apiProgress = await dispatch({
            type: 'ElasticServer/modifyServer',
            payload: params
          });
        } else {
          apiProgress = await dispatch({
            type: 'ElasticServer/createServer',
            payload: params
          });
        }
        if (apiProgress) {
          onCancel();
          props.getServerList();
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
    title: record
      ? Intl.formatMessage('BASS_ELASTIC_CLOUD_MODIFY_SERVER_INFORMATION')
      : Intl.formatMessage('BASS_ELASTIC_CLOUD_CREATE_SERVER'),
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={submitLoading}>
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_SERVER_NAME')}
          name="serverName"
          initialValue={(record && record.serverName) || ''}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_SERVER_NAME')
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_SERVER_NAME_LENGTH')
            }
          ]}>
          <Input
            disabled={!!(record && record.serverName)}
            placeholder={Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_SERVER_NAME')}
          />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_USERNAME')}
          name="username"
          initialValue={(record && record.username) || ''}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_INPUT_USERNAME')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_MEMBER_MANAGEMENT_INPUT_USERNAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_TYPE_OF_USE')}
          name="serverPurpose"
          initialValue={(record && record.serverPurpose) || null}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_SELECT_USE_TYPE')
            }
          ]}>
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择用途类型">
            {Object.keys(serverPurpose).map((type) => (
              <Option key={serverPurpose[type]} value={serverPurpose[type]}>
                {serverPurpose[type]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_EXTRANET_IP')}
          name="publicIp"
          initialValue={(record && record.publicIp) || ''}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_EXTRANET_IP')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_EXTRANET_IP')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_INTRANET_IP')}
          name="privateIp"
          initialValue={(record && record.privateIp) || ''}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_INTRANET_IP')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_INTRANET_IP')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_PUBLIC_KEY')}
          name="publicKey"
          initialValue={(record && record.publicKey) || ''}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_PUBLIC_KEY')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_PUBLIC_KEY')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ELASTIC_CLOUD_PRIVATE_KEY')}
          name="privateKey"
          initialValue={(record && record.privateKey) || ''}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_PRIVATE_KEY')
            }
          ]}>
          <Input.TextArea placeholder={Intl.formatMessage('BASS_ELASTIC_CLOUD_INPUT_PRIVATE_KEY')} />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, ElasticServer, loading }: ConnectState) => ({
  User,
  ElasticServer,
  submitLoading: loading.effects['ElasticServer/createServer'] || loading.effects['ElasticServer/modifyServer']
}))(CreateServerModal);
