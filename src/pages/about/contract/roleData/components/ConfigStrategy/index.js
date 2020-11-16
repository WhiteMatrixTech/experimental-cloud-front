import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Checkbox, Form, Button, Modal, Row } from 'antd';
import style from './index.less';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

function ConfigStrategy(props) {
  const { visible, editParams = {}, onCancel, getPageListOfRoleData, dispatch, configLoading = false } = props
  const { strategyMemberList, curStrategyMember } = props.Contract

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields()
      form.setFieldsValue(values)

      const params = values
      params.id = editParams._id
      dispatch({
        type: 'Contract/updateStrategyMember',
        payload: params
      }).then(res => {
        if (res) {
          onCancel()
          getPageListOfRoleData()
        }
      })
    }).catch(info => {
      console.log('校验失败:', info);
    });
  };

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '配置策略',
    onCancel: () => onCancel(),
    footer: [
      <Button key='cancel' onClick={onCancel}>
        取消
      </Button>,
      <Button key='submit' onClick={handleSubmit} type="primary" loading={configLoading}>
        提交
      </Button>
    ]
  };

  useEffect(() => {
    dispatch({
      type: 'Contract/getPageListOfRoleMember',
      payload: { id: editParams._id }
    })
  }, []);

  return (
    <Modal {...drawerProps}>
      <div className={style.configWrapper}>
        <div className={style.leagueName}>
          数研院
      </div>
        <div className={style.compannyList}>
          <Form {...formItemLayout} form={form}>
            <Item name='strategyMember' initialValue={curStrategyMember}>
              <Checkbox.Group>
                {strategyMemberList.map(item =>
                  <Row key={item._id}>
                    <Checkbox value={item.companyName}>
                      {item.companyName}
                    </Checkbox>
                  </Row>)}
              </Checkbox.Group>
            </Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ Contract, loading }) => ({
  Contract,
  configLoading: loading.effects['Contract/updateStrategyMember']
}))(ConfigStrategy);
