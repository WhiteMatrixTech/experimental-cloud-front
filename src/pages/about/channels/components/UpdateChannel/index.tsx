import { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal, InputNumber } from 'antd';
import { ConnectState } from '~/models/connect';
import { ChannelSchema, Dispatch } from 'umi';
import cloneDeep from 'lodash/cloneDeep';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

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
    const initValues = cloneDeep(record);
    if (initValues) {
      const result = parseTime(initValues.batchTimeout);
      if (result) {
        initValues.batchTimeout = {
          timeout: result[0].toString(),
          unit: result[1]
        } as any;
      }
    }
    form.setFieldsValue(record);
  }, [form, record]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { batchTimeout, consensus, ...rest } = values;
        let params = {
          ...rest,
          consensusMechanism: consensus,
          batchTimeout: `${batchTimeout.timeout}${batchTimeout.unit}`,
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
    title: '配置详情',
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
          label="共识机制"
          name="consensus"
          tooltip="一般默认选择Etcdraft, Solo模式只适合测试网络, 不建议正式环境使用"
          rules={[
            {
              required: true,
              message: '请选择共识机制'
            }
          ]}>
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择共识机制">
            <Option value="etcdraft">Etcdraft</Option>
            <Option value="solo">Solo</Option>
          </Select>
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
        <Item
          label="区块最大交易数"
          name="maxMessageCount"
          tooltip="设置每个区块的最大交易数量, 最大值为500"
          rules={[
            {
              required: true,
              message: '请输入区块最大交易数'
            }
          ]}>
          <InputNumber step={1} min={1} max={500} style={{ width: '100%' }} placeholder="请输入区块最大交易数" />
        </Item>
        <Item label="打包超时时长" tooltip="设置每个区块最长打包时间">
          <Input.Group compact>
            <Item
              name={['batchTimeout', 'timeout']}
              noStyle
              rules={[{ required: true, message: '请输入打包超时时长' }]}>
              <Input style={{ width: '50%' }} placeholder="时长" />
            </Item>
            <Item name={['batchTimeout', 'unit']} noStyle>
              <Select placeholder="单位">
                <Option value="ms">ms</Option>
                <Option value="s">s</Option>
                <Option value="m">m</Option>
              </Select>
            </Item>
          </Input.Group>
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

function parseTime(str: string | null): [number, string] | null {
  if (!str) return null;
  const match = str.match(/(\d+)(\w+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    const unit = match[2];
    return [num, unit];
  } else {
    return null;
  }
}
