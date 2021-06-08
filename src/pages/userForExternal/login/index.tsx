import React, { useEffect } from 'react';
import { Link, connect, history } from 'umi';
import { parse } from 'qs';
import { Form, Button, Input } from 'antd';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { LoginMessage } from '~/components';
import LoginStatus from '~/utils/loginStatus';
import { ConnectState } from '~/models/connect';
import { LoginProps } from '~/pages/user/login';
import styles from './index.less';

const FormItem = Form.Item;

const LoginForExternal: React.FC<LoginProps> = (props) => {
  const [form] = Form.useForm();
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
            const search = window.location.search ? window.location.search.replace('?', '') : '';
            const { redirect } = parse(search);
            if (redirect) {
              window.top.postMessage(res.access_token, redirect as string);
              window.location.replace(`${redirect}#${res.access_token}`);
            } else {
              history.replace('/selectLeague');
            }
          }
        });
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
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
          <Input prefix={<UserOutlined className={styles.prefixIcon} />} placeholder="邮箱" />
        </FormItem>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码！'
            }
          ]}>
          <Input prefix={<LockTwoTone className={styles.prefixIcon} />} placeholder="密码" />
        </FormItem>
        <Button size="large" type="primary" className={styles.submit} onClick={handleSubmit}>
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
}))(LoginForExternal);
