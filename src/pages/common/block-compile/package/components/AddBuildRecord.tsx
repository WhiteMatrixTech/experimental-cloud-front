import React, { useState } from 'react';
import { ConnectState } from '~/models/connect';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import styles from './AddBuildRecord.less';
import { ImageTypeForForm } from '../../storage/_config';

const { Item } = Form;

export type AddBuildRecordProps = {
  visible: boolean;
  configLoading: boolean;
  onCancel: () => void;
  dispatch: Dispatch;
  User: ConnectState['User'];
};

const AddBuildRecord: React.FC<AddBuildRecordProps> = (props) => {
  const { visible, onCancel, configLoading = false, dispatch } = props;

  const [gitRepoType, setGitRepoType] = useState<'private' | 'public'>('public');
  const [form] = Form.useForm();
  const imageOptions = ImageTypeForForm.map((image) => {
    return { labe: image.imageType, value: image.value };
  });

  const onChangeGitRepoType = (e: any) => {
    setGitRepoType(e.target.value);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await dispatch({
          type: 'BlockChainCompile/addBuildRecord',
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

  return (
    <Modal {...drawerProps}>
      <Form layout="vertical" form={form}>
        <Item
          label="git仓库地址"
          name="gitRepo"
          rules={[
            {
              required: true,
              message: '请输入git仓库地址'
            }
          ]}>
          <Input placeholder="输入git仓库地址" />
        </Item>
        <Item
          label="分支名/Tag"
          name="gitRef"
          rules={[
            {
              required: true,
              message: '请输入分支名/Tag'
            }
          ]}>
          <Input placeholder="请输入分支名/Tag" />
        </Item>
        <Item name="gitRepoType" initialValue="public">
          <Radio.Group className={styles['radio-group']} onChange={onChangeGitRepoType}>
            <Radio className={styles.radio} value="public">
              公有仓库
            </Radio>
            <Radio className={styles.radio} value="private">
              私有仓库
            </Radio>
          </Radio.Group>
        </Item>
        {gitRepoType === 'private' && (
          <>
            <Item
              label="git用户名"
              name="gitUser"
              rules={[
                {
                  required: true,
                  message: '请输入git用户名'
                }
              ]}>
              <Input placeholder="请输入git用户名" />
            </Item>
            <Item
              label="git auth token"
              name="gitToken"
              rules={[
                {
                  required: true,
                  message: '请输入git auth token'
                }
              ]}>
              <Input.Password placeholder="请输入git auth token" />
            </Item>
          </>
        )}
        <Item label="构建参数" name="buildArgs" initialValue={[]}>
          <Select
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            placeholder="请输入构建参数"
            mode="tags"
            allowClear
          />
        </Item>
        <Item
          label="镜像Tag"
          name="tag"
          rules={[
            {
              required: true,
              message: '请输入镜像Tag'
            }
          ]}>
          <Input placeholder="请输入镜像Tag" />
        </Item>
        {/* <Item
          label="镜像仓库地址"
          name="registryUrl"
          rules={[
            {
              required: true,
              message: '请输入镜像仓库地址'
            }
          ]}>
          <Input placeholder="请输入镜像仓库地址" />
        </Item> */}
        <Item
          label="镜像类型"
          name="imageType"
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
          label="镜像仓库用户名"
          name="registryUser"
          rules={[
            {
              required: true,
              message: '请输入镜像仓库用户名'
            }
          ]}>
          <Input placeholder="请输入镜像仓库用户名" />
        </Item>
        <Item
          label="镜像仓库密码"
          name="registryPassword"
          rules={[
            {
              required: true,
              message: '请输入镜像仓库密码'
            }
          ]}>
          <Input.Password placeholder="请输入镜像仓库密码" />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ User, loading }: ConnectState) => ({
  User,
  configLoading: loading.effects['BlockChainCompile/addBuildRecord']
}))(AddBuildRecord);