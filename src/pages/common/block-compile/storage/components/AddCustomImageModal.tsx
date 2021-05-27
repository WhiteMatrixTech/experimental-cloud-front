import React from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { ImageTypeForForm } from '../_config';

const { Item } = Form;

interface AddCustomImageModalProps {
  visible: boolean;
  onCancel: () => void;
  dispatch: Dispatch;
  configLoading: boolean;
  CustomImage: ConnectState['CustomImage'];
}
const AddCustomImageModal: React.FC<AddCustomImageModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, onCancel, dispatch, configLoading = false } = props;

  const imageOptions = ImageTypeForForm.map((image) => {
    return { labe: image.imageType, value: image.value };
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { imageUrl, imageType, username, password, registryServer } = values;
        const credential = { username, password, registryServer };
        const params = {
          imageUrl,
          imageType,
          credential
        };
        const res = dispatch({
          type: 'CustomImage/addCustomImage',
          payload: params
        });
        if (res) {
          onCancel();
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
    title: '添加镜像',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={configLoading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form layout="vertical" form={form}>
        <Item
          label="镜像地址"
          name="imageUrl"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入镜像地址'
            }
          ]}>
          <Input placeholder="输入镜像地址" />
        </Item>
        <Item
          name="imageType"
          initialValue={null}
          rules={[
            {
              required: true,
              message: '请选择镜像类型'
            }
          ]}>
          <Select
            allowClear
            placeholder="选择镜像类型"
            options={imageOptions}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </Item>
        <Item label="编译凭证">
          <Input.Group compact>
            <Item
              name="username"
              initialValue=""
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: '请输入用户名'
                }
              ]}>
              <Input placeholder="输入用户名" />
            </Item>
            <Item
              name="password"
              initialValue=""
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: '请输入密码'
                }
              ]}>
              <Input placeholder="输入密码" />
            </Item>
            <Item
              name="registryServer"
              initialValue=""
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: '请输入注册服务器'
                }
              ]}>
              <Input placeholder="输入注册服务器" />
            </Item>
          </Input.Group>
        </Item>
      </Form>
    </Modal>
  );
};
export default connect(({ CustomImage, loading }: ConnectState) => ({
  CustomImage,
  configLoading: loading.effects['BlockChainCompile/oneKeyCompile']
}))(AddCustomImageModal);
