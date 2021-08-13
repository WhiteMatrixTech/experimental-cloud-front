import React, { useMemo, useEffect } from 'react';
import { Button, Form, Select, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch, LeagueSchema } from 'umi';
import { ConnectState } from '~/models/connect';
import { getDifferenceSet } from '~/utils';

const { Item } = Form;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

export type JoinLeagueProps = {
  joinLoading: boolean;
  dispatch: Dispatch;
  visible: boolean;
  User: ConnectState['User'];
  onCancel: (callback: boolean) => void;
};

const JoinLeague: React.FC<JoinLeagueProps> = (props) => {
  const { dispatch, visible, onCancel, User, joinLoading = false } = props;
  const { networkList, myNetworkList } = User;
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'User/getNetworkList',
      payload: {}
    });
    dispatch({
      type: 'User/getMyNetworkList',
      payload: {}
    });
  }, [dispatch])

  const getOptionalNetwork: LeagueSchema[] = useMemo(() => {
    return getDifferenceSet(networkList, myNetworkList, 'networkName');
  }, [networkList, myNetworkList]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await dispatch({
          type: 'User/enrollInLeague',
          payload: {
            networkName: values.networkName,
            role: 'networkAssociateMember'
          }
        });
        if (res) {
          onCancel(true);
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '加入联盟',
    onCancel: () => onCancel(false),
    footer: [
      <Button key="cancel" onClick={() => onCancel(false)}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={joinLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="联盟名称"
          name="leagueName"
          rules={[
            {
              required: true,
              message: '请选择联盟名称',
            },
          ]}
        >
          <Select allowClear getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择联盟名称">
            {getOptionalNetwork.map((league) => (
              <Option key={league.leagueName} value={league.leagueName}>
                {league.leagueName}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  joinLoading: loading.effects['User/enrollInLeague'],
}))(JoinLeague);
