import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Form, Select, Button, Modal } from 'antd';

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

function CreatePeerOrg(props) {

  const { dispatch, visible, onCancel, addLoading = false, User, Contract } = props;
  const { networkName } = User;
  const { channelList } = Contract;
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName },
    });
  }, [])

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          networkName,
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
        <Item label='所属通道' name='channelId' rules={[
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
        <Item
          label="组织名称"
          name="orgName"
          rules={[
            {
              required: true,
              message: '请输入组织名称',
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: '组织名必须由4-20位数字英文字母或字符\\ - _ 组成'
            }
          ]}
        >
          <Input placeholder="请输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="orgNameAlias"
          rules={[
            {
              required: true,
              message: '请输入组织别名',
            },
          ]}
        >
          <Input placeholder="请输入组织别名" />
        </Item>
        <Item label='初始化节点名' name='initPeerName' initialValue='' rules={[
          {
            required: true,
            message: '请输入初始化节点名',
          },
          {
            min: 4,
            max: 20,
            type: 'string',
            pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
            message: '初始化节点名必须由4-20位数字英文字母或字符\\ - _ 组成'
          }
        ]}>
          <Input placeholder='请输入初始化节点名' />
        </Item>
        <Item
          label="初始化节点别名"
          name="initPeerAliasName"
          rules={[
            {
              required: true,
              message: '请输入初始化节点别名',
            },
          ]}
        >
          <Input placeholder="请输入初始化节点别名" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Organization, Contract, loading }) => ({
  User,
  Organization,
  Contract,
  addLoading: loading.effects['Organization/createPeerOrg'],
}))(CreatePeerOrg);
