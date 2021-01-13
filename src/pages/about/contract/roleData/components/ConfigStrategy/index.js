import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Checkbox, Button, Modal } from 'antd';
import style from './index.less';

function ConfigStrategy(props) {
  const {
    User,
    visible,
    editParams = {},
    onCancel,
    getPageListOfRoleData,
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
        getPageListOfRoleData();
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

  const onChange = (checkedValues) => {
    setInitValue(checkedValues);
  };

  const getValue = () => {
    const value = [];
    strategyMemberList.forEach((item) => {
      value.push(item.memberName);
    });
    setMemberList(value);
  };

  const getInitValue = () => {
    const value = [];
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
  }, []);

  useEffect(() => {
    getValue();
    getInitValue();
  }, [strategyMemberList]);

  return (
    <Modal {...drawerProps}>
      <div className={style.configWrapper}>
        <div className={style.leagueName}>{leagueName}</div>
        <div className={style.compannyList}>
          <Checkbox.Group options={memberList} value={initValue} onChange={onChange} />
        </div>
      </div>
    </Modal>
  );
}

export default connect(({ User, PrivacyStrategy, loading }) => ({
  User,
  PrivacyStrategy,
  configLoading: loading.effects['PrivacyStrategy/updateStrategyMember'],
}))(ConfigStrategy);
