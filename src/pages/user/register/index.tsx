import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Steps } from 'antd';
import { Link, connect, history, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import StepOne from './_step1';
import StepTwo from './_step2';
import styles from './index.less';

const { Step } = Steps;
const steps = [
  {
    title: '基本信息'
  },
  {
    title: '账户密码'
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
        state: {
          register: true,
          account: accountInfo.contactEmail,
          tip: `你的账户：${accountInfo.contactEmail} 注册成功`,
        },
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
      <h3>注册</h3>
      <Steps className={styles.step} current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {current > 0 ? <StepTwo {...stepsProps} /> : <StepOne {...stepsProps} />}
      <div className={styles.operate}>
        {current === 0 && (
          <Button size="middle" className={styles.next} type="primary" onClick={next}>
            下一步
          </Button>
        )}
        {current === 1 && (
          <Button size="middle" className={styles.prev} onClick={prev}>
            上一步
          </Button>
        )}
        {current === 1 && (
          <Button size="middle" loading={submitting} className={styles.submit} type="primary" onClick={register}>
            注册
          </Button>
        )}
        <Link className={styles.login} to="/user/login">
          使用已有账户登录
        </Link>
      </div>
    </div>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  submitting: loading.effects['User/register']
}))(Register);
