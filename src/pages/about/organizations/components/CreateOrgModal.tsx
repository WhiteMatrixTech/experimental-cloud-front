import React, { useEffect, useMemo } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';
import { serverPurpose } from '~/pages/common/elastic-cloud-server/_config';

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
    title: '创建组织',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={addLoading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="所属通道"
          name="channelId"
          rules={[
            {
              required: true,
              message: '请选择通道'
            }
          ]}>
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="选择通道">
            {channelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="组织名称"
          name="orgName"
          rules={[
            {
              required: true,
              message: '请输入组织名称'
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: '组织名必须由4-20位数字英文字母或字符组成'
            }
          ]}>
          <Input placeholder="输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="orgNameAlias"
          rules={[
            {
              required: true,
              message: '请输入组织别名'
            }
          ]}>
          <Input placeholder="输入组织别名" />
        </Item>
        <Item
          label="初始化节点名"
          name="initPeerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入初始化节点名'
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: '初始化节点名必须由4-20位数字英文字母或字符组成'
            }
          ]}>
          <Input placeholder="输入初始化节点名" />
        </Item>
        <Item
          label="初始化节点别名"
          name="initPeerAliasName"
          rules={[
            {
              required: true,
              message: '请输入初始化节点别名'
            }
          ]}>
          <Input placeholder="输入初始化节点别名" />
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

export default connect(({ User, Organization, ElasticServer, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  Organization,
  ElasticServer,
  addLoading: loading.effects['Organization/createOrg']
}))(CreateOrgModal);
