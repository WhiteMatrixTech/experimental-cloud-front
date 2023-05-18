import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};
export interface CreateOrgModalProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: (callback?: any) => void;
  addLoading: boolean;
  User: ConnectState['User'];
  Contract: ConnectState['Contract'];
  ElasticServer: ConnectState['ElasticServer'];
}
function CreateOrgModal(props: CreateOrgModalProps) {
  const { dispatch, visible, onCancel, addLoading = false, User } = props;
  const { networkName } = User;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          networkName
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
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="组织名称"
          name="orgName"
          rules={[
            {
              required: true,
              message: '请输入组织名称'
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-z0-9]{4,20}$/,
              message: '组织名必须由4-20位数字英文字母或字符组成'
            }
          ]}>
          <Input placeholder="输入组织名称" />
        </Item>
        <Item
          label="组织别名"
          name="orgNameAlias"
          rules={[
            {
              required: true,
              message: '请输入组织别名'
            }
          ]}>
          <Input placeholder="输入组织别名" />
        </Item>
        <Item
          label="初始化节点名"
          name="initPeerName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入初始化节点名'
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-z0-9]{4,20}$/,
              message: '初始化节点名必须由4-20位数字英文字母或字符组成'
            }
          ]}>
          <Input placeholder="输入初始化节点名" />
        </Item>
        <Item
          label="初始化节点别名"
          name="initPeerDescription"
          rules={[
            {
              required: true,
              message: '请输入初始化节点别名'
            }
          ]}>
          <Input placeholder="输入初始化节点别名" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Organization, ElasticServer, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  Organization,
  ElasticServer,
  addLoading: loading.effects['Organization/createOrg']
}))(CreateOrgModal);
