import React, { useState, useEffect, useCallback } from 'react';
import { Button, Col, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { EStepType } from './index';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

const inlineItemLayout = {
  wrapperCol: {
    sm: { span: 18 }
  }
};

interface ConfigOrgProps {
  shouldCheck: boolean;
  networkOrgInfo: any;
  failCheck: () => void;
  afterFormCheck: (values: any, step: EStepType) => void;
}

export function ConfigOrg(props: ConfigOrgProps) {
  const { shouldCheck, networkOrgInfo, failCheck, afterFormCheck } = props;

  const [form] = Form.useForm();
  const [nodeAddMode, setNodeAddMode] = useState('NORMAL');

  const checkFormValue = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        afterFormCheck(values, EStepType.CONFIG_ORG);
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
    form.setFieldsValue(networkOrgInfo);
    if (networkOrgInfo?.nodeAddMode) {
      setNodeAddMode(networkOrgInfo?.nodeAddMode);
    }
  }, [networkOrgInfo, form]);

  const onChangeMode = (e: any) => {
    setNodeAddMode(e.target.value);
  };

  return (
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
            message: '组织名称由4~20位小写英文或数字组成'
          }
        ]}>
        <Input placeholder="请输入组织名称" />
      </Item>
      {/* todo 后续接口查询 */}
      <Item
        label="配置镜像"
        name="peerNodeImage"
        tooltip="目前支持Fabric peer的官方节点镜像，也可在一键编译中，更改Fabric 源码，创建自己的镜像"
        rules={[
          {
            required: true,
            message: '请选择镜像'
          }
        ]}>
        <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择镜像">
          <Option value="hyperledger/fabric-peer">hyperledger/fabric-peer</Option>
        </Select>
      </Item>
      <Item
        label="镜像版本"
        name="peerNodeImageVersion"
        rules={[
          {
            required: true,
            message: '请选择镜像版本'
          }
        ]}>
        <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择镜像版本">
          <Option value="2.4.6">2.4.6</Option>
        </Select>
      </Item>
      <Item
        label="配置模式"
        name="nodeAddMode"
        initialValue="NORMAL"
        rules={[
          {
            required: true,
            message: '请选择配置模式'
          }
        ]}>
        <Radio.Group onChange={onChangeMode}>
          <Radio value="NORMAL">常规添加</Radio>
          <Radio value="BATCH">多节点添加</Radio>
        </Radio.Group>
      </Item>
      {nodeAddMode === 'NORMAL' && (
        <Form.List name="nodeList">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Row>
                      <Col offset={6} span={8}>
                        <Item
                          {...restField}
                          {...inlineItemLayout}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[
                            {
                              required: true,
                              message: '请输入节点名称'
                            },
                            {
                              min: 4,
                              max: 20,
                              type: 'string',
                              pattern: /^[a-z0-9]{4,20}$/,
                              message: '节点名称由4~20位小写英文或数字组成'
                            }
                          ]}>
                          <Input placeholder="请输入节点名称" />
                        </Item>
                      </Col>
                      <Col span={9}>
                        <Item
                          {...restField}
                          {...inlineItemLayout}
                          name={[name, 'description']}
                          fieldKey={[fieldKey, 'description']}
                          rules={[{ required: true, message: '请输入节点描述' }]}>
                          <Input placeholder="请输入节点描述" />
                        </Item>
                      </Col>
                      <Col span={1}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Item
                  wrapperCol={{
                    sm: { span: 18, offset: 6 }
                  }}>
                  <Button type="dashed" onClick={() => add()} block={true} icon={<PlusOutlined />}>
                    添加节点
                  </Button>
                </Item>
              </>
            );
          }}
        </Form.List>
      )}
      {nodeAddMode === 'BATCH' && (
        <div>
          <Item
            label="节点数量"
            name="nodeNum"
            rules={[
              {
                required: true,
                message: '请输入节点数量'
              }
            ]}>
            <InputNumber style={{ width: '100%' }} min={1} max={100} step={1} />
          </Item>
          <Item
            label="模板节点名称"
            name="nodeNamePrefix"
            rules={[
              {
                required: true,
                message: '请输入模板节点名称'
              },
              {
                min: 3,
                max: 15,
                type: 'string',
                pattern: /^[a-z0-9]+$/,
                message: '节点名称由3~15位英文或数字组成'
              }
            ]}>
            <Input placeholder="请输入模板节点名称" />
          </Item>
          <Item label="模板节点描述" name="nodeDescription">
            <Input placeholder="请输入模板节点描述" />
          </Item>
        </div>
      )}
    </Form>
  );
}
