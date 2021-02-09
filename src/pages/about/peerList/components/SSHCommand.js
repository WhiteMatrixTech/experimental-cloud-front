import React, { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Modal, message } from 'antd';
import { connect } from 'dva';

function SSHCommand(props) {
  const { visible, nodeRecord, onCancel, User, Peer, dispatch } = props;
  const { networkName } = User;
  const { peerSSH } = Peer;

  const realNodeSSH = `ssh ec2-user@${peerSSH} -i ${networkName}.pem`;

  useEffect(() => {
    dispatch({
      type: 'Peer/getPeerSSH',
      payload: { networkName, orgName: nodeRecord.orgName, nodeName: nodeRecord.nodeName },
    });
  }, []);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: 'SSH命令',
    onCancel: () => onCancel(),
    footer: [
      <CopyToClipboard text={realNodeSSH} onCopy={() => message.success('节点ssh命令复制成功!')}>
        <Button key="submit" type="primary">
          复制
        </Button>
      </CopyToClipboard>,
    ],
  };

  return <Modal {...drawerProps}>{realNodeSSH}</Modal>;
}

export default connect(({ User, Peer, loading }) => ({
  User,
  Peer,
}))(SSHCommand);
