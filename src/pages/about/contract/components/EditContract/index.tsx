import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Switch, Button, Upload, Modal, notification } from 'antd';
import { normFile, handleBeforeUpload } from './_func';
import { ConnectState } from '~/models/connect';
import { ChainCodeSchema } from '~/models/contract';
import { Dispatch } from 'umi';

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

const modalTitle = {
  new: '新增合约',
  modify: '修改合约',
  upgrade: '升级合约',
};
export interface EditContractProps {
  visible: boolean;
  editParams: ChainCodeSchema | undefined;
  onCancel: any;
  operateType: any;
  dispatch: Dispatch;
  Contract: ConnectState['Contract'];
  User: ConnectState['User'];
  btnLoading: boolean;
}

function EditContract(props: EditContractProps) {
  const [form] = Form.useForm();
  const [fileJson, setFileJson] = useState(null);
  const [initRequired, setInitRequired] = useState(false);
  const { visible, editParams, onCancel, operateType, dispatch, Contract, User, btnLoading = false } = props;
  const { myChannelList } = Contract;
  const { networkName } = User;

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        values.chainCodePackageMetaData = fileJson;
        const { upload, ...rest } = values;
        const params = rest;
        if (!initRequired) {
          params.initArgs = '';
        }
        params.networkName = networkName;
        params.endorsementPolicy = {
          policyType: 'Default',
          orgsToApprove: [],
        };
        if (operateType === 'new') {
          dispatch({
            type: 'Contract/addContract',
            payload: params,
          }).then((res: any) => {
            if (res) {
              onCancel(true);
            }
          });
        } else {
          dispatch({
            type: 'Contract/upgradeContract',
            payload: params,
          }).then((res: any) => {
            if (res) {
              onCancel(true);
            }
          });
        }
      })
      .catch((info: any) => {
        console.log('校验失败:', info);
      });
  };

  const onChangeInit = (checked: any) => {
    setInitRequired(checked);
  };

  const onChangeChannel = (value: any) => {
    dispatch({
      type: 'Contract/getOrgListWithChannel',
      payload: { networkName, channelId: value },
    });
    form.setFieldsValue({ endorsementOrgName: null });
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelListByOrg',
      payload: { networkName },
    });
  }, []);

  const accessToken = localStorage.getItem('accessToken');
  const roleToken = localStorage.getItem('roleToken');
  const uploadProps = {
    name: 'file',
    listType: 'text',
    action: `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/chainCodes/uploadPackageArchive`,
    accept: '.zip, .jar, .rar, .gz',
    multiple: false,
    beforeUpload: handleBeforeUpload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken,
    },
    onChange(info: { file: { status: string; name: any; response: React.SetStateAction<null> } }) {
      if (info.file.status === 'done') {
        notification.success({ message: `Succeed in uploading contract ${info.file.name}`, top: 64, duration: 3 });
        setFileJson(info.file.response);
      } else if (info.file.status === 'error') {
        notification.error({
          message: info.file.response ? info.file.response.message : '合约上传出错',
          top: 64,
          duration: 3,
        });
        setFileJson(null);
      }
    },
  };

  const checkChaincodeVersion = (_: any, value: number) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      return promise.reject('请输入合约版本');
    } // 有值的情况
    if (editParams && editParams.chainCodeVersion && Number(editParams.chainCodeVersion) >= value) {
      return promise.reject('请输入新的合约版本');
    }
    return promise.resolve();
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: modalTitle[operateType],
    onCancel: onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="submit" loading={btnLoading} onClick={handleSubmit} disabled={!fileJson} type="primary">
        提交
      </Button>,
    ],
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label="上传方式">本地上传</Item>
        <Item name="upload" label="本地合约" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload {...uploadProps}>
            <Button type="primary">上传合约</Button>
          </Upload>
        </Item>
        <Item
          label="所属通道"
          name="channelId"
          initialValue={editParams && editParams.channelId}
          rules={[
            {
              required: true,
              message: '请选择通道',
            },
          ]}
        >
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            disabled={operateType !== 'new'}
            onChange={onChangeChannel}
            placeholder="请选择通道"
          >
            {myChannelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label="合约名称"
          name="chainCodeName"
          initialValue={editParams && editParams.chainCodeName}
          rules={[
            {
              required: true,
              message: '请输入合约名称',
            },
          ]}
        >
          <Input placeholder="请输入合约名称" disabled={operateType !== 'new'} />
        </Item>
        {operateType !== 'new' && <Item label="当前版本">{editParams && editParams.chainCodeVersion}</Item>}
        <Item
          label="合约版本"
          name="chainCodeVersion"
          initialValue=""
          rules={[
            {
              validateTrigger: 'submit',
              validator: checkChaincodeVersion,
            },
          ]}
        >
          <Input type="number" step={0.1} placeholder="请输入合约版本" />
        </Item>
        <Item
          label="是否初始化"
          name="initRequired"
          initialValue={false}
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: '请选择是否需要初始化',
            },
          ]}
        >
          <Switch onChange={onChangeInit} />
        </Item>
        {initRequired && (
          <Item
            label="参数列表"
            name="initArgs"
            initialValue=""
            rules={[
              {
                required: true,
                message: '请输入参数列表',
              },
              {
                min: 1,
                max: 1000,
                type: 'string',
                message: '参数由1~1000位组成',
              },
            ]}
          >
            <TextArea placeholder="请输入参数列表" />
          </Item>
        )}
        <Item
          label="合约描述"
          name="description"
          initialValue=""
          rules={[
            {
              min: 1,
              max: 100,
              type: 'string',
              message: '合约描述由0~100个字符组成',
            },
          ]}
        >
          <TextArea placeholder="请输入合约描述" />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Contract, User, loading }: ConnectState) => ({
  Contract,
  User,
  btnLoading: loading.effects['Contract/addContract'] || loading.effects['Contract/upgradeContract'],
}))(EditContract);
