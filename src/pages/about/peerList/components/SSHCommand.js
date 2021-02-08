import React, { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Modal, message } from 'antd';
import { connect } from 'dva';

function SSHCommand(props) {
  const { visible, nodeRecord, onCancel, User, dispatch } = props;
  const { networkName } = User;

  useEffect(() => {
    dispatch({
      type: 'Peer/getPeerSSH',
      payload: { networkName, nodeName: nodeRecord.nodeName },
    });
  }, []);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: 'SSH命令',
    onCancel: () => onCancel(),
    footer: [
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <CopyToClipboard text="lalalalala" onCopy={() => message.success('节点ssh命令复制成功')}>
        <Button key="submit" type="primary">
          复制
        </Button>
      </CopyToClipboard>,
    ],
  };

  return <Modal {...drawerProps}>1111</Modal>;
}

export default connect(({ User, Peer, loading }) => ({
  User,
  Peer,
}))(SSHCommand);
