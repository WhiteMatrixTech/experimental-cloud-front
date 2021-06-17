import React, { useState, useEffect } from 'react';
import { ConnectState } from '~/models/connect';
import { Button, Form, Input, Modal, notification, Radio, Select } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import styles from './OneKeyCompile.less';
import { Intl } from '~/utils/locales';

const { Item } = Form;

export type OneKeyCompileProps = {
  visible: boolean;
  configLoading: boolean;
  onCancel: () => void;
  dispatch: Dispatch;
  User: ConnectState['User'];
  BlockChainCompile: ConnectState['BlockChainCompile'];
};

const OneKeyCompile: React.FC<OneKeyCompileProps> = (props) => {
  const { visible, onCancel, configLoading = false, dispatch, BlockChainCompile } = props;
  const { compileImageList } = BlockChainCompile;

  const [imageType, setImageType] = useState('system');
  const [form] = Form.useForm();

  const imageOptions = compileImageList.map((image) => {
    return { labe: image.name, value: image.url };
  });

  const onChangeBuildEnvImageInputType = (e: any) => {
    setImageType(e.target.value);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { username, password, registryServer, buildCommands, buildEnvImageInputType, ...rest } = values;
        const splitBuildCommands = buildCommands.split('\n');
        const params = {
          ...rest,
          buildCommands: splitBuildCommands,
          credential: { username, password, registryServer }
        };
        const res = await dispatch({
          type: 'BlockChainCompile/oneKeyCompile',
          payload: params
        });
        const { statusCode, result } = res;
        if (statusCode === 'ok') {
          onCancel();
          notification.success({
            message: result.message || Intl.formatMessage('BASS_NOTIFICATION_COMPILATION_SUCCESS'),
            top: 64,
            duration: 3
          });
        } else {
          notification.error({
            message: result.message || Intl.formatMessage('BASS_NOTIFICATION_COMPILATION_FAILED'),
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
    title: Intl.formatMessage('BASS_ONE_KEY_COMPILE'),
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

  useEffect(() => {
    dispatch({
      type: 'BlockChainCompile/getCompileImageList',
      payload: {}
    });
  }, [dispatch]);

  return (
    <Modal {...drawerProps}>
      <Form layout="vertical" form={form}>
        <Item
          label={Intl.formatMessage('BASS_ONE_KEY_COMPILE_RESPOSITORY_ADDRESS')}
          name="gitRepoUrl"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ONE_KEY_COMPILE_INPUT_RESPOSITORY_ADDRESS')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ONE_KEY_COMPILE_INPUT_RESPOSITORY_ADDRESS')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ONE_KEY_COMPILE_BRANCH_NAME')}
          name="branch"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ONE_KEY_COMPILE_INPUT_BRANCH_NAME')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_ONE_KEY_COMPILE_INPUT_BRANCH_NAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_ONE_KEY_COMPILE_IMAGE')}
          name="buildEnvImageInputType"
          initialValue="system">
          <Radio.Group className={styles['radio-group']} onChange={onChangeBuildEnvImageInputType}>
            <Radio className={styles.radio} value="system">
              {Intl.formatMessage('BASS_ONE_KEY_COMPILE_SYSTEM_IMAGE')}
            </Radio>
            <Radio className={styles.radio} value="custom">
              {Intl.formatMessage('BASS_ONE_KEY_COMPILE_CUSTOM')}
            </Radio>
          </Radio.Group>
        </Item>
        {imageType === 'system' && (
          <Item
            name="buildEnvImage"
            initialValue={null}
            rules={[
              {
                required: true,
                message: Intl.formatMessage('BASS_ONE_KEY_COMPILE_PLEASE_SELECT_COMPILE_IMAGE')
              }
            ]}>
            <Select
              allowClear
              placeholder={Intl.formatMessage('BASS_ONE_KEY_COMPILE_SELECT_COMPILE_IMAGE')}
              options={imageOptions}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Item>
        )}
        {imageType === 'custom' && (
          <Item
            name="buildEnvImage"
            initialValue=""
            rules={[
              {
                required: true,
                message: Intl.formatMessage('BASS_ONE_KEY_COMPILE_INPUT_CUSTOM_IMAGE_ADDRESS')
              }
            ]}>
            <Input placeholder={Intl.formatMessage('BASS_ONE_KEY_COMPILE_INPUT_CUSTOM_IMAGE_ADDRESS')} />
          </Item>
        )}
        <Item
          label={Intl.formatMessage('BASS_ONE_KEY_COMPILE_COMMANDS')}
          name="buildCommands"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_ONE_KEY_INPUT_COMPILE_COMMANDS')
            }
          ]}>
          <Input.TextArea
            rows={5}
            placeholder={`${Intl.formatMessage('BASS_ONE_KEY_COMPILE_ENTER_COMMAND')},${Intl.formatMessage(
              'BASS_ONE_KEY_COMPILE_LINE_BREAK'
            )}`}
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
                  message: Intl.formatMessage('BASS_USER_INFO_INPUT_USER_NAME')
                }
              ]}>
              <Input placeholder={Intl.formatMessage('BASS_USER_INFO_INPUT_USER_NAME')} />
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

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  configLoading: loading.effects['BlockChainCompile/oneKeyCompile']
}))(OneKeyCompile);
