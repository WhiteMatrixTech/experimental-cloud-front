import { Button, Result } from 'antd';
import { Link, connect } from 'umi';
import React, { useEffect } from 'react';
import styles from './style.less';

const RegisterResult = ({ location, dispatch }) => {

  useEffect(() => {
    dispatch({
      type: 'User/common',
      payload: { userAndregister: false }
    })
  }, []);

  const actions = (
    <div className={styles.actions}>
      <Link to={{
        pathname: "/user/login",
        state: { account: location?.state?.account },
      }}>
        <Button size="large" type="primary">
          立即登录
      </Button>
      </Link>
      <Link to="/user/register">
        <Button size="large">
          重新注册
      </Button>
      </Link>
    </div>
  );

  return (<Result
    className={styles.registerResult}
    status={location?.state?.account ? "success" : "warning"}
    title={
      <div className={styles.title}>
        {location?.state?.account ? `你的账户：${location?.state?.account} 注册成功` : '暂无账户'}
      </div>
    }
    subTitle=""
    extra={actions}
  />
  )
};

export default connect(({ User }) => ({ User }))(RegisterResult);
