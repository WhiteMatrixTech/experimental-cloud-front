import React from 'react';
import { Alert } from 'antd';

export const LoginMessage = ({ content }: { content: Element | string }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);