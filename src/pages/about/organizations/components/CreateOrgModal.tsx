import React, { useEffect, useMemo } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { serverPurpose } from '~/pages/common/elastic-cloud-server/_config';
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
export interface CreateOrgModalProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: (callback?: any) => void;
  addLoading: boolean;
  User: ConnectState['User'];
  Contract: ConnectState['Contract'];
  ElasticServer: ConnectState['ElasticServer'];
}
function CreateOrgModal(props: CreateOrgModalProps) {
  const { dispatch, visible, onCancel, addLoading = false, User, Contract, ElasticServer } = props;
  const { networkName } = User;
  const { channelList } = Contract;
  const { serverList } = ElasticServer;

  const [form] = Form.useForm();

  const filteredServerList = useMemo(
    () => serverList.filter((server) => server.serverPurpose !== serverPurpose.SwarmManager),
    [serverList]
  );

  useEffect(() => {
    const params = {
      limit: 100,
      offset: 0,
      ascend: false
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params
    });
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { serverName, ...rest } = values;
        let params = {
          ...rest,
          networkName
        };
        if (values.serverName) {
          params.serverName = values.serverName;
        }
        const res = await dispatch({
          type: 'Organization/createOrg',
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
    title: Intl.formatMessage('BASS_ORGANSIZATION_CREATE'),
    onCancel: () => onCancel(),
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
          label={Intl.formatMessage('BASS_COMMON_CHANNEL')}
          name="channelId"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')}>
            {channelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ORGANSIZATION_NAME')}
          name="orgName"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ORGANSIZATION_INPUT_NAME')
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: Intl.formatMessage('BASS_ORGANSIZATION_NAME_LENGTH')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ORGANSIZATION_INPUT_NAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ORGANSIZATION_ALIAS')}
          name="orgNameAlias"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ORGANSIZATION_INPUT_ALIAS')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ORGANSIZATION_INPUT_ALIAS')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ORGANSIZATION_INITIALIZE_NODE_NAME')}
          name="initPeerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ORGANSIZATION_INPUT_INITIALIZE_NODE_NAME')
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: Intl.formatMessage('BASS_ORGANSIZATION_INITIALIZE_NODE_ALIASES_LENGTH')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ORGANSIZATION_INPUT_INITIALIZE_NODE_NAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ORGANSIZATION_INITIALIZE_NODE_ALIASES')}
          name="initPeerAliasName"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ORGANSIZATION_INPUT_INITIALIZE_NODE_ALIASES')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ORGANSIZATION_INPUT_INITIALIZE_NODE_ALIASES')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_NODE_SERVERS')}
          name="serverName"
          tooltip={Intl.formatMessage('BASS_NODE_DEFAULT_SERVERS')}>
          <Select
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_NODE_SELECT_SERVERS')}>
            {filteredServerList.map((item) => (
              <Option key={item.serverName} value={item.serverName}>
                {item.serverName}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Organization, ElasticServer, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  Organization,
  ElasticServer,
  addLoading: loading.effects['Organization/createOrg']
}))(CreateOrgModal);
