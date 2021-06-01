import React, { useEffect } from 'react';
import { Link, connect, history, Dispatch } from 'umi';
import { Form } from 'antd';
import LoginFrom from './components/Login';
import { LoginMessage } from '~/components';
import LoginStatus from '~/utils/loginStatus';
import { ConnectState } from '~/models/connect';
import styles from './index.less';

const { UserName, Password, Submit } = LoginFrom;

export type LoginProps = {
  loginLoading: boolean;
  dispatch: Dispatch;
  location: any;
  User: ConnectState['User'];
};

const Login: React.FC<LoginProps> = (props) => {
  const [form] = Form.useForm();
  const { loginLoading, dispatch, location, User } = props;
  const { loginInfo, loginStatus } = User;

  function handleSubmit() {
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
  }

  // TODO: 用户名输入框回车应该跳到密码输入框，而不是提交表单
  // function handleUserKeyInput(e) {
  //   if (e.keyCode === 13) {
  //     this.refs.passwd.focus();
  //     return false;
  //   }
  // }

  function handleInputTrim(e) {
    return e.target.value.trim();
  }

  useEffect(() => {
    dispatch({
      type: 'User/common',
      payload: { loginStatus: '', userAndRegister: false }
    });
  }, []);

  return (
    <div className={styles.main}>
      <h3>登录</h3>
      {loginStatus === LoginStatus.LOGIN_ERROR && !loginLoading && <LoginMessage content={loginInfo} />}
      <LoginFrom form={form} onSubmit={handleSubmit}>
        <UserName
          // onKeyDown={handleUserKeyInput}
          name="email"
          placeholder="邮箱"
          defaultValue={location?.state?.account}
          rules={[
            {
              required: true,
              message: '请输入邮箱!'
            }
          ]}
          getValueFromEvent={handleInputTrim}
        />
        <Password
          name="password"
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '请输入密码！'
            }
          ]}
        />
        <Submit className="" loading={loginLoading}>
          登录
        </Submit>
        <div className={styles.other}>
          <div>
            暂无账号?
            <Link className={styles.register} to="/user/register">
              立即注册
            </Link>
          </div>
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  loginLoading: loading.effects['User/login']
}))(Login);
