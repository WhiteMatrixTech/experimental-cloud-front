import React, { useState, useEffect } from 'react';
import { ConnectState } from '~/models/connect';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import styles from './OneKeyCompile.less';

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
        const res = dispatch({
          type: 'BlockChainCompile/oneKeyCompile',
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
    title: '一键编译',
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
          label="仓库地址"
          name="gitRepoUrl"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入仓库地址'
            }
          ]}>
          <Input placeholder="输入仓库地址" />
        </Item>
        <Item
          label="分支名"
          name="branch"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入分支名'
            }
          ]}>
          <Input placeholder="输入分支名" />
        </Item>
        <Item label="编译镜像" name="buildEnvImageInputType" initialValue="system">
          <Radio.Group className={styles['radio-group']} onChange={onChangeBuildEnvImageInputType}>
            <Radio className={styles.radio} value="system">
              系统镜像
            </Radio>
            <Radio className={styles.radio} value="custom">
              自定义
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
                message: '请选择编译镜像'
              }
            ]}>
            <Select
              allowClear
              placeholder="选择编译镜像"
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
                message: '请输入编译镜像地址'
              }
            ]}>
            <Input placeholder="输入编译镜像地址" />
          </Item>
        )}
        <Item
          label="编译命令"
          name="buildCommands"
          initialValue=""
          rules={[
            {
              required: true,
              message: '请输入编译命令'
            }
          ]}>
          <Input.TextArea rows={5} placeholder="输入编译命令，换行分割" />
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

export default connect(({ User, BlockChainCompile, loading }: ConnectState) => ({
  User,
  BlockChainCompile,
  configLoading: loading.effects['BlockChainCompile/oneKeyCompile']
}))(OneKeyCompile);
