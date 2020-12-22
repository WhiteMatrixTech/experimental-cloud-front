import React from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Modal } from 'antd';

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

function CreateLeague(props) {
  const { League } = props;

  const { visible, onCancel, addLoading = false } = props;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params = {
          networkVersion: '1.0.0',
          orgName: values.orgName,
          nodeName: values.peerName,
          nodeAliasName: values.peerAliasName
        };
        props.dispatch({
          type: 'League/createLeague',
          payload: params
        }).then(res => {
          if (res) {
            onCancel()
            props.getPeerList()
          }
        })
        form.setFieldsValue(values);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建联盟',
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
          label="联盟名称"
          name="leagueName"
          rules={[
            {
              required: true,
              message: '请输入联盟名称',
            },
          ]}
        >
          <Input placeholder="请输入联盟名称" />
        </Item>
        <Item
          label="添加成员"
          name="orgName"
        >
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder="请选择添加成员"
            mode="multiple"
          >
            <Option value='aaaa'>测试企业</Option>
            <Option value='bbbb'>国家企业</Option>
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ League, loading }) => ({
  League,
  addLoading: loading.effects['League/createLeague'],
}))(CreateLeague);
