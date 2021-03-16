import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { CreateFabricRole } from '../_config';

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

function CreateFabricUserModal(props) {
  const { FabricRole, visible, onCancel, addLoading = false, User, dispatch } = props;
  const { networkName } = User;
  const { myOrgInfo } = FabricRole;

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getMyOrgInfo',
      payload: { networkName },
    });
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params = {
          ...values,
          networkName,
        };
        dispatch({
          type: 'FabricRole/createFabricRole',
          payload: params,
        }).then((res) => {
          if (res) {
            onCancel();
            props.getFabricRoleList();
          }
        });
        form.setFieldsValue(values);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('pass')) {
      return promise.reject('两次输入的密码不匹配');
    }

    return promise.resolve();
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '新增Fabric用户',
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
          label="用户名"
          name="userId"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: '用户名由4-20位字母、数字、下划线组成，字母开头',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Item>
        <Item
          label="密码"
          name="pass"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              min: 6,
              max: 18,
              message: '密码长度为6-18位',
            },
          ]}
        >
          <Input type="password" placeholder="请输入密码" />
        </Item>
        <Item
          name="re_pass"
          label="确认密码"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请确认密码!',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input type="password" placeholder="请确认密码" />
        </Item>
        <Item
          label="账户类型"
          name="fabricRole"
          rules={[
            {
              required: true,
              message: '请选择账户类型',
            },
          ]}
        >
          <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择账户类型">
            {Object.keys(CreateFabricRole).map((role) => (
              <Option key={role} value={CreateFabricRole[role]}>
                {CreateFabricRole[role]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="所属组织"
          name="orgName"
          initialValue={myOrgInfo.orgName}
          rules={[
            {
              required: true,
              message: '请选择所属组织',
            },
          ]}
        >
          <Select disabled getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择所属组织">
            <Option key={myOrgInfo.orgName} value={myOrgInfo.orgName}>
              {myOrgInfo.orgName}
            </Option>
          </Select>
        </Item>
        <Item label="属性集" name="attrs" initialValue="">
          <TextArea placeholder="请输入属性集" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, FabricRole, loading }) => ({
  User,
  FabricRole,
  addLoading: loading.effects['FabricRole/createFabricRole'],
}))(CreateFabricUserModal);
