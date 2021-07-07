import React, { useState } from 'react';
import { connect, Dispatch, history, Link } from 'umi';
import { Form, Input, Popover, Progress, Button } from 'antd';
import { ConnectState } from '~/models/connect';
import { passwordProgressMap } from '../_config';
import styles from './index.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：弱</div>,
};

export type SetPasswordProps = {
  dispatch: Dispatch;
  location: any;
  User: ConnectState['User'];
};

const SetPassword: React.FC<SetPasswordProps> = (props) => {
  const { dispatch, location } = props;

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const [same, setSame] = useState(false);
  const confirmDirty = false;

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { confirm, ...params } = values;
        dispatch({
          type: 'User/changePassword',
          payload: params,
        }).then((res: boolean) => {
          if (res) {
            history.push({
              pathname: '/user/register-result',
              state: {
                account: params.email,
                tip: `你的账户：${params.email} 密码修改成功`,
              },
            });
          }
        });
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('newPassword');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const checkConfirm = (_, value: string) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('newPassword')) {
      return promise.reject('两次输入的密码不匹配');
    }

    return promise.resolve();
  };

  const checkPassword = (_, value: string) => {
    const promise = Promise;

    if (value && value === form.getFieldValue('password')) {
      setSame(true);
      return promise.reject('新密码不能与旧密码相同');
    }

    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码');
    }

    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }

    setSame(false);
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
    const value = form.getFieldValue('newPassword');
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
    <div className={styles.main}>
      <h3>修改密码</h3>
      <Form form={form} name="UserSetPassword">
        <FormItem
          name="email"
          initialValue={location?.state?.email}
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
          ]}
        >
          <Input size="large" placeholder="邮箱" />
        </FormItem>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: '请输入原密码!',
            },
          ]}
        >
          <Input size="large" type="password" placeholder="原密码" />
        </FormItem>
        <Popover
          getPopupContainer={(node): HTMLElement => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
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
                  {same ? '新密码不能与旧密码相同' : '请至少输入 6 个字符。请不要使用容易被猜到的密码'}
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
            name="newPassword"
            className={
              form.getFieldValue('newPassword') && form.getFieldValue('newPassword').length > 0 && styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="新密码，至少6位密码，区分大小写" />
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
          <Input size="large" type="password" placeholder="确认密码" />
        </FormItem>
        <FormItem>
          <Button size="large" className={styles.submit} type="primary" htmlType="submit" onClick={handleSubmit}>
            提交
          </Button>
        </FormItem>
      </Form>
      <Link className={styles.login} to="/user/login">
        返回登录
      </Link>
    </div>
  );
}

export default connect(({ User, loading }: ConnectState) => ({
  User,
  loginLoading: loading.effects['User/login'],
}))(SetPassword);
