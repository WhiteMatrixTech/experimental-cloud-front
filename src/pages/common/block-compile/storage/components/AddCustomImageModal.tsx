import React from 'react';
import { Button, Form, Input, Modal, notification, Select } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import { ImageTypeForForm } from '../_config';
import { Intl } from '~/utils/locales';

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
        const res = await dispatch({
          type: 'CustomImage/addCustomImage',
          payload: params
        });
        const { statusCode, result } = res;
        if (statusCode === 'ok' && result.status) {
          onCancel();
          notification.success({
            message: Intl.formatMessage('BASS_NOTIFICATION_CUSTOM_IMAGE_ADD_SUCCESS'),
            top: 64,
            duration: 3
          });
        } else {
          notification.error({
            message: result.message || Intl.formatMessage('BASS_NOTIFICATION_CUSTOM_IMAGE_ADD_FAILED'),
            top: 64,
            duration: 3
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
    title: Intl.formatMessage('BASS_CUSTOM_IMAGE_ADD'),
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={configLoading}>
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form layout="vertical" form={form}>
        <Item
          label={Intl.formatMessage('BASS_CUSTOM_IMAGE_ADDRESS')}
          name="imageUrl"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_ADDRESS')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_ADDRESS')} />
        </Item>
        <Item
          name="imageType"
          initialValue={null}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CUSTOM_IMAGE_SELECT_TYPE')
            }
          ]}>
          <Select
            allowClear
            placeholder={Intl.formatMessage('BASS_CUSTOM_IMAGE_SELECT_TYPE')}
            options={imageOptions}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </Item>
        <Item label={Intl.formatMessage('BASS_CUSTOM_IMAGE_VOUCHERS')}>
          <Input.Group compact>
            <Item
              name="username"
              initialValue=""
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_INPUT_USERNAME')
                }
              ]}>
              <Input placeholder={Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_USER_NAME')} />
            </Item>
            <Item
              name="password"
              initialValue=""
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_PASSWORD')
                }
              ]}>
              <Input placeholder={Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_PASSWORD')} />
            </Item>
            <Item
              name="registryServer"
              initialValue=""
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_REGISTER_SERVER')
                }
              ]}>
              <Input placeholder={Intl.formatMessage('BASS_CUSTOM_IMAGE_INPUT_REGISTER_SERVER')} />
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
