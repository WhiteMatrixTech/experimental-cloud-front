import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { DidSchema, Dispatch } from 'umi';

const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};
export interface CreateDIDModalProps {
  visible: boolean;
  onCancel: () => void;
  record: DidSchema;
  addLoading: boolean;
  User: ConnectState['User'];
  dispatch: Dispatch;
  getDidList: () => void;
}
function CreateDIDModal(props: CreateDIDModalProps) {
  const { visible, onCancel, record, addLoading = false, User, dispatch } = props;
  const { networkName } = User;

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = {
          loginName: values.didName,
          additionalAttr: values.additionalAttr,
          role: values.role,
          networkName
        };
        let res = null;
        if (record) {
          res = await dispatch({
            type: 'DID/modifyDID',
            payload: params
          });
        } else {
          res = await dispatch({
            type: 'DID/createDID',
            payload: params
          });
        }
        if (res) {
          onCancel();
          props.getDidList();
        }
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const checkJSON = (_: any, value: string) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      return promise.reject('请输入附加信息');
    } // 有值的情况

    try {
      const json = JSON.parse(value);
    } catch (e) {
      return promise.reject('请输入json');
    }
    return promise.resolve();
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: record ? '修改DID用户' : '新增DID用户',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={addLoading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="DID名称"
          name="didName"
          tooltip="用户名"
          initialValue={record && record.idName}
          rules={[
            {
              required: true,
              message: '请输入DID名称'
            }
          ]}>
          <Input placeholder="请输入DID名称" />
        </Item>
        <Item
          label="DID角色"
          name="role"
          initialValue={record ? record.role : null}
          rules={[
            {
              required: true,
              message: '请输入DID用户角色'
            }
          ]}>
          <Input placeholder="请输入DID用户角色" />
        </Item>
        <Item
          required
          label="附加信息"
          name="additionalAttr"
          initialValue={record ? record.additionalAttributes : ''}
          tooltip="其他详细信息，例如公司的地址、联系人等; 以JSON格式录入"
          rules={[
            {
              validateTrigger: 'submit',
              validator: checkJSON
            }
          ]}>
          <TextArea placeholder="请输入JSON格式的附加信息" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, DID, Organization, loading }: ConnectState) => ({
  User,
  DID,
  Organization,
  addLoading: loading.effects['DID/createDID'] || loading.effects['DID/modifyDID']
}))(CreateDIDModal);
