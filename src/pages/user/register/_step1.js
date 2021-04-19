import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
const FormItem = Form.Item;

const StepOne = (props) => {
  const { curOper, operType, basicInfo, afterValidate, failedToValidate } = props;
  const [form] = Form.useForm();

  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      afterValidate(values, operType.next);
    } catch (errorInfo) {
      failedToValidate(operType.default);
    }
  };

  useEffect(() => {
    if (curOper === operType.next) {
      onCheck();
    }
  }, [curOper]);

  return (
    <Form form={form} name="UserRegisterStepOne">
      <FormItem
        initialValue={basicInfo.companyName ? basicInfo.companyName : ''}
        name="companyName"
        rules={[
          {
            required: true,
            message: '请输入企业名称!',
          },
        ]}
      >
        <Input size="large" placeholder="企业名称" />
      </FormItem>
      <FormItem
        initialValue={basicInfo.companyCertBusinessNumber ? basicInfo.companyCertBusinessNumber : ''}
        name="companyCertBusinessNumber"
        rules={[
          {
            required: true,
            message: '请输入统一社会信用代码!',
          },
        ]}
      >
        <Input size="large" placeholder="统一社会信用代码" />
      </FormItem>
      <FormItem
        initialValue={basicInfo.legalPersonName ? basicInfo.legalPersonName : ''}
        name="legalPersonName"
        rules={[
          {
            required: true,
            message: '请输入法人代表姓名!',
          },
        ]}
      >
        <Input size="large" placeholder="法人代表姓名" />
      </FormItem>
      <FormItem
        initialValue={basicInfo.contactName ? basicInfo.contactName : ''}
        name="contactName"
        rules={[
          {
            required: true,
            message: '请输入联系人姓名!',
          },
        ]}
      >
        <Input size="large" placeholder="联系人姓名" />
      </FormItem>
      <FormItem
        initialValue={basicInfo.companyAddress ? basicInfo.companyAddress : ''}
        name="companyAddress"
        rules={[
          {
            required: true,
            message: '请输入联系人地址!',
          },
        ]}
      >
        <Input size="large" placeholder="联系地址" />
      </FormItem>
      <FormItem initialValue={basicInfo.invitationCode ? basicInfo.invitationCode : ''} name="invitationCode">
        <Input size="large" placeholder="邀请码" />
      </FormItem>
    </Form>
  );
};

export default StepOne;
