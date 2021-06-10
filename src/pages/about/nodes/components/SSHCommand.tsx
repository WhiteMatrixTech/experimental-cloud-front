import React, { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Modal, message } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '~/models/connect';
import { Dispatch, PeerSchema } from 'umi';
import { Intl } from '~/utils/locales';
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
      payload: { networkName, orgName: nodeRecord.orgName, nodeName: nodeRecord.nodeName }
    });
  }, [dispatch, networkName, nodeRecord.nodeName, nodeRecord.orgName]);

  const drawerProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: Intl.formatMessage('BASS_NODE_SSH_COMMAND'),
    onCancel: onCancel,
    footer: [
      <CopyToClipboard
        key={realNodeSSH}
        text={realNodeSSH}
        onCopy={() => message.success(Intl.formatMessage('BASS_NODE_SSH_COMMAND_COPY_SUCCESS'))}>
        <Button key="submit" type="primary">
          {Intl.formatMessage('BASS_NODE_COPY')}
        </Button>
      </CopyToClipboard>
    ]
  };
  return <Modal {...drawerProps}>{realNodeSSH}</Modal>;
}

export default connect(({ User, Peer, loading }: ConnectState) => ({
  User,
  Peer
}))(SSHCommand);
