import { Form, Input, Popover, Progress } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { operType } from './index';
import styles from './index.less';
import { Intl } from '~/utils/locales';
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      {Intl.formatMessage('BASS_REGISTER_SAFETY')}：{Intl.formatMessage('BASS_REGISTER_SAFETY_LEVEL1')}
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      {Intl.formatMessage('BASS_REGISTER_SAFETY')}：{Intl.formatMessage('BASS_REGISTER_SAFETY_LEVEL2')}
    </div>
  ),
  poor: (
    <div className={styles.error}>
      {Intl.formatMessage('BASS_REGISTER_SAFETY')}：{Intl.formatMessage('BASS_REGISTER_SAFETY_LEVEL3')}
    </div>
  )
};

type ProgressStatus = 'success' | 'normal' | 'exception' | 'active' | undefined;

const passwordProgressMap: {
  ok: ProgressStatus;
  pass: ProgressStatus;
  poor: ProgressStatus;
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};

export type StepTwoProps = {
  curOper: operType;
  basicInfo: any;
  failedToValidate: (step: operType) => void;
  afterValidate: (value: any, step: any) => void;
};

const StepTwo: React.FC<StepTwoProps> = (props) => {
  const { curOper, afterValidate, failedToValidate } = props;
  const [visible, setVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;

  const [form] = Form.useForm();

  const onCheck = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const stepValue = { ...values };
      afterValidate(stepValue, operType.submit);
    } catch (errorInfo) {
      failedToValidate(operType.default);
    }
  }, [afterValidate, failedToValidate, form]);

  useEffect(() => {
    if (curOper === operType.submit) {
      onCheck();
    }
  }, [curOper, onCheck]);

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(Intl.formatMessage('BASS_REGISTER_PASSWORD_NO_MATCH'));
    }

    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setVisible(!!value);
      return promise.reject(Intl.formatMessage('BASS_FABRIC_INPUT_PASSWORD'));
    } // 有值的情况

    if (!visible) {
      setVisible(!!value);
    }

    setPopover(!popover);

    if (value.length < 6 || value.length > 18) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <Form form={form} name="UserRegister">
      <FormItem
        name="contactPhone"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_INPUT_CONTACT_PHONE')
          },
          {
            pattern: /^\d{11}$/,
            message: Intl.formatMessage('BASS_USER_INFO_PHONE_FORMAT_WRONG')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_CONTACT_PHONE')} />
      </FormItem>
      <FormItem
        name="contactEmail"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL_ADDRESS')
          },
          {
            type: 'email',
            message: Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL_ADDRESS_FORMAT_WRONG')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_CONTACT_EMAIL')} />
      </FormItem>
      <FormItem
        name="loginName"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_USER_INFO_INPUT_USER_NAME')
          },
          {
            type: 'string',
            pattern: /^[a-zA-Z0-9\-_]{5,20}$/,
            message: Intl.formatMessage('BASS_USER_INFO_INPUT_USER_NAME_LENGTH')
          }
        ]}>
        <Input size="large" placeholder={Intl.formatMessage('BASS_USER_INFO_USER_NAME')} />
      </FormItem>
      <Popover
        getPopupContainer={(node) => {
          if (node && node.parentNode) {
            return node.parentNode;
          }
          return node;
        }}
        content={
          visible && (
            <div
              style={{
                padding: '4px 0'
              }}>
              {passwordStatusMap[getPasswordStatus()]}
              {renderPasswordProgress()}
              <div
                style={{
                  marginTop: 10
                }}>
                {Intl.formatMessage('BASS_REGISTER_PASSWORD_LENGTH')}
              </div>
            </div>
          )
        }
        overlayStyle={{
          width: 240
        }}
        placement="right"
        visible={visible}>
        <FormItem
          name="password"
          className={form.getFieldValue('password') && form.getFieldValue('password').length > 0 && styles.password}
          rules={[
            {
              validator: checkPassword
            }
          ]}>
          <Input size="large" type="password" placeholder={Intl.formatMessage('BASS_REGISTER_PASSWORD_NUMBER')} />
        </FormItem>
      </Popover>
      <FormItem
        name="confirm"
        rules={[
          {
            required: true,
            message: Intl.formatMessage('BASS_FABRIC_INPUT_PASSWORD')
          },
          {
            validator: checkConfirm
          }
        ]}>
        <Input size="large" type="password" placeholder={Intl.formatMessage('BASS_FABRIC_CONFIRM_PASSWORD')} />
      </FormItem>
    </Form>
  );
};

export default StepTwo;
