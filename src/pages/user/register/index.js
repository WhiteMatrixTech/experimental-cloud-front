import { Button, Steps } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, history } from 'umi';
import StepOne from './_step1';
import StepTwo from './_step2';
import styles from './index.less';

const { Step } = Steps;
const steps = [
  {
    title: '基本信息',
  },
  {
    title: '账户密码',
  },
];

const operType = { default: 'default', next: 'next', submit: 'submit' };

const Register = (props) => {
  const [curOper, setCurOper] = useState(operType.default);
  const [basicInfo, setBasicInfo] = useState({});
  const [accountInfo, setAccountInfo] = useState({});
  const [current, setCurrent] = useState(0);

  const { submitting, dispatch, User } = props;
  const { userAndregister } = User;

  const next = () => {
    setCurOper(operType.next);
  };

  const prev = () => {
    setCurOper(operType.default);
    setCurrent(current - 1);
  };

  const register = () => {
    setCurOper(operType.submit);
  }

  const cacheBasicInfo = basicInfo => {
    setBasicInfo(basicInfo);
  }

  const afterValidate = (value, step) => {
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
        re_pass: value.confirm,
      };
      dispatch({
        type: 'User/register',
        payload: params,
      });
      setCurOper(operType.default);
    }
  }

  const failedToValidate = step => {
    setCurOper(step);
  }

  useEffect(() => {
    if (userAndregister) {
      history.push({
        pathname: '/user/register-result',
        state: { account: accountInfo.contactEmail },
      });
    }
  }, [userAndregister]);

  const stepsProps = {
    curOper,
    basicInfo,
    operType,
    failedToValidate,
    afterValidate: (value, step) => afterValidate(value, step),
  }

  return (
    <div className={styles.main}>
      <h3>
        注册
      </h3>
      <Steps className={styles.step} current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {current > 0 ? <StepTwo {...stepsProps} /> : <StepOne {...stepsProps} />}
      <div className={styles.operate}>
        {current === 0 &&
          <Button
            size="large"
            className={styles.next}
            type="primary"
            onClick={next}
          >下一步</Button>}
        {current === 1 && <Button
          size="large"
          className={styles.prev}
          onClick={prev}
        >
          上一步
        </Button>}
        {current === 1 && <Button
          size="large"
          loading={submitting}
          className={styles.submit}
          type="primary"
          onClick={register}
        >
          注册
        </Button>}
        <Link className={styles.login} to="/user/login">
          使用已有账户登录
          </Link>
      </div>
    </div>
  );
};

export default connect(({ User, loading }) => ({
  User,
  submitting: loading.effects['User/register'],
}))(Register);
