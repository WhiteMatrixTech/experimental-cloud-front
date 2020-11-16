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

function DeployContract({ visible, record, onCancel, dispatch }) {

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields();
      form.setFieldsValue(values)

    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '智能合约部署',
    onCancel: () => onCancel(),
    footer: [
      <Button key='cancel' onClick={onCancel}>
        取消
      </Button>,
      <Button key='submit' onClick={handleSubmit} type="primary">
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label='模板合约名称' name='templateChainCodeName' initialValue={record.chainCodeName}>
          <Input disabled />
        </Item>
        <Item label='所属通道' name='channelId' initialValue={null} rules={[
          {
            required: true,
            message: '请选择通道',
          },
        ]}>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择通道'
          >
            <Option value='aaa'>aaa</Option>
          </Select>
        </Item>
        <Item label='合约名称' name='chainCodeName' initialValue='' rules={[
          {
            required: true,
            message: '请输入合约名称',
          },
          {
            min: 4,
            max: 20,
            type: 'string',
            pattern: /^[A-z][A-z0-9]{3,19}$/,
            message: '合约名必须由4~20位数字与英文字母组合,英文字母开头'
          }
        ]}>
          <Input placeholder='请输入合约名称' />
        </Item>
        <Item label='合约版本' name='chainCodeVersion' initialValue='' rules={[
          {
            required: true,
            message: '请输入合约版本',
          },
          {
            type: 'string',
            pattern: /^\d+(\.\d+)*$/,
            message: '合约版本必须由数字或点组成,且首字符为数字'
          }
        ]}>
          <Input placeholder='请输入合约版本' />
        </Item>
        <Item label='初始化参数列表' name='initArgs' initialValue='' rules={[
          {
            required: true,
            message: '请输入初始化参数',
          },
          {
            min: 1,
            max: 1000,
            type: 'string',
            message: '参数由1~1000位组成'
          }
        ]}>
          <Input placeholder='请输入初始化参数' />
        </Item>
        <Item label='背书组织' name='policies' initialValue={null} rules={[
          {
            required: true,
            message: '请选择背书组织',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择背书组织' >

            <Option value='aaa'>aaa</Option>
          </Select>
        </Item>
        <Item label='背书关系'><Input disabled value='1' /></Item>
        <Item label='合约描述' name='chainCodeDesc' initialValue='' rules={[
          {
            min: 1,
            max: 100,
            type: 'string',
            message: '合约描述由0~100个字符组成'
          }
        ]}>
          <Input placeholder='请输入合约描述' />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Contract, loading }) => ({
  Contract,
  qryLoading: loading.effects['Contract/deployContract']
}))(DeployContract);
