import React, { useEffect, useMemo } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { serverPurpose } from '~/pages/common/elastic-cloud-server/_config';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';

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
export interface handleSubmitParams {
  networkName: string;
  orgName: string;
  peerName: string;
  peerNameAlias: string;
  serverName?: string;
}
export interface CreateNodeModalProps {
  Organization: ConnectState['Organization'];
  ElasticServer: ConnectState['ElasticServer'];
  visible: boolean;
  onCancel: () => void;
  addLoading: boolean;
  User: ConnectState['User'];
  dispatch: Dispatch;
  getNodeList: () => void;
}
function CreateNodeModal(props: CreateNodeModalProps) {
  const { Organization, ElasticServer, visible, onCancel, addLoading = false, User, dispatch } = props;
  const { networkName } = User;
  const { orgInUseList } = Organization;
  const { serverList } = ElasticServer;

  const [form] = Form.useForm();

  const filteredServerList = useMemo(
    () => serverList.filter((server) => server.serverPurpose !== serverPurpose.SwarmManager),
    [serverList],
  );

  useEffect(() => {
    const params = {
      limit: 100,
      offset: 0,
      ascend: false,
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params,
    });
    dispatch({
      type: 'Organization/getOrgInUseList',
      payload: { networkName },
    });
  }, [dispatch, networkName]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params: handleSubmitParams = {
          networkName,
          orgName: values.orgName,
          peerName: values.peerName,
          peerNameAlias: values.peerNameAlias,
        };
        if (values.serverName) {
          params.serverName = values.serverName;
        }
        dispatch({
          type: 'Peer/createNode',
          payload: params,
        }).then((res: any) => {
          if (res) {
            onCancel();
            props.getNodeList();
          }
        });
        form.setFieldsValue(values);
      })
      .catch((info) => {
        console.log('????????????:', info);
      });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '????????????',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        ??????
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={addLoading}>
        ??????
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="????????????"
          name="orgName"
          rules={[
            {
              required: true,
              message: '?????????????????????',
            },
          ]}
        >
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="??????????????????">
            {orgInUseList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="????????????"
          name="peerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '?????????????????????',
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: '??????????????????4~20??????????????????????????????,??????????????????',
            },
          ]}
        >
          <Input placeholder="??????????????????" />
        </Item>
        <Item
          label="????????????"
          name="peerNameAlias"
          initialValue=""
          rules={[
            {
              required: true,
              message: '?????????????????????',
            },
            {
              min: 1,
              max: 50,
              type: 'string',
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/,
              message: '???????????????1-50????????????????????????????????????',
            },
          ]}
        >
          <Input placeholder="??????????????????" />
        </Item>
        <Item label="?????????" name="serverName" tooltip="?????????????????????????????????">
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="???????????????">
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

export default connect(({ User, Peer, Organization, ElasticServer, loading }: ConnectState) => ({
  User,
  Peer,
  Organization,
  ElasticServer,
  addLoading: loading.effects['Peer/createNode'],
}))(CreateNodeModal);
