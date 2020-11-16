import React from 'react';
import { connect } from 'dva';
import { Input, Select, Form, Button, Upload, Modal, notification } from 'antd';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};


function CertificateUpload({ visible, onCancel, dispatch }) {

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields();
      form.setFieldsValue(values)

    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '证书上传',
    onCancel: () => onCancel(),
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
    const biggerThanMaxSize = beforeUploadList.some(innerItem => innerItem.size > (1024 * 1024 * 1024 * 1));
    if (biggerThanMaxSize) {
      notification.error({ message: '证书文件大小不能超过1M', top: 64, duration: 1 });
      return false;
    }
    return true;
  };

  const uploadProps = {
    name: 'file',
    listType: 'text',
    action: `/upload.do`,
    accept: '.crt, .pem',
    multiple: false,
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      if (info.file.status === 'done') {
        notification.success({ message: `Succeed in uploading certificate ${info.file.name}`, top: 64, duration: 1 });
      } else if (info.file.status === 'error') {
        notification.error({ message: info.file.response.message, top: 64, duration: 1 });
      }
    },
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item label='证书名称' name='certificateName' initialValue='' rules={[
          {
            required: true,
            message: '请输入证书名称',
          },
          {
            min: 1,
            max: 50,
            type: 'string',
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/,
            message: '证书名必须由1-50位数字英文字母与汉字组合'
          }
        ]}>
          <Input placeholder='请输入证书名称' />
        </Item>
        <Item label='密钥类型' name='policies' initialValue={null} rules={[
          {
            required: true,
            message: '请选择密钥类型',
          },
        ]}>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择密钥类型' >
            <Option value='aaa'>aaa</Option>
          </Select>
        </Item>
        <Item
          label='证书上传'
          valuePropName='fileList'
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: '请上传证书',
            },
          ]}
        >
          <Upload {...uploadProps}>
            <Button>上传证书</Button>
          </Upload>
          <span style={{ color: 'rgb(255, 138, 0)', paddingTop: '10px' }}>注：只允许上传crt,pem格式文件且小于1MB</span>
        </Item>
      </Form>
    </Modal>
  );
};

export default connect(({ Certificate, loading }) => ({
  Certificate,
  addLoading: loading.effects['Contract/addContract']
}))(CertificateUpload);
