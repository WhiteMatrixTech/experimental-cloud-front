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

function CreateLeague(props) {
  const { dispatch } = props;

  const { visible, onCancel, addLoading = false } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {
          networkVersion: '1.0.0',
          orgName: values.orgName,
          nodeName: values.peerName,
          nodeAliasName: values.peerAliasName
        };
        dispatch({
          type: 'User/createNetwork',
          payload: params
        })
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
          name="networkName"
          rules={[
            {
              required: true,
              message: '请输入联盟名称',
            },
          ]}
        >
          <Input placeholder="请输入联盟名称" />
        </Item>
        <Item label='联盟描述' name='networkDesc' initialValue='' rules={[
          {
            min: 1,
            max: 100,
            type: 'string',
            message: '联盟描述由0~100个字符组成'
          }
        ]}>
          <TextArea placeholder='请输入联盟描述' />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, loading }) => ({
  User,
  addLoading: loading.effects['User/createNetwork'],
}))(CreateLeague);
