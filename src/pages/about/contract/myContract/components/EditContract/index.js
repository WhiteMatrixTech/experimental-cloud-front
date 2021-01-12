import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Switch, Button, Upload, Modal, notification } from 'antd';
import { normFile, handleBeforeUpload } from './_func';

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
  'new': '新增合约',
  'modify': '修改合约',
  'upgrate': '升级合约'
}

function EditContract(props) {

  const [form] = Form.useForm();
  const [fileJson, setFileJson] = useState(null);
  const [initRequired, setInitRequired] = useState(false);
  const { visible, editParams, onCancel, operateType, dispatch, Contract, User } = props;
  const { channelList, orgListWithChannel } = Contract;
  const { networkName } = User;

  const handleSubmit = () => {
    form.validateFields().then(values => {
      values.chainCodePackageMetadata = fileJson;
      if (!initRequired) {
        values.initArgs = ''
      }
      values.networkName = networkName;
      if (operateType === 'new') {
        dispatch({
          type: 'Contract/addContract',
          payload: values
        }).then(res => {
          if (res) {
            onCancel();
          }
        })
      } else {
        dispatch({
          type: 'Contract/upgrateContract',
          payload: values
        }).then(res => {
          if (res) {
            onCancel();
          }
        })
      }
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const onChangeInit = checked => {
    setInitRequired(checked);
  }

  const onChangeChannel = value => {
    dispatch({
      type: 'Contract/getOrgListWithChannel',
      payload: { channelId: value },
    });
    form.setFieldsValue({ 'endorsementOrgName': null })
  }

  useEffect(() => {
    dispatch({
      type: 'Contract/getChannelList',
      payload: { networkName },
    });
  }, [])

  const uploadProps = {
    name: 'file',
    listType: 'text',
    // TODO: umirc.js中配置地址
    action: `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/chainCodes/uploadPackageArchive`,
    accept: '.zip, .jar, .rar, .gz',
    multiple: false,
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      if (info.file.status === 'done') {
        notification.success({ message: `Succeed in uploading contract ${info.file.name}`, top: 64, duration: 1 })
        setFileJson(info.file.response)
      } else if (info.file.status === 'error') {
        notification.error({ message: info.file.response.message, top: 64, duration: 1 })
        setFileJson(null)
      }
    },
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: modalTitle[operateType],
    onCancel: onCancel,
    footer: [
      <Button key='cancel' onClick={onCancel}>
        取消
      </Button>,
      <Button key='submit' onClick={handleSubmit} type="primary">
        提交
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label='上传方式'>本地上传</Item>
        <Item
          name='upload'
          label='本地合约'
          valuePropName='fileList'
          getValueFromEvent={normFile}
        >
          <Upload {...uploadProps}>
            <Button type="primary">上传合约</Button>
          </Upload>
        </Item>
        <Item label='所属通道' name='channelId' initialValue={null} rules={[
          {
            required: true,
            message: '请选择通道',
          },
        ]}>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            disabled={operateType !== 'new'}
            onChange={onChangeChannel}
            placeholder='请选择通道'
          >
            {channelList.map(item => <Option key={item.channelId} value={item.channelId}>{item.channelId}</Option>)}
          </Select>
        </Item>
        <Item label='选择组织' name='endorsementOrgName' initialValue={null} rules={[
          {
            required: true,
            message: '请选择组织',
          },
        ]}>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            disabled={operateType !== 'new'}
            notFoundContent='请先选择通道'
            placeholder='请选择组织'
          >
            {orgListWithChannel.map(item => <Option key={item.orgId} value={item.orgId}>{item.orgName}</Option>)}
          </Select>
        </Item>
        <Item label='合约名称' name='chainCodeName' initialValue='' rules={[
          {
            required: true,
            message: '请输入合约名称',
          },
          {
            min: 4,
            max: 20,
            type: 'string',
            pattern: /^[A-z][A-z0-9]{3,19}$/,
            message: '合约名必须由4~20位数字与英文字母组合,英文字母开头'
          }
        ]}>
          <Input placeholder='请输入合约名称' disabled={operateType !== 'new'} />
        </Item>
        {(operateType !== 'new') && <Item label='当前版本'>{editParams.chainCodeVersion}</Item>}
        <Item label='合约版本' name='chainCodeVersion' initialValue='' rules={[
          {
            required: true,
            message: '请输入合约版本',
          },
        ]}>
          <Input type='number' step={0.1} placeholder='请输入合约版本' />
        </Item>
        {operateType === 'new' && (
          <Item label='是否初始化' name='initRequired' initialValue={false} valuePropName='checked' rules={[
            {
              required: true,
              message: '请选择是否需要初始化',
            }
          ]}>
            <Switch onChange={onChangeInit} />
          </Item>
        )}
        {initRequired &&
          <Item label='参数列表' name='initArgs' initialValue='' rules={[
            {
              required: true,
              message: '请输入参数列表',
            },
            {
              min: 1,
              max: 1000,
              type: 'string',
              message: '参数由1~1000位组成'
            }
          ]}>
            <TextArea placeholder='请输入参数列表' />
          </Item>
        }
        <Item label='合约描述' name='description' initialValue='' rules={[
          {
            min: 1,
            max: 100,
            type: 'string',
            message: '合约描述由0~100个字符组成'
          }
        ]}>
          <TextArea placeholder='请输入合约描述' />
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Contract, User, loading }) => ({
  Contract,
  User,
  qryLoading: loading.effects['Contract/addContract']
}))(EditContract);
