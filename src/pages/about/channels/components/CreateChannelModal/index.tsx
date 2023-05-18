import { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal } from 'antd';
import { ConnectState } from '~/models/connect';
import { Dispatch } from 'umi';

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
export interface CreateChannelModalProps {
  visible: boolean;
  User: ConnectState['User'];
  onCancel: any;
  dispatch: Dispatch;
  addLoading: boolean;
  Organization: ConnectState['Organization'];
}
function CreateChannelModal({ visible, User, onCancel, dispatch, addLoading, Organization }: CreateChannelModalProps) {
  const { orgInUseList } = Organization;
  const { networkName } = User;
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          ...values,
          networkName: User.networkName,
        };
        const res = await dispatch({
          type: 'Channel/createChannel',
          payload: params,
        });
        if (res) {
          onCancel(true);
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  useEffect(() => {
    dispatch({
      type: 'Organization/getOrgInUseList',
      payload: { networkName },
    });
  }, [dispatch, networkName]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建通道',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={addLoading} onClick={handleSubmit} type="primary">
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="通道名称"
          name="channelName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入通道名称',
            },
            {
              min: 4,
              max: 20,
              type: 'string',
              pattern: /^[a-z0-9-]{4,20}$/,
              message: '通道名称必须由4-20位的小写字母或数字组成, 字母开头',
            },
          ]}
        >
          <Input placeholder="请输入通道名称" />
        </Item>
        <Item
          label="通道别名"
          name="channelNameAlias"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入通道别名',
            },
            {
              min: 3,
              max: 19,
              type: 'string',
              pattern: /^([\u4E00-\u9FA5]|[A-Za-z0-9]){1,50}$/,
              message: '通道别名必须由1~50位数字英文字母与汉字组合',
            },
          ]}
        >
          <Input placeholder="请输入通道别名" />
        </Item>
        <Item
          label="选择组织"
          name="peerOrgNames"
          rules={[
            {
              required: true,
              message: '请选择组织',
            },
          ]}
        >
          <Select
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder="请选择组织"
            mode="multiple"
          >
            {orgInUseList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="通道描述"
          name="description"
          initialValue=""
          rules={[
            {
              min: 0,
              max: 300,
              type: 'string',
              message: '通道描述由0~300个字符组成',
            },
          ]}
        >
          <TextArea rows={3} placeholder="请输入通道描述" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, Channel, Organization, loading }: ConnectState) => ({
  User,
  Channel,
  Organization,
  addLoading: loading.effects['Channel/createChannel'],
}))(CreateChannelModal);
