import React, { useEffect } from 'react';
import { connect } from 'dva';
import ReactJson from 'react-json-view';
import { Input, Descriptions, Select, Form, Switch, Button, Modal, Radio, Divider } from 'antd';
import { ChainCodeSchema, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';

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
export interface InvokeContractProps {
  visible: boolean;
  editParams: ChainCodeSchema;
  onCancel: () => void;
  dispatch: Dispatch;
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  invokeLoading: boolean;
}
function InvokeContract(props: InvokeContractProps) {
  const [form] = Form.useForm();
  const { visible, editParams, onCancel, dispatch, Contract, User, invokeLoading = false } = props;
  const { channelList, allUserId, invokeResult } = Contract;
  const { networkName } = User;

  const handleSubmit = () => {
    form.validateFields().then((values: any) => {
      values.networkName = networkName;
      const { invokeType, ...params } = values;
      dispatch({
        type: `Contract/${invokeType}`,
        payload: params,
      });
    });
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName },
    });
    dispatch({
      type: 'Contract/getAllUserId',
      payload: { networkName },
    });
  }, []);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '调用合约',
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={invokeLoading} onClick={handleSubmit} type="primary">
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="所属通道"
          name="channelId"
          initialValue={editParams.channelId}
          rules={[
            {
              required: true,
              message: '请选择通道',
            },
          ]}
        >
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请选择通道"
            disabled
          >
            {channelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="合约名称" name="chainCodeName" initialValue={editParams.chainCodeName}>
          <Input placeholder="请输入合约名称" disabled />
        </Item>
        <Item
          label="方法名"
          name="methodName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入方法名',
            },
          ]}
        >
          <Input placeholder="请输入方法名" />
        </Item>
        <Item label="参数列表" name="params" initialValue={[]}>
          <Select
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请输入参数"
            mode="tags"
            allowClear
          ></Select>
        </Item>
        <Item
          label="调用类型"
          name="invokeType"
          initialValue="invokeChainCodeMethod"
          rules={[
            {
              required: true,
              message: '请选择调用类型',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="invokeChainCodeMethod">invoke</Radio>
            <Radio value="queryChainCodeMethod">query</Radio>
          </Radio.Group>
        </Item>
        <Item
          label="Fabric角色"
          name="userId"
          initialValue={editParams.userId}
          rules={[
            {
              required: true,
              message: '请选择fabric角色',
            },
          ]}
        >
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请选择fabric角色"
          >
            {allUserId.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="是否初始化"
          name="isInit"
          initialValue={true}
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: '请选择是否需要初始化',
            },
          ]}
        >
          <Switch />
        </Item>
      </Form>
      {invokeResult && (
        <div>
          <Divider />
          <Descriptions bordered column={1} title="">
            {/* //TODO:invokeResult  models中定义的null */}
            <Descriptions.Item label="合约调用结果">{invokeResult.status}</Descriptions.Item>
            <Descriptions.Item label={invokeResult.status === 'Failed' ? `失败原因` : `返回数据`}>
              <ReactJson name="" src={invokeResult.message} />
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
}

export default connect(({ Contract, User, loading }: ConnectState) => ({
  Contract,
  User,
  invokeLoading: loading.effects['Contract/invokeChainCodeMethod'] || loading.effects['Contract/queryChainCodeMethod'],
}))(InvokeContract);
