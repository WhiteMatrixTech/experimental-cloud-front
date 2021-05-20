import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Select, Input } from 'antd';
import { Dispatch, EnterpriseMemberSchema } from 'umi';
import { ConnectState } from '@/models/connect';

const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
export interface ConfigMemberRoleProps {
  visible: boolean;
  onCancel: () => void;
  dispatch: Dispatch;
  RBAC: ConnectState['RBAC'];
  Member: ConnectState['Member'];
  User: ConnectState['User'];
  record: EnterpriseMemberSchema | null;
  setLoading: boolean;
}
function ConfigMemberRole(props: ConfigMemberRoleProps) {
  const { visible, onCancel, dispatch, RBAC, Member, User, record, setLoading = false } = props;
  const { networkName } = User;
  const { memberRole } = Member;

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'RBAC/getRoleNameList',
      payload: { networkName },
    });
    dispatch({
      type: 'Member/getMemberRole',
      payload: { networkName, companyName: record?.companyName },
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ companyName: record?.companyName, roleName: memberRole });
  }, [memberRole]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await dispatch({
          type: 'Member/setRoleToMember',
          payload: {
            ...values,
            networkName,
          },
        });
        if (res) {
          onCancel();
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
    title: '配置访问权限',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={setLoading} onClick={handleSubmit} type="primary">
        配置
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Form.Item label="用户名" name="companyName" initialValue={record?.companyName}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="访问角色"
          name="roleName"
          rules={[
            {
              required: true,
              message: '请选择访问角色',
            },
          ]}
        >
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择访问角色">
            {RBAC.roleNameList.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Contract, User, RBAC, Member, loading }: ConnectState) => ({
  Contract,
  User,
  RBAC,
  Member,
  setLoading: loading.effects['Member/setRoleToMember'],
}))(ConfigMemberRole);
