import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { Input, Select, Form, Radio, Button } from 'antd';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import style from './index.less';

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

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/contract', false)
breadCrumbItem.push({
  menuName: "合约调用",
  menuHref: `/`,
})

function CallTransfer(props) {
  const [form] = Form.useForm()
  const [invokeTypeAvaliable, setInvokeTypeAvaliable] = useState(false)
  const [invokeType, setInvokeType] = useState(null)

  // 通道改变时，获取通道下的合约
  const onChannelChange = () => {

  }

  // 调用类型改变
  const onInvokeTypeChange = e => {
    setInvokeType(e.target.value)
  }

  // 表单域改变
  const onFieldsChange = (changedFields, allFields) => {
    const validFields = allFields.slice(0, 4)
    if (validFields.every(item => (item.value !== null) && (item.value !== ''))) {
      setInvokeTypeAvaliable(true)
    } else {
      setInvokeTypeAvaliable(false)
      setInvokeType(null)
    }
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields();
      form.setFieldsValue(values)

    }).catch(info => {
      console.log('校验失败:', info);
    });
  }

  return (
    <div className='page-wrapper'>
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className='page-content page-content-shadow'>
        <div className={style['call-contract-wrapper']}>
          <div className={style['call-condition']}>
            <h3 className={style.title}>调用条件</h3>
            <Form {...formItemLayout} form={form} onFieldsChange={onFieldsChange}>
              <Item label='所属通道' name='channelId' initialValue={null} rules={[
                {
                  required: true,
                  message: '请选择通道',
                },
              ]}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择通道'
                  onChange={onChannelChange}
                >
                  <Option value='aaa'>aaa</Option>
                </Select>
              </Item>
              <Item label='选择合约' name='chainCodeId' initialValue={null} rules={[
                {
                  required: true,
                  message: '请选择合约',
                },
              ]}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择合约'
                >
                  <Option value='aaa'>aaa</Option>
                </Select>
              </Item>
              <Item label='方法名' name='method' initialValue='' rules={[
                {
                  required: true,
                  message: '请输入方法名',
                }
              ]}>
                <Input placeholder='请输入方法名' />
              </Item>
              <Item label='参数列表' name='args' initialValue='' rules={[
                {
                  required: true,
                  message: '请输入参数列表',
                }
              ]}>
                <Input placeholder='请输入参数列表' />
              </Item>
              <Item label='调用类型' name='invokeType' initialValue='' rules={[
                {
                  required: true,
                  message: '请选择调用类型',
                }
              ]}>
                <Radio.Group onChange={onInvokeTypeChange}>
                  <Radio.Button value='invoke' disabled={!invokeTypeAvaliable}>invoke</Radio.Button>
                  <Radio.Button value='query' disabled={!invokeTypeAvaliable}>query</Radio.Button>
                </Radio.Group>
                {invokeType === 'invoke' && <Button className={style['invoke-button']} type='primary'>调用</Button>}
                {invokeType === 'query' && <Button className={style['invoke-button']} type='primary'>查询</Button>}
              </Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(({ Contract, loading }) => ({
  Contract,
  qryLoading: loading.effects['Contract/deployContract']
}))(CallTransfer);
