import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { Link, connect, Dispatch, Location } from 'umi';
import styles from './style.less';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';
export interface RegisterResultProps {
  dispatch: Dispatch;
  User: ConnectState['User'];
  location: Location<{ account: string }>;
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
          {Intl.formatMessage('BASS_LOGIN_NOW')}
        </Button>
      </Link>
      <Link to="/user/register">
        <Button size="large">{Intl.formatMessage('BASS_REGISTER_AGAIN')}</Button>
      </Link>
    </div>
  );

  return (
    <Result
      className={styles.registerResult}
      status={location?.state?.account ? 'success' : 'warning'}
      title={
        <div className={styles.title}>
          {location?.state?.account
            ? `${Intl.formatMessage('BASS_REGISTER_YOUR_ACCOUNT')}：${location?.state?.account} ${Intl.formatMessage(
                'BASS_REGISTER_SUCCESSFULLY'
              )}`
            : '暂无账户'}
        </div>
      }
      subTitle=""
      extra={actions}
    />
  );
};

export default connect(({ User }: ConnectState) => ({ User }))(RegisterResult);
