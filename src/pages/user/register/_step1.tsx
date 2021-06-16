import React, { useEffect, useCallback } from 'react';
import { Form, Input } from 'antd';
import { operType } from './index';
import { Intl } from '~/utils/locales';
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
        initialValue={basicInfo.companyName ? basicInfo.companyName : ''}
        name="companyName"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_INPUT_USER_NAME')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_USER_NAME')} />
      </FormItem>
      <FormItem
        initialValue={basicInfo.companyCertBusinessNumber ? basicInfo.companyCertBusinessNumber : ''}
        name="companyCertBusinessNumber"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_UNIFIED_CODE')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_UNIFIED_CODE')} />
      </FormItem>
      <FormItem
        initialValue={basicInfo.legalPersonName ? basicInfo.legalPersonName : ''}
        name="legalPersonName"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_LEGAL_NAME')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_LEGAL_NAME')} />
      </FormItem>
      <FormItem
        initialValue={basicInfo.contactName ? basicInfo.contactName : ''}
        name="contactName"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_INPUT_CONTACT_PERSON_NAME')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_INPUT_CONTACT_PERSON_NAME')} />
      </FormItem>
      <FormItem
        initialValue={basicInfo.companyAddress ? basicInfo.companyAddress : ''}
        name="companyAddress"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_INPUT_CONTACT_ADDRESS')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_INPUT_CONTACT_ADDRESS')} />
      </FormItem>
      <FormItem initialValue={basicInfo.invitationCode ? basicInfo.invitationCode : ''} name="invitationCode">
        <Input size="large" placeholder={Intl.formatMessage('BASS_REGISTER_INVITATION_CODE')} />
      </FormItem>
    </Form>
  );
};

export default StepOne;
