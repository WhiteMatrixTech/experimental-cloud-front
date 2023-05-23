import { Form, Input, InputNumber, Modal } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 9 }
  },
  wrapperCol: {
    sm: { span: 15 }
  }
};

interface IConfigCA {
  visible: boolean;
  onCancel: () => void;
  Dashboard: ConnectState['Dashboard'];
  User: ConnectState['User'];
  configCALoading: boolean;
  dispatch: Dispatch;
}
function ConfigCA({ visible, onCancel, Dashboard, User, configCALoading, dispatch }: IConfigCA) {
  const [form] = Form.useForm();
  const { networkName } = User;
  const oldCA = Dashboard.networkStatusInfo?.caCertExpiryTime;
  const drawerProps = {
    width: 600,
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建网络',
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { loading: configCALoading },
    onCancel: () => onCancel(),
    onOk: () => {
      form.validateFields().then(async () => {
        // 执行修改
        const res = await dispatch({
          type: 'Dashboard/configCA',
          payload: { caCertExpiryTime: `${form.getFieldValue('caCertExpiryTime')}h`, networkName: networkName }
        });
        if (res) {
          dispatch({
            type: 'Dashboard/getNetworkInfo',
            payload: {
              networkName: networkName
            }
          });
          onCancel();
        }
      });
    }
  };
  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label="当前CA证书过期时间" name="currentCAExpireTime" initialValue={oldCA || ''}>
          <Input placeholder="未设置" disabled={true} />
        </Item>
        <Item
          label="新的CA证书过期时间"
          tooltip="小时"
          name="caCertExpiryTime"
          initialValue={131400}
          rules={[
            {
              required: true,
              message: '请输入CA证书过期时间'
            }
          ]}>
          <Input type="number" suffix="h" style={{ width: '100%' }} placeholder="请输入新的CA证书过期时间" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Dashboard, loading, User }: ConnectState) => ({
  Dashboard,
  User,
  configCALoading: loading.effects['Dashboard/configCA']
}))(ConfigCA);
