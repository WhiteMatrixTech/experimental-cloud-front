import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Checkbox, Button, Modal } from 'antd';
import style from './index.less';
import { ConnectState } from '@/models/connect';
import { Dispatch, Effect } from 'umi';

export interface ConfigStrategyProps {
  User: ConnectState['User'];
  visible: boolean;
  editParams: any;
  onCancel: any;
  getPageListOPrivacyStrategy: Effect;
  dispatch: Dispatch;
  configLoading: boolean;
  PrivacyStrategy: ConnectState['PrivacyStrategy'];
}
function ConfigStrategy(props: ConfigStrategyProps) {
  const {
    User,
    visible,
    editParams = {},
    onCancel,
    getPageListOPrivacyStrategy,
    dispatch,
    configLoading = false,
  } = props;
  const { networkName, leagueName } = User;
  const [initValue, setInitValue] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const { strategyMemberList } = props.PrivacyStrategy;

  const handleSubmit = () => {
    const params = {
      networkName,
      strategyName: editParams.strategyName,
      strategyMember: initValue,
    };
    dispatch({
      type: 'PrivacyStrategy/updateStrategyMember',
      payload: params,
    }).then((res) => {
      if (res) {
        onCancel();
        getPageListOPrivacyStrategy();
      }
    });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '配置策略',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={configLoading}>
        提交
      </Button>,
    ],
  };

  const onChange = (checkedValues: any) => {
    setInitValue(checkedValues);
  };

  //TODO:strategyMemberList来源于model.model里是空数组，so,item里面没有memberName属性
  const getValue = () => {
    let value = [];
    strategyMemberList.forEach((item) => {
      value.push(item.memberName);
    });
    setMemberList(value);
  };

  const getInitValue = () => {
    let value = [];
    strategyMemberList.forEach((item) => {
      if (item.checked) {
        value.push(item.memberName);
      }
    });
    setInitValue(value);
  };

  useEffect(() => {
    dispatch({
      type: 'PrivacyStrategy/getPageListOfRoleMember',
      payload: { networkName, strategyName: editParams.strategyName },
    });
  }, [dispatch]);

  useEffect(() => {
    getValue();
    getInitValue();
  }, [strategyMemberList]);

  return (
    <Modal {...drawerProps}>
      <div className={style.configWrapper}>
        <div className={style.leagueName}>{leagueName}</div>
        <div className={style.companyList}>
          <Checkbox.Group options={memberList} value={initValue} onChange={onChange} />
        </div>
      </div>
    </Modal>
  );
}

export default connect(({ User, PrivacyStrategy, loading }: ConnectState) => ({
  User,
  PrivacyStrategy,
  configLoading: loading.effects['PrivacyStrategy/updateStrategyMember'],
}))(ConfigStrategy);
