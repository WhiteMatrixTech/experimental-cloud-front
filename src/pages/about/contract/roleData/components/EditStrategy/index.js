import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal } from 'antd';

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

function EditStrategy(props) {
  const {
    visible,
    editParams = {},
    onCancel,
    getPageListOfRoleData,
    operateType,
    dispatch,
    addLoading = false,
  } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params = values;
        form.setFieldsValue(values);
        if (operateType === 'new') {
          dispatch({
            type: 'Contract/createAndUpdateStrategy',
            payload: params,
          }).then((res) => {
            if (res) {
              onCancel();
              getPageListOfRoleData();
            }
          });
          dispatch({
            type: 'Contract/getRoleDateTotalDocs',
            payload: '',
          });
        } else {
          params = {
            strategyName: editParams.strategyName,
            ...editParams,
            ...params,
          };
          dispatch({
            type: 'Contract/modifyAndUpdateStrategy',
            payload: params,
          }).then((res) => {
            if (res) {
              onCancel();
              getPageListOfRoleData();
            }
          });
          dispatch({
            type: 'Contract/getRoleDateTotalDocs',
            payload: '',
          });
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
    title: `${operateType === 'new' ? '新增' : '修改'}隐私保护策略`,
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" onClick={handleSubmit} type="primary" loading={addLoading}>
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="策略名称"
          name="strategyName"
          initialValue={editParams.strategyName || ''}
          rules={[
            {
              required: true,
              message: '请输入隐私保护策略名称',
            },
            {
              min: 1,
              max: 50,
              type: 'string',
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/,
              message: '策略名必须由1-50位数字英文字母与汉字组合',
            },
          ]}
        >
          {operateType === 'new' ? (
            <Input placeholder="请输入隐私保护策略名称" />
          ) : (
            <Input disabled={true} placeholder="请输入隐私保护策略名称" />
          )}
        </Item>
        <Item
          label="状态"
          name="strategyStatus"
          initialValue={editParams.strategyStatus}
          rules={[
            {
              required: true,
              message: '请选择隐私保护策略状态',
            },
          ]}
        >
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder="请选择隐私保护策略状态"
          >
            <Option value={0}>停用</Option>
            <Option value={1}>启用</Option>
          </Select>
        </Item>
        <Item
          label="策略描述"
          name="strategyDesc"
          initialValue={editParams.strategyDesc || ''}
          rules={[
            {
              required: true,
              message: '请填写策略描述',
            },
            {
              min: 1,
              max: 100,
              type: 'string',
              message: '隐私保护策略描述不能超过100字符',
            },
          ]}
        >
          <TextArea rows={3} placeholder="请填写策略描述" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Contract, loading }) => ({
  Contract,
  addLoading: loading.effects['Contract/createAndUpdateStrategy'],
}))(EditStrategy);
