import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Roles } from 'utils/roles.js';
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

function CreateDIDModal(props) {
  const { visible, onCancel, record, addLoading = false, User, dispatch } = props;
  const { networkName, userRole } = User;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        form.resetFields();
        let params = {
          ...values,
          networkName,
        };
        let res = null;
        if (record) {
          res = await dispatch({
            type: 'DID/createDID',
            payload: params,
          });
        } else {
          res = await dispatch({
            type: 'DID/modifyDID',
            payload: params,
          });
        }
        if (res) {
          onCancel();
          props.getDidList();
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
    title: record ? '修改DID用户' : '新增DID用户',
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
          name="didName"
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
          name="didType"
          initialValue={null}
          rules={[
            {
              required: true,
              message: '请选择DID类型',
            },
          ]}
        >
          <Select allowClear placeholder="请选择DID类型" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
            {Object.keys(CreateFabricRole).map((key) => (
              <Option key={key} value={CreateFabricRole[key]}>
                {CreateFabricRole[key]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="角色"
          name="role"
          initialValue={null}
          rules={[
            {
              required: true,
              message: '请选择DID用户角色',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="请选择DID用户角色"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {Object.keys(CreateFabricRole).map((key) => (
              <Option key={key} value={CreateFabricRole[key]}>
                {CreateFabricRole[key]}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, DID, Organization, loading }) => ({
  User,
  DID,
  Organization,
  addLoading: loading.effects['DID/createDID'] || loading.effects['DID/modifyDID'],
}))(CreateDIDModal);
