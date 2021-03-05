import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { FabricRole } from '../_config';

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
          userName: values.userName,
          password: values.password,
          fabricRole: values.fabricRole,
          orgName: values.orgName,
          propertyList: values.propertyList,
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

    if (value && value !== form.getFieldValue('password')) {
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
          name="userName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Item>
        <Item
          label="密码"
          name="password"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input type="password" placeholder="请输入密码" />
        </Item>
        <Item
          name="confirm"
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
            {Object.keys(FabricRole).map((role) => (
              <Option key={role} value={FabricRole[role]}>
                {FabricRole[role]}
              </Option>
            ))}
          </Select>
        </Item>
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
          label="属性集"
          name="propertyList"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入属性集',
            },
          ]}
        >
          <TextArea placeholder="请输入属性集" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, FabricRole, Organization, loading }) => ({
  User,
  FabricRole,
  Organization,
  addLoading: loading.effects['FabricRole/createFabricRole'],
}))(CreateFabricUserModal);
