import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Switch, Button, Modal } from 'antd';

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


function InvokeContract(props) {

  const [form] = Form.useForm();
  const { visible, editParams, onCancel, dispatch, Contract, User } = props;
  const { channelList } = Contract;
  const { networkName } = User;

  const handleSubmit = () => {
    form.validateFields().then(values => {
      values.networkName = networkName;
      dispatch({
        type: 'Contract/addContract',
        payload: values
      }).then(res => {
        if (res) {
          onCancel();
        }
      })
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName },
    });
  }, [])

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '调用合约',
    onCancel: onCancel,
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
        <Item label='所属通道' name='channelId' initialValue={editParams.channelId} rules={[
          {
            required: true,
            message: '请选择通道',
          },
        ]}>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择通道'
          >
            {channelList.map(item => <Option key={item.channelId} value={item.channelId}>{item.channelId}</Option>)}
          </Select>
        </Item>
        <Item label='合约名称' name='chainCodeName' initialValue={editParams.chainCodeName}>
          <Input placeholder='请输入合约名称' disabled />
        </Item>
        <Item label='方法名' name='methodName' initialValue='' rules={[
          {
            required: true,
            message: '请输入方法名',
          }
        ]}>
          <Input placeholder='请输入方法名' />
        </Item>
        <Item label='参数列表' name='paramString' initialValue='' rules={[
          {
            required: true,
            message: '请输入参数列表',
          }
        ]}>
          <TextArea placeholder='请输入参数列表' />
        </Item>
        <Item label='是否初始化' name='isInit' initialValue={true} valuePropName='checked' rules={[
          {
            required: true,
            message: '请选择是否需要初始化',
          }
        ]}>
          <Switch disabled />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Contract, User, loading }) => ({
  Contract,
  User,
  qryLoading: loading.effects['Contract/addContract']
}))(InvokeContract);
