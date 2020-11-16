import React from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal } from 'antd';

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

function CreatePeer(props) {
  const { visible, onCancel, addLoading = false } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields()
      let params = values
      form.setFieldsValue(values)

    }).catch(info => {
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
      <Button key='cancel' onClick={onCancel}>
        取消
      </Button>,
      <Button key='submit' onClick={handleSubmit} type="primary" loading={addLoading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label='所属组织' name='orgIdName' initialValue={null} rules={[
          {
            required: true,
            message: '请选择所属组织',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择所属组织'>
            <Option value='aaa'>aaa</Option>
          </Select>
        </Item>
        <Item label='节点名称' name='peerName' initialValue='' rules={[
          {
            required: true,
            message: '请输入节点名称',
          },
          {
            min: 4,
            max: 20,
            type: 'string',
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{4,20}$/,
            message: '节点名必须由4~20位数字与英文字母组合,英文字母开头'
          }
        ]}>
          <Input placeholder='请输入节点名称' />
        </Item>
        <Item label='节点别名' name='peerAliasName' initialValue='' rules={[
          {
            required: true,
            message: '请输入节点别名',
          },
          {
            min: 1,
            max: 50,
            type: 'string',
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/,
            message: '节点别名由1-50位数字英文字母与汉字组合'
          }
        ]}>
          <Input placeholder='请输入节点别名' />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ PeerManage, loading }) => ({
  PeerManage,
  addLoading: loading.effects['PeerManage/createAndUpdateStrategy']
}))(CreatePeer);
