import React, { useEffect } from 'react';
import { Link, connect, history } from 'umi';
import { Form } from 'antd';
import { parse } from 'qs';
import LoginFrom from '@/pages/user/login/components/Login';
import { LoginMessage } from '~/components';
import LoginStatus from '~/utils/loginStatus';
import { ConnectState } from '~/models/connect';
import styles from './index.less';
import { LoginProps } from '@/pages/user/login';

const { UserName, Password, Submit } = LoginFrom;

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
          payload: values,
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
      payload: { loginStatus: '', userAndRegister: false },
    });
  }, []);

  return (
    <div className={styles.main}>
      <h3>登录</h3>
      {loginStatus === LoginStatus.LOGIN_ERROR && !loginLoading && <LoginMessage content={loginInfo} />}
      <LoginFrom form={form} onSubmit={handleSubmit}>
        <UserName
          name="email"
          placeholder="邮箱"
          defaultValue={location?.state?.account}
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <Submit className="" loading={loginLoading}>
          登录
        </Submit>
        <div className={styles.other}>
          暂无账号?
          <Link className={styles.register} to="/user/register">
            立即注册
          </Link>
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  loginLoading: loading.effects['User/login'],
}))(LoginForExternal);
