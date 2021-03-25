import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';

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

function CreateNetworkModal(props) {
  const { dispatch, visible, onCancel, createLoading = false, User, ElasticServer } = props;
  const { serverList } = ElasticServer;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { serverName, ...rest } = values;
        let params = { ...rest };
        if (values.serverName) {
          params.serverName = values.serverName;
        }
        const res = await dispatch({
          type: 'Dashboard/createNetwork',
          payload: params,
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
    const params = {
      limit: 100,
      offset: 0,
      ascend: false,
    };
    dispatch({
      type: 'ElasticServer/getServerList',
      payload: params,
    });
  }, []);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建网络',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={createLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="网络名称"
          name="networkName"
          initialValue={User.networkName}
          rules={[
            {
              required: true,
              message: '请输入网络名称',
            },
            {
              min: 6,
              max: 15,
              type: 'string',
              pattern: /^[a-zA-Z0-9]+$/,
              message: '网络名称由6~15位英文字母组成',
            },
          ]}
        >
          <Input disabled placeholder="请输入网络名称" />
        </Item>
        <Item
          label="组织名称"
          name="initOrgName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入组织名称',
            },
            {
              min: 3,
              max: 15,
              type: 'string',
              pattern: /^[a-zA-Z0-9]+$/,
              message: '组织名称由3~15位英文或数字组成',
            },
          ]}
        >
          <Input placeholder="请输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="initOrgAliasName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入组织别名',
            },
          ]}
        >
          <Input placeholder="请输入组织别名" />
        </Item>
        <Item
          label="节点名称"
          name="initPeerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入节点名称',
            },
            {
              min: 3,
              max: 15,
              type: 'string',
              pattern: /^[a-zA-Z0-9]+$/,
              message: '节点名称由3~15位英文或数字组成',
            },
          ]}
        >
          <Input placeholder="请输入节点名称" />
        </Item>
        <Item
          label="节点别名"
          name="initPeerAliasName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入节点别名',
            },
          ]}
        >
          <Input placeholder="请输入节点别名" />
        </Item>
        <Item label="服务器" name="serverName" tooltip="不选择则使用默认服务器">
          <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="选择服务器">
            {serverList.map((item) => (
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

export default connect(({ User, Dashboard, ElasticServer, loading }) => ({
  User,
  Dashboard,
  ElasticServer,
  createLoading: loading.effects['Dashboard/createNetwork'],
}))(CreateNetworkModal);
