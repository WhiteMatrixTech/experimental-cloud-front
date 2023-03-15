import React, { useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, Radio, Select } from 'antd';
import { EStepType } from './index';
import { ConnectState } from '~/models/connect';
import { connect } from 'umi';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

interface ConfigNetworkProps {
  shouldCheck: boolean;
  networkBaseInfo: any;
  configMode: 'default' | 'custom';
  Cluster: ConnectState['Cluster'];
  setConfigMode: (mode: 'default' | 'custom') => void;
  afterFormCheck: (values: any, step: EStepType, isDefaultMode?: boolean) => void;
}

export function ConfigNetwork(props: ConfigNetworkProps) {
  const { configMode, shouldCheck, networkBaseInfo, Cluster, setConfigMode, afterFormCheck } = props;
  const { clusterList } = Cluster;

  const [form] = Form.useForm();

  const checkFormValue = useCallback(() => {
    form.validateFields().then((values) => {
      afterFormCheck(values, EStepType.CONFIG_NETWORK, values.configMode === 'default');
    });
  }, [afterFormCheck, form]);

  const onChangeMode = (e: any) => {
    setConfigMode(e.target.value);
  };

  useEffect(() => {
    if (shouldCheck) {
      checkFormValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCheck]);

  useEffect(() => {
    form.setFieldsValue(networkBaseInfo);
  }, [networkBaseInfo, form]);

  return (
    <Form {...formItemLayout} form={form}>
      <Item label="配置模式" name="configMode" initialValue="default">
        <Radio.Group onChange={onChangeMode}>
          <Radio value="default">默认配置</Radio>
          <Radio value="custom">自定义配置</Radio>
        </Radio.Group>
      </Item>
      <Item label="网络名称" name="network">
        <Input disabled={true} />
      </Item>
      <Item
        label="配置集群"
        name="cluster"
        rules={[
          {
            required: true,
            message: '请选择集群'
          }
        ]}>
        <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择集群">
          {clusterList.map((item) => (
            <Option key={item.name} value={item.name}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Item>
      {configMode === 'default' && (
        <>
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
                pattern: /^[a-z0-9]+$/,
                message: '组织名称由4~20位小写英文或数字组成'
              }
            ]}>
            <Input placeholder="请输入组织名称" />
          </Item>
          <Item
            label="通道名称"
            name="channelName"
            rules={[
              {
                required: true,
                message: '请输入通道名称'
              },
              {
                min: 3,
                max: 15,
                type: 'string',
                pattern: /^[a-zA-Z0-9]+$/,
                message: '通道名称由3~15位英文或数字组成'
              }
            ]}>
            <Input placeholder="请输入通道名称" />
          </Item>
          <Item
            label="通道描述"
            name="channelDesc"
            rules={[
              {
                required: true,
                message: '请输入通道描述'
              }
            ]}>
            <TextArea rows={3} placeholder="请输入通道描述" />
          </Item>
        </>
      )}
      {configMode === 'custom' && (
        <>
          <Item
            label="排序节点数"
            name="ordererNodeNum"
            rules={[
              {
                required: true,
                message: '请输入排序节点数'
              }
            ]}>
            <InputNumber step={1} min={1} max={3} style={{ width: '100%' }} placeholder="请输入排序节点数" />
          </Item>
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
            <InputNumber
              min={1}
              formatter={(text) => `${text}h`}
              style={{ width: '100%' }}
              placeholder="请输入CA证书过期时间"
            />
          </Item>
        </>
      )}
    </Form>
  );
}

export default connect(({ Cluster }: ConnectState) => ({
  Cluster
}))(ConfigNetwork);
