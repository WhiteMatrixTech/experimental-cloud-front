import React, { useEffect, useMemo, useCallback } from 'react';
import { connect } from 'dva';
import { Input, Descriptions, Select, Form, Switch, Button, Modal, Divider } from 'antd';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import style from './index.less';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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

const paramLayout = {
  labelCol: {
    sm: { span: 6 }
  }
};

export interface EvidenceOnChainProps {
  visible: boolean;
  onCancel: (res: any) => void;
  dispatch: Dispatch;
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  Channel: ConnectState['Channel'];
  invokeLoading: boolean;
}

function EvidenceOnChain(props: EvidenceOnChainProps) {
  const [form] = Form.useForm();
  const { visible, onCancel, dispatch, Contract, User, Channel, invokeLoading = false } = props;
  const { channelList, allUserId, invokeResult } = Contract;
  const { contractListOfChannel } = Channel;
  const { networkName } = User;

  const handleSubmit = () => {
    const { params, ...rest } = form.getFieldsValue();
    const paramLength = params?.length;
    const paramValueArray: any[] = [];
    if (paramLength) {
      for (let i = 0; i < paramLength; i++) {
        paramValueArray.push((document.getElementById(`param-${i + 1}`) as HTMLInputElement)?.value);
      }
    }
    form.validateFields().then(() => {
      dispatch({
        type: `Evidence/evidenceOnChain`,
        payload: {
          ...rest,
          params: paramValueArray,
          networkName
        }
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

  const resultMessage = useMemo(() => {
    if (invokeResult?.message?.result) {
      return <span className={style['invoke-success']}>{invokeResult?.message?.result}</span>;
    }
    if (invokeResult?.message?.payload) {
      return <span className={style['invoke-success']}>{invokeResult.message.payload}</span>;
    }
    return <span className={style['invoke-error']}>{invokeResult?.message?.error}</span>;
  }, [invokeResult]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '数据上链',
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={invokeLoading} onClick={handleSubmit} type="primary">
        提交
      </Button>
    ]
  };

  // 获取 通道下的合约
  const getContractListOfChannel = useCallback(
    (channelId: string) => {
      const params = {
        networkName,
        offset: 0,
        limit: 10000,
        ascend: false,
        channelId
      };
      dispatch({
        type: 'Channel/getContractListOfChannel',
        payload: params
      });
    },
    [dispatch, networkName]
  );

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="所属通道"
          name="channelId"
          rules={[
            {
              required: true,
              message: '请选择通道'
            }
          ]}>
          <Select<string>
            allowClear={false}
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请选择通道"
            onChange={(value) => {
              console.log(value);
              getContractListOfChannel(value);
            }}>
            {channelList.map((item) => (
              <Option key={item.name} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="合约名称"
          name="chainCodeName"
          rules={[
            {
              required: true,
              message: '请选择合约'
            }
          ]}>
          <Select<string>
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请选择合约">
            {contractListOfChannel.map((item) => (
              <Option key={item.chainCodeName} value={item.chainCodeName}>
                {item.chainCodeName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="方法名"
          name="methodName"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入方法名'
            }
          ]}>
          <Input placeholder="请输入方法名" />
        </Item>
        <Form.List {...paramLayout} name="params">
          {(fields: any[], { add, remove }: any, { errors }: any) => (
            <>
              <Form.Item label="参数列表">
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  添加参数
                </Button>
              </Form.Item>
              {fields.map((field, index) => (
                <Form.Item
                  style={{
                    marginBottom: '0px'
                  }}
                  label={`参数${index + 1}`}
                  required={false}
                  key={field.key}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                    <Input
                      id={`param-${index + 1}`}
                      style={{
                        width: 'calc(100% - 24px)',
                        marginRight: '10px'
                      }}
                    />
                    <MinusCircleOutlined
                      style={{
                        color: 'red'
                      }}
                      onClick={() => remove(field.name)}
                    />
                  </Form.Item>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>

        <Item
          label="Fabric角色"
          name="userId"
          rules={[
            {
              required: true,
              message: '请选择fabric角色'
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请选择fabric角色">
            {allUserId.map((item, index) => (
              <Option key={index} value={item.username}>
                {item.username}
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
              message: '请选择是否需要初始化'
            }
          ]}>
          <Switch />
        </Item>
      </Form>
      {invokeResult && (
        <div>
          <Divider />
          <Descriptions bordered column={1} title="">
            <Descriptions.Item label="合约调用结果">{invokeResult.status}</Descriptions.Item>
            <Descriptions.Item label={invokeResult.status === 'Failed' ? `失败原因` : `返回数据`}>
              {resultMessage}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
}

export default connect(({ Contract, Channel, User, loading }: ConnectState) => ({
  Contract,
  User,
  Channel,
  invokeLoading: loading.effects['Evidence/evidenceOnChain'],
  qryLoading: loading.effects['Channel/getContractListOfChannel']
}))(EvidenceOnChain);
