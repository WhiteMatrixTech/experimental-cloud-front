import { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Form, Button, Modal } from 'antd';
import { ConnectState } from '~/models/connect';
import { ChannelSchema, Dispatch } from 'umi';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};
export interface CreateChannelModalProps {
  visible: boolean;
  User: ConnectState['User'];
  onCancel: any;
  dispatch: Dispatch;
  loading: boolean;
  record: ChannelSchema | null;
}
function UpdateChannel({ visible, User, onCancel, dispatch, loading, record }: CreateChannelModalProps) {
  const { networkName } = User;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(record);
  }, [form, record]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { endorsementPolicy } = values;
        let params = {
          endorsementPolicy,
          networkName,
          channelId: record?.name || ''
        };
        const res = await dispatch({
          type: 'Channel/updateChannel',
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
    title: '背书策略配置',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={loading} onClick={handleSubmit} type="primary">
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label="通道名称" name="name">
          <Input disabled={true} />
        </Item>
        <Item
          label="背书策略"
          name="endorsementPolicy"
          tooltip="fabric中策略的写法：
签名语法：AND, OR和OutOf如 AND('Org1MSP.admin', 'Org2MSP.admin')表示需要Org1和Org2的同时签名、OR('Org1MSP.admin', 'Org2MSP.admin')表示需要Org1和Org2中的任何一个组织签名、OutOf(2, 'Org1MSP.admin', 'Org2MSP.admin', 'Org2MSP.admin')表示三个组织中至少有2个签名"
          rules={[
            {
              required: true,
              message: '请输入背书策略'
            }
          ]}>
          <Input placeholder="请输入背书策略" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Channel, loading }: ConnectState) => ({
  User,
  Channel,
  loading: loading.effects['Channel/updateChannel']
}))(UpdateChannel);
