import React, { useEffect } from 'react';
import { Link, connect, history } from 'umi';
import { parse } from 'qs';
import { Form } from 'antd';
import LoginFrom from './components/Login';
import { LoginMessage } from 'components';
import LoginStatus from 'utils/loginStatus';
import styles from './index.less';


const { UserName, Password, Submit } = LoginFrom;

function Login(props) {

  const [form] = Form.useForm();
  const { logining, dispatch, location, User } = props;
  const { loginInfo, loginStatus } = User;

  const handleSubmit = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'User/login',
        payload: values
      }).then(res => {
        if (res) {
          const redirect = localStorage.getItem('redirect');
          if (redirect) {
            window.location.replace(`${redirect}#${res.access_token}`);
          } else {
            history.replace('/selectLeague');
          }
        }
      })
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  useEffect(() => {
    dispatch({
      type: 'User/common',
      payload: { loginStatus: '', userAndregister: false }
    })
  }, []);

  return (
    <div className={styles.main}>
      <h3>登录</h3>
      {loginStatus === LoginStatus.loginError && !logining && (
        <LoginMessage content={loginInfo} />
      )}
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
        <Submit loading={logining}>登录</Submit>
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

export default connect(({ User, loading }) => ({
  User,
  logining: loading.effects['User/login']
}))(Login);
