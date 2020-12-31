import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal } from 'antd';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

function CreateUnion({ visible, User, onCancel, dispatch, Organization }) {

  const { orgList } = Organization;
  const { networkName } = User;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      let params = {
        ...values,
        networkName: User.networkName
      };
      const res = await dispatch({
        type: 'Union/createChannel',
        payload: params
      });
      if (res) {
        onCancel(true);
      }
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgList',
      payload: { networkName }
    });
  }, [])

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建通道',
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
        <Item label='通道名称' name='channelId' initialValue='' rules={[
          {
            required: true,
            message: '请输入通道名称',
          },
          {
            min: 3,
            max: 19,
            type: 'string',
            pattern: /^[a-z][a-z0-9]{3,19}$/,
            message: '通道名称必须由4~20位数字与小写英文字母与组合,小写英文字母开头'
          }
        ]}>
          <Input placeholder='请输入通道名称' />
        </Item>
        <Item label='通道别名' name='channelNameAlias' initialValue='' rules={[
          {
            required: true,
            message: '请输入通道别名',
          },
          {
            min: 3,
            max: 19,
            type: 'string',
            pattern: /^([\u4E00-\u9FA5]|[A-Za-z0-9]){1,50}$/,
            message: '通道别名必须由1~50位数字英文字母与汉字组合'
          }
        ]}>
          <Input placeholder='请输入通道别名' />
        </Item>
        <Item label='选择组织' name='peerOrgNames' rules={[
          {
            required: true,
            message: '请选择组织',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择组织' mode='multiple'>
            {orgList.map(item => <Option key={item.orgName} value={item.orgName}>{item.orgName}</Option>)}
          </Select>
        </Item>
        <Item label='通道描述' name='description' initialValue='' rules={[
          {
            min: 0,
            max: 300,
            type: 'string',
            message: '通道描述由0~300个字符组成'
          }
        ]}>
          <TextArea rows={3} placeholder='请输入通道描述' />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ User, Union, Organization, loading }) => ({
  User,
  Union,
  Organization,
  qryLoading: loading.effects['Union/addUnion']
}))(CreateUnion);
