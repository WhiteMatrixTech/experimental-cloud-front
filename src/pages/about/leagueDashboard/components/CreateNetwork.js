import React from 'react';
import { connect } from 'dva';
import { Input, Form, Button, Modal } from 'antd';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

function CreateNetwork(props) {

  const { dispatch, visible, onCancel, createLoading = false, User } = props;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
        };
        const res = await dispatch({
          type: 'Dashboard/createNetwork',
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
    title: '创建联盟',
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
              pattern: /^[a-zA-Z]+$/,
              message: '网络名称由6~15位英文字母组成'
            }
          ]}
        >
          <Input disabled placeholder="请输入网络名称" />
        </Item>
        <Item
          label="组织名称"
          name="initOrgName"
          initialValue=''
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
              message: '组织名称由3~15位英文或数字组成'
            }
          ]}
        >
          <Input placeholder="请输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="initOrgAliasName"
          initialValue=''
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
          initialValue=''
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
              message: '节点名称由3~15位英文或数字组成'
            }
          ]}
        >
          <Input placeholder="请输入节点名称" />
        </Item>
        <Item
          label="节点别名"
          name="initPeerAliasName"
          initialValue=''
          rules={[
            {
              required: true,
              message: '请输入节点别名',
            },
          ]}
        >
          <Input placeholder="请输入节点别名" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Dashboard, loading }) => ({
  User,
  Dashboard,
  createLoading: loading.effects['Dashboard/createNetwork'],
}))(CreateNetwork);
