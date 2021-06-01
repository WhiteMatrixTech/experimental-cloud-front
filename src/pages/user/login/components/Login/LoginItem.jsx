// FIXME: 别的 component 都在  ~/components 目录下，需要转移。
import { Input, Form } from 'antd';
import React from 'react';
import ItemMap from './map';
import LoginContext from './LoginContext';
const FormItem = Form.Item;

const getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules, getValueFromEvent }) => {
  // FIXME: 为什么要这么写， 没什么实际意义。
  const options = {
    rules: rules || customProps.rules
  };

  if (onChange) {
    options.onChange = onChange;
  }

  if (defaultValue) {
    options.initialValue = defaultValue;
  }

  if (getValueFromEvent) {
    options.getValueFromEvent = getValueFromEvent;
  }

  return options;
};

const LoginItem = (props) => {
  const {
    onChange,
    customProps,
    defaultValue,
    rules,
    name,
    getCaptchaButtonText,
    getCaptchaSecondText,
    updateActive,
    type,
    tabUtil,
    getValueFromEvent,
    ...restProps
  } = props;

  if (!name) {
    return null;
  } // get getFieldDecorator props

  const options = getFormItemOptions(props);
  const otherProps = restProps || {};

  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems = {};
Object.keys(ItemMap).forEach((key) => {
  const item = ItemMap[key];

  LoginItems[key] = (props) => (
    <LoginContext.Consumer>
      {(context) => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});
export default LoginItems;
