import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Switch, Button, Upload, Modal, notification } from 'antd';
import { normFile, handleBeforeUpload } from './_func';
import { ConnectState } from '~/models/connect';
import { ChainCodeSchema } from '~/models/contract';
import { Dispatch } from 'umi';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

const modalTitle = {
  new: Intl.formatMessage('BASS_CONTRACT_ADD_CONTRACT'),
  modify: Intl.formatMessage('BASS_CONTRACT_MODIFY'),
  upgrade: Intl.formatMessage('BASS_contract_UPGRADE')
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
          orgsToApprove: []
        };
        if (operateType === 'new') {
          dispatch({
            type: 'Contract/addContract',
            payload: params
          }).then((res: any) => {
            if (res) {
              onCancel(true);
            }
          });
        } else {
          dispatch({
            type: 'Contract/upgradeContract',
            payload: params
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
      payload: { networkName, channelId: value }
    });
    form.setFieldsValue({ endorsementOrgName: null });
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelListByOrg',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

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
      RoleAuth: roleToken
    },
    onChange(info: { file: { status: string; name: any; response: React.SetStateAction<null> } }) {
      if (info.file.status === 'done') {
        notification.success({ message: `Succeed in uploading contract ${info.file.name}`, top: 64, duration: 3 });
        setFileJson(info.file.response);
      } else if (info.file.status === 'error') {
        notification.error({
          message: info.file.response
            ? info.file.response.message
            : Intl.formatMessage('BASS_CONTRACT_NOTIFICATION_ERROR_UPLOAD_CONTRACT'),
          top: 64,
          duration: 3
        });
        setFileJson(null);
      }
    }
  };

  const checkChaincodeVersion = (_: any, value: number) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      return promise.reject(Intl.formatMessage('BASS_CONTRACT_INPUT_CONTRACT_VERSION'));
    } // 有值的情况
    if (editParams && editParams.chainCodeVersion && Number(editParams.chainCodeVersion) >= value) {
      return promise.reject(Intl.formatMessage('BASS_CONTRACT_INPUT_NEW_CONTRACT_VERSION'));
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
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" loading={btnLoading} onClick={handleSubmit} disabled={!fileJson} type="primary">
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label={Intl.formatMessage('BASS_CONTRACT_UPLOAD_METHOD')}>
          {Intl.formatMessage('BASS_CONTRACT_LOCAL_UPLOAD')}
        </Item>
        <Item
          name="upload"
          label={Intl.formatMessage('BASS_CONTRACT_LOCAL_CONTRACTS')}
          valuePropName="fileList"
          getValueFromEvent={normFile}>
          <Upload {...uploadProps}>
            <Button type="primary">{Intl.formatMessage('BASS_CONTRACT_UPLOAD_CONTRACT')}</Button>
          </Upload>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_COMMON_CHANNEL')}
          name="channelId"
          initialValue={editParams && editParams.channelId}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode: { parentNode: any }) => triggerNode.parentNode}
            disabled={operateType !== 'new'}
            onChange={onChangeChannel}
            placeholder={Intl.formatMessage('BASS_COMMON_SELECT_CHANNEL')}>
            {myChannelList.map((item) => (
              <Option key={item.channelId} value={item.channelId}>
                {item.channelId}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_NAME')}
          name="chainCodeName"
          initialValue={editParams && editParams.chainCodeName}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_SELECT_CONTRACT_NAME')
            }
          ]}>
          <Input
            placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_CONTRACT_NAME')}
            disabled={operateType !== 'new'}
          />
        </Item>
        {operateType !== 'new' && (
          <Item label={Intl.formatMessage('BASS_CONTRACT_VERSION')}>{editParams && editParams.chainCodeVersion}</Item>
        )}
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_CONTRACT_VERSION')}
          name="chainCodeVersion"
          initialValue=""
          rules={[
            {
              validateTrigger: 'submit',
              validator: checkChaincodeVersion
            }
          ]}>
          <Input type="number" step={0.1} placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_CONTRACT_VERSION')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_INITIALISE_OR_NOT')}
          name="initRequired"
          initialValue={false}
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_CONTRACT_SELECT_INITIALISE_OR_NOT')
            }
          ]}>
          <Switch onChange={onChangeInit} />
        </Item>
        {initRequired && (
          <Item
            label={Intl.formatMessage('BASS_CONTRACT_PARAMETER_LIST')}
            name="initArgs"
            initialValue=""
            rules={[
              {
                required: true,
                message: Intl.formatMessage('BASS_CONTRACT_INPUT_PARAMETER_LIST')
              },
              {
                min: 1,
                max: 1000,
                type: 'string',
                message: Intl.formatMessage('BASS_CONTRACT_PARAMETER_LIST_NUMBER')
              }
            ]}>
            <TextArea placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_PARAMETER_LIST')} />
          </Item>
        )}
        <Item
          label={Intl.formatMessage('BASS_CONTRACT_DESCRIPTION')}
          name="description"
          initialValue=""
          rules={[
            {
              min: 1,
              max: 100,
              type: 'string',
              message: Intl.formatMessage('BASS_CONTRACT_DESCRIPTION_NUMBER')
            }
          ]}>
          <TextArea placeholder={Intl.formatMessage('BASS_CONTRACT_INPUT_DESCRIPTION')} />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ Contract, User, loading }: ConnectState) => ({
  Contract,
  User,
  btnLoading: loading.effects['Contract/addContract'] || loading.effects['Contract/upgradeContract']
}))(EditContract);
