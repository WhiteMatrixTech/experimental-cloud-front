import React, { useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { EStepType } from './index';

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

interface ConfigChannelProps {
  shouldCheck: boolean;
  networkChannelInfo: any;
  failCheck: () => void;
  afterFormCheck: (values: any, step: EStepType) => void;
}

export function ConfigChannel(props: ConfigChannelProps) {
  const { shouldCheck, networkChannelInfo, failCheck, afterFormCheck } = props;

  const [form] = Form.useForm();

  const checkFormValue = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        afterFormCheck(values, EStepType.CONFIG_CHANNEL);
      })
      .catch(() => {
        failCheck();
      });
  }, [afterFormCheck, failCheck, form]);

  useEffect(() => {
    if (shouldCheck) {
      checkFormValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCheck]);

  useEffect(() => {
    form.setFieldsValue(networkChannelInfo);
  }, [networkChannelInfo, form]);

  return (
    <Form {...formItemLayout} form={form}>
      <Item
        label="通道名称"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入通道名称'
          },
          {
            min: 4,
            max: 20,
            type: 'string',
            pattern: /^[a-z0-9]{4,20}$/,
            message: '通道名称由4~20位小写英文或数字组成'
          }
        ]}>
        <Input placeholder="请输入通道名称" />
      </Item>
      <Item
        label="通道描述"
        name="description"
        rules={[
          {
            required: true,
            message: '请输入通道描述'
          }
        ]}>
        <TextArea rows={3} placeholder="请输入通道描述" />
      </Item>
      <Item
        label="共识机制"
        name="consensusMechanism"
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
签名语法：AND, OR和OutOf如 AND('Org1.member', 'Org2.member')表示需要Org1和Org2的同时签名、OR('Org1.member', 'Org2.member')表示需要Org1和Org2中的任何一个组织签名、OutOf(2, 'Org1.member', 'Org2.member', 'Org2.member')表示三个组织中至少有2个签名"
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
      <Item label="打包超时时长" tooltip="设置每个区块最长打包时间, 不设置默认2s">
        <Input.Group compact>
          <Item
            name={['batchTimeout', 'timeout']}
            noStyle
            initialValue={2}
            rules={[{ required: true, message: '请输入打包超时时长' }]}>
            <Input style={{ width: '50%' }} placeholder="时长" />
          </Item>
          <Item name={['batchTimeout', 'unit']} noStyle initialValue="s">
            <Select placeholder="单位">
              <Option value="ms">ms</Option>
              <Option value="s">s</Option>
              <Option value="m">m</Option>
            </Select>
          </Item>
        </Input.Group>
      </Item>
    </Form>
  );
}
