import React, { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Modal, message } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { Dispatch, PeerSchema } from 'umi';
export interface SSHCommandProps {
  visible: boolean;
  nodeRecord: PeerSchema;
  onCancel: () => void;
  User: ConnectState['User'];
  Peer: ConnectState['Peer'];
  dispatch: Dispatch;
}
function SSHCommand(props: SSHCommandProps) {
  const { visible, nodeRecord, onCancel, User, Peer, dispatch } = props;
  const { networkName } = User;
  const { nodeSSH } = Peer;
  const realNodeSSH = `ssh root@${nodeSSH} -i ${networkName}.pem`;

  useEffect(() => {
    dispatch({
      type: 'Peer/getNodeSSH',
      payload: { networkName, orgName: nodeRecord.orgName, nodeName: nodeRecord.nodeName },
    });
  }, [dispatch, networkName, nodeRecord.nodeName, nodeRecord.orgName]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: 'SSH命令',
    onCancel: onCancel,
    footer: [
      <CopyToClipboard key={realNodeSSH} text={realNodeSSH} onCopy={() => message.success('节点ssh命令复制成功!')}>
        <Button key="submit" type="primary">
          复制
        </Button>
      </CopyToClipboard>,
    ],
  };
  return <Modal {...drawerProps}>{realNodeSSH}</Modal>;
}

export default connect(({ User, Peer, loading }: ConnectState) => ({
  User,
  Peer,
}))(SSHCommand);
