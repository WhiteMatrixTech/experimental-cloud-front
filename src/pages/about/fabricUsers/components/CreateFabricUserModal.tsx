import React, { useEffect, useMemo } from 'react';
import { ConnectState } from '~/models/connect';
import { Button, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import { Roles } from '~/utils/roles';
import { CreateFabricRole } from '../_config';
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
export interface CreateFabricUserModalProps {
  FabricRole: ConnectState['FabricRole'];
  Organization: ConnectState['Organization'];
  visible: boolean;
  onCancel: () => void;
  addLoading: boolean;
  User: ConnectState['User'];
  dispatch: Dispatch;
  getFabricRoleList: () => void;
}
function CreateFabricUserModal(props: CreateFabricUserModalProps) {
  const { FabricRole, Organization, visible, onCancel, addLoading = false, User, dispatch } = props;
  const { networkName, userRole } = User;
  const { myOrgInfo } = FabricRole;
  const { orgInUseList } = Organization;

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'FabricRole/getMyOrgInfo',
      payload: { networkName }
    });
    dispatch({
      type: 'Organization/getOrgInUseList',
      payload: { networkName }
    });
  }, [dispatch, networkName]);

  const orgList = useMemo(() => {
    if (userRole === Roles.NetworkAdmin) {
      return orgInUseList;
    }
    if (myOrgInfo) {
      return [myOrgInfo];
    }
    return [];
  }, [userRole, myOrgInfo, orgInUseList]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        let params = {
          ...values,
          networkName
        };
        dispatch({
          type: 'FabricRole/createFabricRole',
          payload: params
        }).then((res: any) => {
          if (res) {
            onCancel();
            props.getFabricRoleList();
          }
        });
        form.setFieldsValue(values);
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('pass')) {
      return promise.reject(Intl.formatMessage('BASS_FABRIC_PROMISE_REJECT'));
    }
    return promise.resolve();
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    width: 700,
    title: Intl.formatMessage('BASS_FABRIC_NEW_FABRIC_ROLE'),
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        {Intl.formatMessage('BASS_COMMON_CANCEL')}
      </Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={addLoading}>
        {Intl.formatMessage('BASS_COMMON_SUBMIT')}
      </Button>
    ]
  };

  return (
    <Modal {...drawerProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label={Intl.formatMessage('BASS_FABRIC_CHARACTER_NAME')}
          name="userId"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_FABRIC_CHARACTER_NAME')
            },
            {
              pattern: /^[a-zA-Z0-9\-_]\w{4,20}$/,
              message: Intl.formatMessage('BASS_FABRIC_NAME_CONSIST')
            }
          ]}>
          <Input placeholder={Intl.formatMessage('BASS_FABRIC_CHARACTER_NAME')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_FABRIC_PASSWORD')}
          name="pass"
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_FABRIC_INPUT_PASSWORD')
            },
            {
              min: 6,
              max: 18,
              message: Intl.formatMessage('BASS_FABRIC_PASSWORD_LENGTH')
            }
          ]}>
          <Input type="password" placeholder={Intl.formatMessage('BASS_FABRIC_INPUT_PASSWORD')} />
        </Item>
        <Item
          name="re_pass"
          label={Intl.formatMessage('BASS_FABRIC_CONFIRM_PASSWORD')}
          initialValue=""
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_FABRIC_PLEASE_CONFIRM_PASSWORD')
            },
            {
              validator: checkConfirm
            }
          ]}>
          <Input type="password" placeholder={Intl.formatMessage('BASS_FABRIC_PLEASE_CONFIRM_PASSWORD')} />
        </Item>
        <Item
          label={Intl.formatMessage('BASS_FABRIC_CHARACTER_TYPE')}
          name="fabricRole"
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_FABRIC_SELECT_CHARACTER_TYPE')
            }
          ]}>
          <Select
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={Intl.formatMessage('BASS_FABRIC_SELECT_CHARACTER_TYPE')}>
            {Object.keys(CreateFabricRole).map((role) => (
              <Option key={role} value={CreateFabricRole[role]}>
                {CreateFabricRole[role]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          label={Intl.formatMessage('BASS_COMMON_ORGANIZATION')}
          name="orgName"
          initialValue={userRole === Roles.NetworkMember ? myOrgInfo && myOrgInfo.orgName : null}
          rules={[
            {
              required: true,
              message: Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')
            }
          ]}>
          <Select
            allowClear
            placeholder={Intl.formatMessage('BASS_FABRIC_SELECT_ORGNISIZATION_NAME')}
            disabled={userRole === Roles.NetworkMember}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}>
            {orgList.map((item) => (
              <Option key={item.orgName} value={item.orgName}>
                {item && item.orgName}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={Intl.formatMessage('BASS_FABRIC_ATTRIBUTE_SETS')} name="attrs" initialValue="">
          <TextArea placeholder={Intl.formatMessage('BASS_FABRIC_INPUT_ATTRIBUTE_SETS')} />
        </Item>
      </Form>
    </Modal>
  );
}

export default connect(({ User, FabricRole, Organization, loading }: ConnectState) => ({
  User,
  FabricRole,
  Organization,
  addLoading: loading.effects['FabricRole/createFabricRole']
}))(CreateFabricUserModal);
