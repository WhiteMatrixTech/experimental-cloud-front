import React from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { serverPurpose } from '../_config';

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

function CreateServerModal(props) {
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
            payload: params,
          });
        } else {
          apiProgress = await dispatch({
            type: 'ElasticServer/createServer',
            payload: params,
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
    title: record ? '修改服务器信息' : '创建服务器',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={submitLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="服务器名称"
          name="serverName"
          initialValue={(record && record.serverName) || ''}
          rules={[
            {
              required: true,
              message: '请输入服务器名称',
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: '服务器名称由4-20位字母、数字、下划线组成，小写字母开头',
            },
          ]}
        >
          <Input disabled={!!(record && record.serverName)} placeholder="请输入服务器名称" />
        </Item>
        <Item
          label="用户名"
          name="username"
          initialValue={(record && record.username) || ''}
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Item>
        <Item
          label="用途类型"
          name="serverPurpose"
          initialValue={(record && record.serverPurpose) || null}
          rules={[
            {
              required: true,
              message: '请选择用途类型',
            },
          ]}
        >
          <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择用途类型">
            {Object.keys(serverPurpose).map((type) => (
              <Option key={serverPurpose[type]} value={serverPurpose[type]}>
                {serverPurpose[type]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="外网IP"
          name="publicIp"
          initialValue={(record && record.publicIp) || ''}
          rules={[
            {
              required: true,
              message: '请输入外网IP',
            },
          ]}
        >
          <Input placeholder="请输入外网IP" />
        </Item>
        <Item
          label="内网IP"
          name="privateIp"
          initialValue={(record && record.privateIp) || ''}
          rules={[
            {
              required: true,
              message: '请输入内网IP',
            },
          ]}
        >
          <Input placeholder="请输入内网IP" />
        </Item>
        <Item
          label="SSH公钥"
          name="publicKey"
          initialValue={(record && record.publicKey) || ''}
          rules={[
            {
              required: true,
              message: '请输入SSH公钥',
            },
          ]}
        >
          <Input placeholder="请输入SSH公钥" />
        </Item>
        <Item
          label="SSH私钥"
          name="privateKey"
          initialValue={(record && record.privateKey) || ''}
          rules={[
            {
              required: true,
              message: '请输入SSH私钥',
            },
          ]}
        >
          <Input placeholder="请输入SSH私钥" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, ElasticServer, loading }) => ({
  User,
  ElasticServer,
  submitLoading: loading.effects['ElasticServer/createServer'] || loading.effects['ElasticServer/modifyServer'],
}))(CreateServerModal);
