import React from 'react';
import { connect } from 'dva';
import { Input, Form, Button, Modal } from 'antd';

const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

function CreatePeerOrg(props) {

  const { dispatch, visible, onCancel, addLoading = false, User } = props;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          networkName: User.networkName,
        };
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
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="组织名称"
          name="orgName"
          rules={[
            {
              required: true,
              message: '请输入组织名称',
            },
          ]}
        >
          <Input placeholder="请输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="orgAliasName"
          rules={[
            {
              required: true,
              message: '请输入组织别名',
            },
          ]}
        >
          <Input placeholder="请输入组织别名" />
        </Item>
        <Item label='组织地址' name='orgAddress' initialValue='' rules={[
          {
            required: true,
            message: '请输入组织地址',
          }
        ]}>
          <TextArea placeholder='请输入组织地址' />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Organization, loading }) => ({
  User,
  Organization,
  addLoading: loading.effects['Organization/createPeerOrg'],
}))(CreatePeerOrg);
