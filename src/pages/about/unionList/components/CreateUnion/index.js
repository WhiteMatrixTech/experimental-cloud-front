import React from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

function CreateUnion({ visible, editParams, onCancel, dispatch }) {

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields();
      form.setFieldsValue(values)
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建通道',
    onCancel: () => onCancel(),
    footer: [
      <Button key='cancel' onClick={onCancel}>
        取消
      </Button>,
      <Button key='submit' onClick={handleSubmit} type="primary">
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label='通道名称' name='channelName' initialValue='' rules={[
          {
            required: true,
            message: '请输入通道名称',
          },
          {
            min: 3,
            max: 19,
            type: 'string',
            pattern: /^[a-z][a-z0-9]{3,19}$/,
            message: '通道名称必须由4~20位数字与小写英文字母与组合,小写英文字母开头'
          }
        ]}>
          <Input placeholder='请输入通道名称' />
        </Item>
        <Item label='通道别名' name='channelAliasName' initialValue='' rules={[
          {
            required: true,
            message: '请输入通道别名',
          },
          {
            min: 3,
            max: 19,
            type: 'string',
            pattern: /^([\u4E00-\u9FA5]|[A-Za-z0-9]){1,50}$/,
            message: '通道别名必须由1~50位数字英文字母与汉字组合'
          }
        ]}>
          <Input placeholder='请输入通道别名' />
        </Item>
        <Item label='通道描述' name='channelDesc' initialValue='' rules={[
          {
            min: 0,
            max: 300,
            type: 'string',
            message: '通道描述由0~300个字符组成'
          }
        ]}>
          <TextArea rows={3} placeholder='请输入通道描述' />
        </Item>
        <Item label='集群' name='clusterName' initialValue={null} rules={[
          {
            required: true,
            message: '请选择集群',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择集群' >
            <Option value='aaa'>aaa</Option>
          </Select>
        </Item>
        <Item label='组织' name='firstOrg' initialValue={null} rules={[
          {
            required: true,
            message: '请选择组织',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择组织' >
            <Option value='第一组织'>第一组织</Option>
          </Select>
        </Item>
        <Item label='节点' name='firstNode' initialValue={null} rules={[
          {
            required: true,
            message: '请选择节点',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择节点' >
            <Option value='第一节点'>第一节点</Option>
          </Select>
        </Item>

        <Form.List name='orgAndPeer'>
          {(fields, { add, remove }) => (
            <>
              <Item label='动态添加'>
                <PlusOutlined onClick={() => add()} />
              </Item>
              {fields.map((field, index) => (
                <>
                  <div style={{ width: '100%', textAlign: 'right', marginBottom: '5px' }}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </div>
                  <Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                    }
                  >
                    {() => (
                      <Item
                        {...field}
                        label='组织'
                        name={[field.name, `org_${index}`]}
                        fieldKey={[field.fieldKey, `org_${index}`]}
                        rules={[{ required: true, message: '请选择组织' }]}
                      >
                        <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择组织'>
                          <Option value='组织aaa'>aaa</Option>
                        </Select>
                      </Item>
                    )}
                  </Item>
                  <Item
                    {...field}
                    label='节点'
                    name={[field.name, `peer_${index}`]}
                    fieldKey={[field.fieldKey, `peer_${index}`]}
                    rules={[{ required: true, message: '请选择节点' }]}
                  >
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择节点'>
                      <Option value='节点aaa'>aaa</Option>
                    </Select>
                  </Item>
                </>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default connect(({ Union, loading }) => ({
  Union,
  qryLoading: loading.effects['Union/addUnion']
}))(CreateUnion);
