import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Roles } from 'utils/roles.js';

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

function CreateDIDModal(props) {
  const { FabricRole, visible, onCancel, addLoading = false, User, dispatch } = props;
  const { networkName, userRole } = User;
  const { myOrgInfo } = FabricRole;

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getMyOrgInfo',
      payload: { networkName },
    });
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

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '新增DID用户',
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
          label="DID名称"
          name="userId"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入DID名称',
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: 'DID名称由4-20位字母、数字、下划线组成，字母开头',
            },
          ]}
        >
          <Input placeholder="请输入DID名称" />
        </Item>
        <Item
          label="DID类型"
          name="orgName"
          initialValue={userRole === Roles.NetworkAdmin ? null : myOrgInfo.orgName}
          rules={[
            {
              required: true,
              message: '请选择DID类型',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="请选择DID类型"
            disabled={userRole === Roles.NetworkMember}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            <Option key={myOrgInfo.orgName} value={myOrgInfo.orgName}>
              {myOrgInfo.orgName}
            </Option>
          </Select>
        </Item>
        <Item label="角色" name="role" initialValue="">
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
}))(CreateDIDModal);
