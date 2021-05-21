import React from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Button, Result } from 'antd';
import { ConnectState } from '~/models/connect';
import { BasicComponentProps } from '~/utils/types';

const UnAuthorizedPage = (props: BasicComponentProps) => {
  const onClickBack = () => {
    props.dispatch({
      type: 'Layout/common',
      payload: { selectedMenu: '/about/league-dashboard' },
    });
    history.push('/');
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={onClickBack}>
          Back Home
        </Button>
      }
    />
  );
};

export default connect(({ Layout }: ConnectState) => ({ Layout }))(UnAuthorizedPage);
