import React from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Upload, Modal, notification } from 'antd';

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

function EditContract({ visible, editParams, onCancel, operateType, dispatch }) {

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields();
      form.setFieldsValue(values)
      if (operateType === 'new') {

        onCancel();
      } else {

        onCancel();
      }
    }).catch(info => {
      console.log('校验失败:', info);
    });
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

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 上传前校验文件大小
  const handleBeforeUpload = (file, beforeUploadList) => {
    // let fileName = file.name;
    const biggerThanMaxSize = beforeUploadList.some(innerItem => innerItem.size > (1024 * 1024 * 1024 * 5));
    if (biggerThanMaxSize) {
      notification.error({ message: '合约文件大小不能超过5M', top: 64, duration: 1 });
      return false;
    }
    return true;
  };

  const uploadProps = {
    name: 'file',
    listType: 'text',
    action: `/upload.do`,
    accept: '.zip, .jar',
    multiple: false,
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      if (info.file.status === 'done') {
        notification.success({ message: `Succeed in uploading contract ${info.file.name}`, top: 64, duration: 1 });
      } else if (info.file.status === 'error') {
        notification.error({ message: info.file.response.message, top: 64, duration: 1 });
      }
    },
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label='上传方式'>本地上传</Item>
        <Item
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
            placeholder='请选择通道'
            disabled={operateType !== 'new'}
          >

            <Option value='aaa'>aaa</Option>
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
        {(operateType !== 'new') && <Item label='当前版本'>1.2</Item>}
        <Item label='合约版本' name='chainCodeVersion' initialValue='' rules={[
          {
            required: true,
            message: '请输入合约版本',
          },
          {
            type: 'string',
            pattern: /^\d+(\.\d+)*$/,
            message: '合约版本必须由数字或点组成,且首字符为数字'
          }
        ]}>
          <Input placeholder='请输入合约版本' />
        </Item>
        <Item label='方法名' name='initMethod' initialValue='' rules={[
          {
            required: true,
            message: '请输入方法名',
          },
          {
            min: 1,
            max: 100,
            type: 'string',
            message: '方法名由1~100位组成'
          }
        ]}>
          <Input placeholder='请输入方法名' />
        </Item>
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
          <Input placeholder='请输入参数列表' />
        </Item>
        <Item label='选择组织' name='policies' initialValue={null} rules={[
          {
            required: true,
            message: '请选择组织',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择组织' >

            <Option value='aaa'>aaa</Option>
          </Select>
        </Item>
        <Item label='背书关系'>1</Item>
        <Item label='合约描述' name='chainCodeDesc' initialValue='' rules={[
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

export default connect(({ Contract, loading }) => ({
  Contract,
  qryLoading: loading.effects['Contract/addContract']
}))(EditContract);
