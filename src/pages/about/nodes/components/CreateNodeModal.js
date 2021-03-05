import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';

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

function CreateNodeModal(props) {
  const { Organization, visible, onCancel, addLoading = false, User, dispatch } = props;
  const { networkName } = User;
  const { orgList } = Organization;

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgList',
      payload: { networkName },
    });
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params = {
          networkName,
          orgName: values.orgName,
          peerName: values.peerName,
          peerNameAlias: values.peerNameAlias,
        };
        dispatch({
          type: 'Peer/createNode',
          payload: params,
        }).then((res) => {
          if (res) {
            onCancel();
            props.getNodeList();
          }
        });
        form.setFieldsValue(values);
      })
      .catch((info) => {
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
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={addLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="所属组织"
          name="orgName"
          rules={[
            {
              required: true,
              message: '请选择所属组织',
            },
          ]}
        >
          <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择所属组织">
            {orgList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="节点名称"
          name="peerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入节点名称',
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: '节点名必须由4~20位数字与英文字母组合,英文字母开头',
            },
          ]}
        >
          <Input placeholder="请输入节点名称" />
        </Item>
        <Item
          label="节点别名"
          name="peerNameAlias"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入节点别名',
            },
            {
              min: 1,
              max: 50,
              type: 'string',
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/,
              message: '节点别名由1-50位数字英文字母与汉字组合',
            },
          ]}
        >
          <Input placeholder="请输入节点别名" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Peer, Organization, loading }) => ({
  User,
  Peer,
  Organization,
  addLoading: loading.effects['Peer/createNode'],
}))(CreateNodeModal);