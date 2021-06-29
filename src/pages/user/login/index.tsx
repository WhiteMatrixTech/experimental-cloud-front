import React, { useEffect, useRef } from 'react';
import { Link, connect, history, Dispatch } from 'umi';
import { Form, Button, Input } from 'antd';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { LoginMessage } from '~/components';
import LoginStatus from '~/utils/loginStatus';
import { ConnectState } from '~/models/connect';
import styles from './index.less';

const FormItem = Form.Item;

export type LoginProps = {
  loginLoading: boolean;
  dispatch: Dispatch;
  location: any;
  User: ConnectState['User'];
};

const Login: React.FC<LoginProps> = (props) => {
  const [form] = Form.useForm();
  const inputRef = useRef<Input | null>(null);
  const { loginLoading, dispatch, location, User } = props;
  const { loginInfo, loginStatus } = User;

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch({
          type: 'User/login',
          payload: values
        }).then((res: { access_token: string }) => {
          if (res) {
            localStorage.setItem('accessToken', res.access_token);
            const redirect = localStorage.getItem('redirect');
            if (redirect) {
              window.location.replace(`${redirect}#${res.access_token}`);
            } else {
              history.replace('/selectLeague');
            }
          }
        });
      })
      .catch((info) => {
        console.log('校验失败:', info);
        // FIXME： 服务器宕机时登录无任何提示，需要加入网络连接中断之类的 Notification
      });
  };

  const handleUserKeyInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    dispatch({
      type: 'User/common',
      payload: { loginStatus: '', userAndRegister: false }
    });
  }, [dispatch]);

  return (
    <div className={styles.main}>
      <h3>登录</h3>
      {loginStatus === LoginStatus.LOGIN_ERROR && !loginLoading && <LoginMessage content={loginInfo} />}
      <Form form={form}>
        <FormItem
          name="email"
          initialValue={location?.state?.account}
          rules={[
            {
              required: true,
              message: '请输入邮箱!'
            }
          ]}>
          <Input
            onPressEnter={handleUserKeyInput}
            prefix={<UserOutlined className={styles.prefixIcon} />}
            placeholder="邮箱"
          />
        </FormItem>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码！'
            }
          ]}>
          <Input.Password ref={inputRef} prefix={<LockTwoTone className={styles.prefixIcon} />} placeholder="密码" />
        </FormItem>
        <Button size="middle" type="primary" htmlType="submit" className={styles.submit} onClick={handleSubmit}>
          登录
        </Button>
        <div className={styles.other}>
          <div>
            暂无账号?
            <Link className={styles.register} to="/user/register">
              立即注册
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  loginLoading: loading.effects['User/login']
}))(Login);
