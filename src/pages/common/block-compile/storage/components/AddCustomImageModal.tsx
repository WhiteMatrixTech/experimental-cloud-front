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
  loading: boolean;
  CustomImage: ConnectState['CustomImage'];
}
const AddCustomImageModal: React.FC<AddCustomImageModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, onCancel, dispatch, loading = false } = props;

  const imageOptions = ImageTypeForForm.map((image) => {
    return { labe: image.imageType, value: image.value };
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await dispatch({
          type: 'CustomImage/addCustomImage',
          payload: values
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
      <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form layout="vertical" form={form}>
        <Item
          label="镜像名称"
          name="name"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入镜像名称'
            }
          ]}>
          <Input placeholder="输入镜像名称" />
        </Item>
        <Item
          label="镜像类型"
          name="type"
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
        <Item
          label="镜像版本"
          name="version"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入镜像版本'
            }
          ]}>
          <Input type="number" step={0.1} placeholder="请输入镜像版本" />
        </Item>
      </Form>
    </Modal>
  );
};
export default connect(({ CustomImage, loading }: ConnectState) => ({
  CustomImage,
  loading: loading.effects['CustomImage/addCustomImage']
}))(AddCustomImageModal);
