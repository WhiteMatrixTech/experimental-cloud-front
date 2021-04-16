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
          companyName: values.companyName,
          additionalAttr: values.additionalAttr,
          role: values.role,
          networkName,
        };
        let res = null;
        if (record) {
          res = await dispatch({
            type: 'DID/modifyDID',
            payload: params,
          });
        } else {
          res = await dispatch({
            type: 'DID/createDID',
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

  const checkJSON = (_, value) => {
    const promise = Promise; // 没有值的情况

    // if (!value) {
    //   return promise.reject('请输入附加信息');
    // } // 有值的情况

    try {
      const json = JSON.parse(value);
    } catch (e) {
      return promise.reject('请输入json');
    }
    return promise.resolve();
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
          initialValue={record ? record.didName : ''}
          rules={[
            {
              required: true,
              message: '请输入DID名称',
            },
          ]}
        >
          <Input placeholder="请输入DID名称" />
        </Item>
        <Item
          label="角色"
          name="role"
          initialValue={record ? record.role : null}
          rules={[
            {
              required: true,
              message: '请输入DID用户角色',
            },
          ]}
        >
          <Input placeholder="请输入DID用户角色" />
        </Item>
        <Item
          label="附加信息"
          name="additionalAttr"
          initialValue={record ? record.additionalAttributes : ''}
          tooltip="其他详细信息，例如公司的地址、联系人等; 以JSON格式录入"
          rules={[
            {
              validateTrigger: 'submit',
              validator: checkJSON,
            },
          ]}
        >
          <TextArea placeholder="请输入JSON格式的附加信息" />
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
