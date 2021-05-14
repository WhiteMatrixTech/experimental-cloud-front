import React, { useEffect } from 'react';
import { Space, Button, Spin, Form, Row, Col, Input, Select } from 'antd';
import { connect, history, Dispatch, Location, UserInfo } from 'umi';
import { ConnectState } from '@/models/connect';
import { RolesMapNames } from '@/utils/roles';
import cs from 'classnames';
import styles from './index.less';

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

export type UserManagementProps = {
  configLoading: boolean,
  dispatch: Dispatch,
  location: Location<UserInfo>,
  UserRole: ConnectState['UserRole']
}

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const { configLoading = false, dispatch, location, UserRole } = props;
  const { userRoles, roleNameList } = UserRole;

  const [form] = Form.useForm();

  const onClickGoBack = () => {
    history.push('/userManagement');
  }

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch({
          type: 'UserRole/configUserRoles',
          payload: { companyName: location.state?.companyName, accessRoles: values.RoleList },
        });
      })
      .catch((info) => {
        console.log('校验失败:', info);
      });
  }

  useEffect(() => {
    form.setFieldsValue({ RoleList: userRoles });
  }, [form, userRoles])

  useEffect(() => {
    dispatch({
      type: 'UserRole/getRoleNameList',
      payload: {},
    });
    dispatch({
      type: 'UserRole/getUserRoles',
      payload: { companyName: location.state?.companyName },
    });
  }, [dispatch, location.state?.companyName])

  return <div className={styles.main}>
    <Spin spinning={configLoading}>
      <div className={cs(styles['form-header-title'], 'page-content')}>
        <h3>配置用户角色</h3>
        <div className={styles['sub-title']}>每一行为一组，对应该用户在此网络下的访问角色</div>
      </div>
      <div className={styles['form-content-wrapper']}>
        <Form {...formItemLayout} form={form}>
          <Row justify="center" gutter={[24, 24]}>
            <Col span={8}>
              <Item
                label="用户名"
                name="companyName"
                initialValue={location.state?.companyName}
              >
                <Input disabled placeholder="用户名" />
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="注册角色"
                name="role"
                initialValue={RolesMapNames[location.state?.role]}
              >
                <Input disabled placeholder="注册角色" />
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
                          label="网络名称"
                          name={[key, 'networkName']}
                          initialValue={role.networkName}
                          fieldKey={[key, 'networkName']}
                        >
                          <Input disabled placeholder="网络名称" />
                        </Item>
                      </Col>
                      <Col span={8}>
                        <Item
                          label="角色名称"
                          name={[key, 'roleName']}
                          fieldKey={[key, 'roleName']}
                        >
                          <Select
                            allowClear={true}
                            placeholder="选择角色"
                            style={{ width: '100%' }}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                          >
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
              <Button key="submit" type="primary" onClick={onSubmit}>提交</Button>
              <Button key="back" onClick={onClickGoBack}>返回</Button>
            </Space>
          </Col>
        </Row>
      </div>
    </Spin>
  </div>
}

export default connect(({ UserRole, loading }: ConnectState) => ({
  UserRole,
  configLoading: loading.effects['UserRole/configUserRoles'],
}))(UserManagement);
