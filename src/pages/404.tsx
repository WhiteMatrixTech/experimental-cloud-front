import React from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Button, Result } from 'antd';
import { ConnectState } from '~/models/connect';
import { BasicComponentProps } from '~/utils/types';

const NoFoundPage = (props: BasicComponentProps) => {
  const onClickBack = () => {
    props.dispatch({
      type: 'Layout/setCurrentService',
      payload: {
        selectedMenu: '/about/league-dashboard',
        currentService: '联盟总览'
      },
    });
    history.push('/');
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={onClickBack}>
          Back Home
        </Button>
      }
    />
  );
};

export default connect(({ Layout }: ConnectState) => ({ Layout }))(NoFoundPage);
