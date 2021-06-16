import { Intl } from '~/utils/locales';

export const peerStatus = {
  // 节点状态
  Running: { color: 'green', text: Intl.formatMessage('BASS_NODE_RUN') },
  Creating: { color: 'orange', text: Intl.formatMessage('BASS_NODE_CREATE_IN_PROGRESS') },
  CreationFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_CREATE_FAILED') },
  Stopping: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_DEACTIVATED') },
  Stopped: { color: ':#E2E9F7', text: Intl.formatMessage('BASS_NODE_DEACTIVATED') },
  StopFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_DEACTIVATION_FAILED') },
  Deleting: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_REMOVED') },
  DeletionFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_DELETED_FAILED') },
  Deleted: { color: 'volcano', text: Intl.formatMessage('BASS_NODE_DELETED') },
  Starting: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_START') },
  StartFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_FAILED_TO_START') }
};

export const availableNodeStatus = ['Running', 'CreationFailed', 'Creating'];
