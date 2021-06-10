import React, { useEffect } from 'react';
import { Space, Button, Spin, Form, Row, Col, Input, Select } from 'antd';
import { connect, history, Dispatch, Location, UserInfo } from 'umi';
import { ConnectState } from '~/models/connect';
import { RolesMapNames } from '~/utils/roles';
import { Breadcrumb } from '~/components';
import { CommonMenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { Intl } from '~/utils/locales';

const { Item } = Form;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

const breadCrumbItem = getCurBreadcrumb(CommonMenuList, '/common/user-role-management');
breadCrumbItem.push({
  menuName: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_CONFIG_USE_ROLE'),
  menuHref: `/`
});

export type UserManagementProps = {
  configLoading: boolean;
  dispatch: Dispatch;
  location: Location<UserInfo>;
  UserRole: ConnectState['UserRole'];
  match: { params: { companyName: string } };
};

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const {
    configLoading = false,
    dispatch,
    location,
    UserRole,
    match: {
      params: { companyName }
    }
  } = props;
  const { userRoles, roleNameList } = UserRole;

  const [form] = Form.useForm();

  const onClickGoBack = () => {
    history.push('/common/userManagement');
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch({
          type: 'UserRole/configUserRoles',
          payload: { companyName, accessRoles: values.RoleList }
        });
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  };

  useEffect(() => {
    form.setFieldsValue({ RoleList: userRoles });
  }, [form, userRoles]);

  useEffect(() => {
    dispatch({
      type: 'UserRole/getRoleNameList',
      payload: {}
    });
    dispatch({
      type: 'UserRole/getUserRoles',
      payload: { companyName }
    });
  }, [dispatch, companyName]);

  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <Spin spinning={configLoading}>
          <div className={styles['form-content-wrapper']}>
            <Form {...formItemLayout} form={form}>
              <Row justify="center" gutter={[24, 24]}>
                <Col span={8}>
                  <Item
                    label={Intl.formatMessage('BASS_ELASTIC_CLOUD_USERNAME')}
                    name="companyName"
                    initialValue={companyName}>
                    <Input disabled placeholder={Intl.formatMessage('BASS_ELASTIC_CLOUD_USERNAME')} />
                  </Item>
                </Col>
                <Col span={8}>
                  <Item
                    label={Intl.formatMessage('BASS_RBAC_REGISTER_ROLE')}
                    name="role"
                    initialValue={RolesMapNames[location.state?.role]}>
                    <Input disabled placeholder={Intl.formatMessage('BASS_RBAC_REGISTER_ROLE')} />
                  </Item>
                </Col>
              </Row>
              <Form.List name="RoleList">
                {(fields) => (
                  <>
                    {userRoles.map((role, key) => (
                      <div key={role.networkName}>
                        <Row justify="center" gutter={[24, 24]}>
                          <Col span={8}>
                            <Item
                              label={Intl.formatMessage('BASS_USER_INFO_NETWORK_NAME')}
                              name={[key, 'networkName']}
                              initialValue={role.networkName}
                              fieldKey={[key, 'networkName']}>
                              <Input disabled placeholder={Intl.formatMessage('BASS_USER_INFO_NETWORK_NAME')} />
                            </Item>
                          </Col>
                          <Col span={8}>
                            <Item
                              label={Intl.formatMessage('BASS_RBAC_ROLE_NAME')}
                              name={[key, 'roleName']}
                              fieldKey={[key, 'roleName']}>
                              <Select
                                allowClear={true}
                                placeholder={Intl.formatMessage('BASS_RBAC_SELECT_ROLE_NAME')}
                                style={{ width: '100%' }}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                {roleNameList.map((item) => (
                                  <Option key={item} value={item}>
                                    {item}
                                  </Option>
                                ))}
                              </Select>
                            </Item>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </Form>
            <Row justify="center" gutter={[24, 24]}>
              <Col span={8} offset={8} className={styles['button-wrapper']}>
                <Space>
                  <Button key="submit" type="primary" onClick={onSubmit}>
                    {Intl.formatMessage('BASS_COMMON_SUBMIT')}
                  </Button>
                  <Button key="back" onClick={onClickGoBack}>
                    {Intl.formatMessage('BASS_USER_INFO_RETURN')}
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ UserRole, loading }: ConnectState) => ({
  UserRole,
  configLoading: loading.effects['UserRole/configUserRoles']
}))(UserManagement);
