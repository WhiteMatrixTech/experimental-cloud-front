import { Form, Input, Popover, Progress } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      强度：强
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      强度：中
    </div>
  ),
  poor: (
    <div className={styles.error}>
      强度：弱
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const StepTwo = (props) => {
  const { curOper, operType, afterValidate, failedToValidate } = props;
  const [visible, setvisible] = useState(false);
  const [popover, setpopover] = useState(false);
  const confirmDirty = false;

  const [form] = Form.useForm();

  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      const stepValue = { ...values };
      afterValidate(stepValue, operType.submit)
    } catch (errorInfo) {
      failedToValidate(operType.default);
    }
  }

  useEffect(() => {
    if (curOper === operType.submit) {
      onCheck()
    }
  }, [curOper])

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

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配');
    }

    return promise.resolve();
  };

  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setvisible(!!value);
      return promise.reject('请输入密码');
    } // 有值的情况

    if (!visible) {
      setvisible(!!value);
    }

    setpopover(!popover);

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
            message: '请输入手机号',
          },
          {
            pattern: /^\d{11}$/,
            message: '手机号格式错误',
          },
        ]}
      >
        <Input
          size="large"
          placeholder="联系人手机号"
        />
      </FormItem>
      <FormItem
        name="contactEmail"
        rules={[
          {
            required: true,
            message: '请输入邮箱地址!',
          },
          {
            type: 'email',
            message: '邮箱地址格式错误',
          },
        ]}
      >
        <Input
          size="large"
          placeholder='联系人邮箱'
        />
      </FormItem>
      <FormItem
        name="loginName"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
          {

            type: 'string',
            pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
            message: '用户名不合法, 至少需要5个字符'
          },
        ]}
      >
        <Input
          size="large"
          placeholder='用户名'
        />
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
                padding: '4px 0',
              }}
            >
              {passwordStatusMap[getPasswordStatus()]}
              {renderPasswordProgress()}
              <div
                style={{
                  marginTop: 10,
                }}
              >
                请至少输入 6 个字符。请不要使用容易被猜到的密码
                </div>
            </div>
          )
        }
        overlayStyle={{
          width: 240,
        }}
        placement="right"
        visible={visible}
      >
        <FormItem
          name="password"
          className={
            form.getFieldValue('password') &&
            form.getFieldValue('password').length > 0 &&
            styles.password
          }
          rules={[
            {
              validator: checkPassword,
            },
          ]}
        >
          <Input
            size="large"
            type="pass"
            placeholder="至少6位密码，区分大小写"
          />
        </FormItem>
      </Popover>
      <FormItem
        name="confirm"
        rules={[
          {
            required: true,
            message: '请确认密码!',
          },
          {
            validator: checkConfirm,
          },
        ]}
      >
        <Input
          size="large"
          type="password"
          placeholder='确认密码'
        />
      </FormItem>
    </Form >
  );
};

export default StepTwo;
