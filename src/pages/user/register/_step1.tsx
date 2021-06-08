import React, { useEffect, useCallback } from 'react';
import { Form, Input } from 'antd';
import { operType } from './index';
const FormItem = Form.Item;

export type StepOneProps = {
  curOper: operType;
  basicInfo: any;
  failedToValidate: (step: operType) => void;
  afterValidate: (value: any, step: any) => void;
};

const StepOne: React.FC<StepOneProps> = (props) => {
  const { curOper, basicInfo, afterValidate, failedToValidate } = props;
  const [form] = Form.useForm();

  const onCheck = useCallback(async () => {
    try {
      const values = await form.validateFields();
      afterValidate(values, operType.next);
    } catch (errorInfo) {
      failedToValidate(operType.default);
    }
  }, [afterValidate, failedToValidate, form]);

  useEffect(() => {
    if (curOper === operType.next) {
      onCheck();
    }
  }, [curOper, onCheck]);

  return (
    <Form form={form} name="UserRegisterStepOne">
      <FormItem
        initialValue={basicInfo.contactName || ''}
        name="contactName"
        rules={[
          {
            required: true,
            message: '请输入联系人姓名!'
          }
        ]}>
        <Input size="large" placeholder="联系人姓名" />
      </FormItem>
      <FormItem
        name="contactPhone"
        rules={[
          {
            required: true,
            message: '请输入手机号'
          },
          {
            pattern: /^\d{11}$/,
            message: '手机号格式错误'
          }
        ]}
        initialValue={basicInfo.contactPhone || ''}>
        <Input size="large" placeholder="联系人手机号" />
      </FormItem>
      <FormItem
        initialValue={basicInfo.contactAddress || ''}
        name="contactAddress"
        rules={[
          {
            required: true,
            message: '请输入联系人地址!'
          }
        ]}>
        <Input size="large" placeholder="联系地址" />
      </FormItem>
      <FormItem initialValue={basicInfo.invitationCode || ''} name="invitationCode">
        <Input size="large" placeholder="邀请码" />
      </FormItem>
    </Form>
  );
};

export default StepOne;
