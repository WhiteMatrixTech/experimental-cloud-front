import React, { useEffect } from 'react';
import { connect } from 'dva';
import ReactJson from 'react-json-view';
import { Input, Descriptions, Select, Form, Switch, Button, Modal, Radio, Divider, notification } from 'antd';
import { ChainCodeSchema, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};
export interface InvokeContractProps {
  visible: boolean;
  editParams: ChainCodeSchema | undefined;
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
        payload: params
      });
    });
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName }
    });
    dispatch({
      type: 'Contract/getAllUserId',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: Intl.formatMessage('BASS_CONTRACT_CALL_CONTRACT'),
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" loading={invokeLoading} onClick={handleSubmit} type="primary">
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label={Intl.formatMessage('BASS_COMMON_CHANNEL')}
          name="channelId"
          initialValue={editParams && editParams.channelId}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')}
            disabled>
            {channelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_NAME')}
          name="chainCodeName"
          initialValue={editParams && editParams.chainCodeName}>
          <Input placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_CONTRACT_NAME')} disabled />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_METHOD_NAME')}
          name="methodName"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_INPUT_METHOD_NAME')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_METHOD_NAME')} />
        </Item>
        <Item label={Intl.formatMessage('BASS_CONTRACT_PARAMETER_LIST')} name="params" initialValue={[]}>
          <Select
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_PARAMETER_LIST')}
            mode="tags"
            allowClear></Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_CALL_TYPE')}
          name="invokeType"
          initialValue="invokeChainCodeMethod"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_SELECT_CALL_TYPE')
            }
          ]}>
          <Radio.Group>
            <Radio value="invokeChainCodeMethod">invoke</Radio>
            <Radio value="queryChainCodeMethod">query</Radio>
          </Radio.Group>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_FABRIC_ROLE')}
          name="userId"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_SELECT_FABRIC_ROLE')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_CONTRACT_SELECT_FABRIC_ROLE')}>
            {allUserId.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_INITIALISE_OR_NOT')}
          name="isInit"
          initialValue={true}
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_SELECT_INITIALISE_OR_NOT')
            }
          ]}>
          <Switch />
        </Item>
      </Form>
      {invokeResult && (
        <div>
          <Divider />
          <Descriptions bordered column={1} title="">
            <Descriptions.Item label={Intl.formatMessage('BASS_CONTRACT_CALL_RESULT')}>
              {invokeResult.status}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                invokeResult.status === 'Failed'
                  ? Intl.formatMessage('BASS_CONTRACT_FAILURE_REASON')
                  : Intl.formatMessage('BASS_CONTRACT_RETURN_DATA')
              }>
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
  invokeLoading: loading.effects['Contract/invokeChainCodeMethod'] || loading.effects['Contract/queryChainCodeMethod']
}))(InvokeContract);
