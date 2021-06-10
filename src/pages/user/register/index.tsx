import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Steps } from 'antd';
import { Link, connect, history, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import StepOne from './_step1';
import StepTwo from './_step2';
import styles from './index.less';
import { Intl } from '~/utils/locales';

const { Step } = Steps;
const steps = [
  {
    title: Intl.formatMessage('BASS_COMMON_BASIC_INFORMATION')
  },
  {
    title: Intl.formatMessage('BASS_REGISTER_ACCOUNT_PASSWORD')
  }
];

export enum operType {
  default = 'default',
  next = 'next',
  submit = 'submit'
}

export type RegisterProps = {
  submitting: boolean;
  dispatch: Dispatch;
  location: any;
  User: ConnectState['User'];
};

const Register: React.FC<RegisterProps> = (props) => {
  const [curOper, setCurOper] = useState(operType.default);
  const [basicInfo, setBasicInfo] = useState({});
  const [accountInfo, setAccountInfo] = useState({ contactEmail: '' });
  const [current, setCurrent] = useState(0);

  const { submitting, dispatch, User } = props;
  const { userAndRegister } = User;

  const next = () => {
    setCurOper(operType.next);
  };

  const prev = () => {
    setCurOper(operType.default);
    setCurrent(current - 1);
  };

  const register = () => {
    setCurOper(operType.submit);
  };

  const cacheBasicInfo = (basicInfo: any) => {
    setBasicInfo(basicInfo);
  };

  const afterValidate = useCallback(
    (value: any, step: operType) => {
      if (step === operType.next) {
        cacheBasicInfo(value);
        setCurrent(current + 1);
      } else if (step === operType.submit) {
        setAccountInfo(value);
        const params = {
          ...basicInfo,
          contactPhone: value.contactPhone,
          contactEmail: value.contactEmail,
          loginName: value.loginName,
          pass: value.password,
          re_pass: value.confirm
        };
        dispatch({
          type: 'User/register',
          payload: params
        });
        setCurOper(operType.default);
      }
    },
    [basicInfo, current, dispatch]
  );

  const failedToValidate = (step: operType) => {
    setCurOper(step);
  };

  useEffect(() => {
    if (userAndRegister) {
      history.push({
        pathname: '/user/register-result',
        state: { account: accountInfo.contactEmail }
      });
    }
  }, [accountInfo.contactEmail, userAndRegister]);

  const stepsProps = useMemo(() => {
    return {
      curOper,
      basicInfo,
      failedToValidate,
      afterValidate: (value: any, step: any) => afterValidate(value, step)
    };
  }, [afterValidate, basicInfo, curOper]);

  return (
    <div className={styles.main}>
      <h3>{Intl.formatMessage('BASS_REGISTER')}</h3>
      <Steps className={styles.step} current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {current > 0 ? <StepTwo {...stepsProps} /> : <StepOne {...stepsProps} />}
      <div className={styles.operate}>
        {current === 0 && (
          <Button size="large" className={styles.next} type="primary" onClick={next}>
            {Intl.formatMessage('BASS_CONTRACT_NEXT_STEP')}
          </Button>
        )}
        {current === 1 && (
          <Button size="large" className={styles.prev} onClick={prev}>
            {Intl.formatMessage('BASS_CONTRACT_NEXT_STEP')}
          </Button>
        )}
        {current === 1 && (
          <Button size="large" loading={submitting} className={styles.submit} type="primary" onClick={register}>
            {Intl.formatMessage('BASS_REGISTER')}
          </Button>
        )}
        <Link className={styles.login} to="/user/login">
          {Intl.formatMessage('BASS_REGISTER_SING_IN_WITH_AN_EXISTING_ACCOUNT')}
        </Link>
      </div>
    </div>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  submitting: loading.effects['User/register']
}))(Register);
