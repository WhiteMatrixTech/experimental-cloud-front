import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { Link, connect, Dispatch, Location } from 'umi';
import styles from './style.less';
import { ConnectState } from '~/models/connect';
export interface RegisterResultProps {
  dispatch: Dispatch;
  User: ConnectState['User'];
  location: Location<{ account: string; tip: string }>;
}

const RegisterResult: React.FC<RegisterResultProps> = ({ location, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'User/common',
      payload: { userAndRegister: false }
    });
  }, [dispatch]);

  const actions = (
    <div className={styles.actions}>
      <Link
        to={{
          pathname: '/user/login',
          state: { account: location?.state?.account }
        }}>
        <Button size="large" type="primary">
          立即登录
        </Button>
      </Link>
      <Link to="/user/register">
        <Button size="large">重新注册</Button>
      </Link>
    </div>
  );

  return (
    <Result
      className={styles.registerResult}
      status={location?.state?.tip ? "success" : "warning"}
      title={
        <div className={styles.title}>
          {location?.state?.tip ? location?.state?.tip : '暂无账户'}
        </div>
      }
      subTitle=""
      extra={actions}
    />
  );
};

export default connect(({ User }: ConnectState) => ({ User }))(RegisterResult);
