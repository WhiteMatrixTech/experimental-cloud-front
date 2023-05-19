import { ConnectState } from '~/models/connect';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import { CreateFabricRole } from '../_config';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export interface CreateFabricUserModalProps {
  FabricRole: ConnectState['FabricRole'];
  Organization: ConnectState['Organization'];
  visible: boolean;
  onCancel: () => void;
  addLoading: boolean;
  User: ConnectState['User'];
  dispatch: Dispatch;
  getFabricRoleList: () => void;
}
function CreateFabricUserModal(props: CreateFabricUserModalProps) {
  const { visible, onCancel, addLoading = false, User, dispatch } = props;
  const { networkName } = User;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params = {
          ...values,
          networkName
        };
        dispatch({
          type: 'FabricRole/createFabricRole',
          payload: params
        }).then((res: any) => {
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
    title: '新增Fabric角色',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={addLoading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form form={form}>
        <Item
          label="Fabric角色名"
          name="userName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入Fabric角色名'
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: 'Fabric角色名由4-20位字母、数字、下划线组成，字母开头'
            }
          ]}>
          <Input placeholder="请输入Fabric角色名" />
        </Item>
        <Item
          label="密码"
          name="userSecret"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入密码'
            },
            {
              min: 6,
              max: 18,
              message: '密码长度为6-18位'
            }
          ]}>
          <Input.Password placeholder="请输入密码" />
        </Item>
        <Item
          label="角色类型"
          name="fabricRole"
          rules={[
            {
              required: true,
              message: '请选择角色类型'
            }
          ]}>
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择角色类型">
            {Object.keys(CreateFabricRole).map((role) => (
              <Option key={role} value={CreateFabricRole[role]}>
                {CreateFabricRole[role]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="属性集" name="attrs" initialValue="">
          <TextArea placeholder="请输入属性集" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, FabricRole, Organization, loading }: ConnectState) => ({
  User,
  FabricRole,
  Organization,
  addLoading: loading.effects['FabricRole/createFabricRole']
}))(CreateFabricUserModal);
