import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useMemo } from 'react';
import { serverPurpose } from '@/pages/common/elastic-cloud-server/_config';
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
  }, []);

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
        console.log('校验失败:', info);
      });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建节点',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={addLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="所属组织"
          name="orgName"
          rules={[
            {
              required: true,
              message: '请选择所属组织',
            },
          ]}
        >
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="选择所属组织">
            {orgInUseList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="节点名称"
          name="peerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入节点名称',
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: '节点名必须由4~20位数字与英文字母组合,英文字母开头',
            },
          ]}
        >
          <Input placeholder="输入节点名称" />
        </Item>
        <Item
          label="节点别名"
          name="peerNameAlias"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入节点别名',
            },
            {
              min: 1,
              max: 50,
              type: 'string',
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/,
              message: '节点别名由1-50位数字英文字母与汉字组合',
            },
          ]}
        >
          <Input placeholder="输入节点别名" />
        </Item>
        <Item label="服务器" name="serverName" tooltip="不选择则使用默认服务器">
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="选择服务器">
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
