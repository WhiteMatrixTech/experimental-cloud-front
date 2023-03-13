import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Popover, Progress } from 'antd';
import { Link, connect, history, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import styles from './index.less';
import { passwordProgressMap } from '../_config';
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：弱</div>
};

export type RegisterProps = {
  submitting: boolean;
  dispatch: Dispatch;
  location: any;
  User: ConnectState['User'];
};

const Register: React.FC<RegisterProps> = (props) => {
  const [accountInfo, setAccountInfo] = useState({ email: '' });

  const { submitting, dispatch, User } = props;
  const { userAndRegister } = User;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;
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
      return promise.reject('两次输入的密码不匹配');
    }

    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码');
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

  const onClickRegister = async () => {
    try {
      const values = await form.validateFields();
      const { password, confirm, ...data } = values;
      const params = {
        ...data,
        pass: password
      };
      setAccountInfo(params);
      dispatch({
        type: 'User/register',
        payload: params
      });
    } catch (errorInfo) {
      //
    }
  };

  useEffect(() => {
    if (userAndRegister) {
      history.push({
        pathname: '/user/register-result',
        state: {
          register: true,
          account: accountInfo.email,
          tip: `你的账户：${accountInfo.email} 注册成功`
        }
      });
    }
  }, [accountInfo.email, userAndRegister]);

  return (
    <div className={styles.main}>
      <h3>注册</h3>
      <Form form={form} name="UserRegister">
        <FormItem
          name="email"
          rules={[
            {
              required: true,
              message: '请输入邮箱地址'
            },
            {
              type: 'email',
              message: '邮箱地址格式错误'
            }
          ]}>
          <Input size="middle" placeholder="邮箱" />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
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
                  请至少输入 6 个字符。请不要使用容易被猜到的密码
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
            <Input size="middle" type="password" placeholder="至少6位密码，区分大小写" />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: '请确认密码'
            },
            {
              validator: checkConfirm
            }
          ]}>
          <Input size="middle" type="password" placeholder="确认密码" />
        </FormItem>
        <FormItem
          name="name"
          rules={[
            {
              required: true,
              message: '请输入姓名'
            },
            {
              type: 'string',
              pattern: /^[a-zA-Z0-9\-_]{3,20}$/,
              message: '姓名不合法, 至少需要3个字符'
            }
          ]}>
          <Input size="middle" placeholder="用户姓名" />
        </FormItem>
        <FormItem
          name="phoneNo"
          rules={[
            {
              required: true,
              message: '请输入手机号码'
            },
            {
              pattern: /^\d{11}$/,
              message: '手机号码格式错误'
            }
          ]}>
          <Input size="middle" placeholder="手机号码" />
        </FormItem>
        <FormItem
          name="address"
          rules={[
            {
              required: true,
              message: '请输入联系地址'
            }
          ]}>
          <Input size="middle" placeholder="联系地址" />
        </FormItem>
        <FormItem
          name="companyName"
          rules={[
            {
              required: true,
              message: '请输入公司名称'
            }
          ]}>
          <Input size="middle" placeholder="公司名称" />
        </FormItem>
        <FormItem
          name="companyCertBusinessNumber"
          rules={[
            {
              required: true,
              message: '信用代码!'
            }
          ]}>
          <Input size="middle" placeholder="信用代码" />
        </FormItem>
      </Form>
      <div className={styles.operate}>
        <Button size="middle" loading={submitting} className={styles.submit} type="primary" onClick={onClickRegister}>
          注册
        </Button>
        <Link className={styles.login} to="/user/login">
          使用已有账户登录
        </Link>
      </div>
    </div>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  submitting: loading.effects['User/register']
}))(Register);
