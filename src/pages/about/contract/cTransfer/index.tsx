import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Radio, Switch, Button } from 'antd';
import { Breadcrumb } from '@/components';
import { MenuList, getCurBreadcrumb } from '@/utils/menu';
import style from './index.less';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'umi';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  colon: false,
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false);
breadCrumbItem.push({
  menuName: '合约调用',
  menuHref: `/`,
});
export interface CallTransferProps {
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  dispatch: Dispatch;
}
function CallTransfer(props: CallTransferProps) {
  const { Contract, User, dispatch } = props;
  const { channelList } = Contract;
  const { networkName } = User;

  const [form] = Form.useForm();
  const [invokeTypeAvailable, setInvokeTypeAvailable] = useState(false);
  const [invokeType, setInvokeType] = useState(null);

  // 通道改变时，获取通道下的合约
  const onChannelChange = () => {};

  // 调用类型改变
  const onInvokeTypeChange = (e: any) => {
    setInvokeType(e.target.value);
  };

  // 表单域改变
  const onFieldsChange = (changedFields: any, allFields: any) => {
    const validFields = allFields.slice(0, 4);
    if (validFields.every((item: { value: string }) => item.value !== null && item.value !== '')) {
      setInvokeTypeAvailable(true);
    } else {
      setInvokeTypeAvailable(false);
      setInvokeType(null);
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        form.resetFields();
        form.setFieldsValue(values);
      })
      .catch((info: any) => {
        console.log('校验失败:', info);
      });
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName },
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow">
        <div className={style['call-contract-wrapper']}>
          <div className={style['call-condition']}>
            <h3 className={style.title}>调用条件</h3>
            <Form {...formItemLayout} form={form} onFieldsChange={onFieldsChange}>
              <Item
                label="所属通道"
                name="channelId"
                initialValue={null}
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
                  onChange={onChannelChange}
                >
                  {channelList.map((item) => (
                    <Option key={item.channelId} value={item.channelId}>
                      {item.channelId}
                    </Option>
                  ))}
                </Select>
              </Item>
              <Item
                label="选择合约"
                name="chainCodeName"
                initialValue={null}
                rules={[
                  {
                    required: true,
                    message: '请选择合约',
                  },
                ]}
              >
                <Select
                  allowClear
                  getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
                  placeholder="请选择合约"
                >
                  <Option value="aaa">aaa</Option>
                </Select>
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
              <Item
                label="调用类型"
                name="invokeType"
                initialValue={null}
                rules={[
                  {
                    required: true,
                    message: '请选择调用类型',
                  },
                ]}
              >
                <Radio.Group onChange={onInvokeTypeChange}>
                  <Radio.Button value="invoke" disabled={!invokeTypeAvailable}>
                    invoke
                  </Radio.Button>
                  <Radio.Button value="query" disabled={!invokeTypeAvailable}>
                    query
                  </Radio.Button>
                </Radio.Group>
                {invokeType === 'invoke' && (
                  <Button className={style['invoke-button']} type="primary">
                    调用
                  </Button>
                )}
                {invokeType === 'query' && (
                  <Button className={style['invoke-button']} type="primary">
                    查询
                  </Button>
                )}
              </Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(({ User, Contract, loading }: ConnectState) => ({
  User,
  Contract,
  qryLoading: loading.effects['Contract/deployContract'],
}))(CallTransfer);
