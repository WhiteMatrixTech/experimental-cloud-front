import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import React from 'react';

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

function CreateLeague(props) {
  const { dispatch, visible, onCancel, addLoading = false } = props;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          role: 'networkAdmin',
        };
        const res = await dispatch({
          type: 'User/createLeague',
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
      <Button key="submit" onClick={handleSubmit} type="primary" loading={addLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="联盟名称"
          name="leagueName"
          rules={[
            {
              required: true,
              message: '请输入联盟名称',
            },
          ]}
        >
          <Input placeholder="请输入联盟名称" />
        </Item>
        <Item
          label="网络名称"
          name="networkName"
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
          <Input placeholder="请输入网络名称" />
        </Item>
        <Item
          label="联盟描述"
          name="description"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入联盟描述',
            },
            {
              min: 1,
              max: 100,
              type: 'string',
              message: '联盟描述由1~100个字符组成',
            },
          ]}
        >
          <TextArea placeholder="请输入联盟描述" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, loading }) => ({
  User,
  addLoading: loading.effects['User/createLeague'],
}))(CreateLeague);
