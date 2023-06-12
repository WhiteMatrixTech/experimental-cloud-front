import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
const { Item } = Form;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 9 }
  },
  wrapperCol: {
    sm: { span: 15 }
  }
};

interface IConfigNetwork {
  visible: boolean;
  onCancel: () => void;
  Dashboard: ConnectState['Dashboard'];
  User: ConnectState['User'];
  configNetworkLoading: boolean;
  dispatch: Dispatch;
}
function ConfigNetwork({ visible, onCancel, Dashboard, User, configNetworkLoading, dispatch }: IConfigNetwork) {
  const [form] = Form.useForm();
  const { networkName } = User;
  const drawerProps = {
    width: 600,
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '配置网络',
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { loading: configNetworkLoading },
    onCancel: () => onCancel(),
    onOk: () => {
      form.validateFields().then(async (values) => {
        // 执行修改
        const { caCertExpiryTime, maxMessageCount, batchTimeout } = values;
        const res = await dispatch({
          type: 'Dashboard/configNetwork',
          payload: {
            caCertExpiryTime:`${caCertExpiryTime}h`,
            networkName: networkName,
            maxMessageCount,
            batchTimeout: `${batchTimeout.timeout}${batchTimeout.unit}`
          }
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

  useEffect(() => {
    const initValues = cloneDeep(Dashboard?.networkStatusInfo);
    if (initValues) {
      const batchTimeoutResult = parseTime(initValues?.batchTimeout);
      if (batchTimeoutResult) {
        initValues.batchTimeout = {
          timeout: batchTimeoutResult[0].toString(),
          unit: batchTimeoutResult[1]
        } as any;
      }
      if (initValues.caCertExpiryTime) {
        initValues.caCertExpiryTime = parseTime(initValues.caCertExpiryTime)?.[0] || (0 as any);
      }
    }
    form.setFieldsValue(initValues);
  }, [Dashboard?.networkStatusInfo, form]);

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        {/* <Item label="当前CA证书过期时间" name="currentCAExpireTime" initialValue={oldCA || ''}>
          <Input placeholder="未设置" disabled={true} />
        </Item> */}
        <Item
          label="CA证书过期时间"
          tooltip="小时"
          name="caCertExpiryTime"
          rules={[
            {
              required: true,
              message: '请输入CA证书过期时间'
            }
          ]}>
          <Input type="number" suffix="h" style={{ width: '100%' }} placeholder="请输入CA证书过期时间" />
        </Item>
        {/* <Item
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
        </Item> */}
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

export default connect(({ Dashboard, loading, User }: ConnectState) => ({
  Dashboard,
  User,
  configNetworkLoading: loading.effects['Dashboard/configNetwork']
}))(ConfigNetwork);

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
