import { Intl } from '~/utils/locales';
export interface ChannelStatusMapAttr {
  InUse: string;
  Creating: string;
  CreationFailed: string;
  Stopping: string;
  StopFailed: string;
  Stopped: string;
  Deleting: string;
  DeletionFailed: string;
  Deleted: string;
}
export const ChannelStatusMap: ChannelStatusMapAttr = {
  // 通道状态
  InUse: 'InUse',
  Creating: 'Creating',
  CreationFailed: 'CreationFailed',
  Stopping: 'Stopping',
  StopFailed: 'StopFailed',
  Stopped: 'Stopped',
  Deleting: 'Deleting',
  DeletionFailed: 'DeletionFailed',
  Deleted: 'Deleted'
};

export const ChannelStatus = {
  // 通道状态
  [ChannelStatusMap.InUse]: { color: 'green', text: Intl.formatMessage(' BASS_NODE_INUSE') },
  [ChannelStatusMap.Creating]: { color: 'orange', text: Intl.formatMessage('BASS_NODE_CREATE_IN_PROGRESS') },
  [ChannelStatusMap.CreationFailed]: { color: 'red', text: Intl.formatMessage('BASS_NODE_CREATE_FAILED') },
  [ChannelStatusMap.Stopping]: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_DEACTIVATED') },
  [ChannelStatusMap.StopFailed]: { color: 'red', text: Intl.formatMessage('BASS_NODE_DEACTIVATION_FAILED') },
  [ChannelStatusMap.Stopped]: { color: ':#E2E9F7', text: Intl.formatMessage('BASS_NODE_DEACTIVATED') },
  [ChannelStatusMap.Deleting]: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_REMOVED') },
  [ChannelStatusMap.DeletionFailed]: { color: 'red', text: Intl.formatMessage('BASS_NODE_DELETED_FAILED') },
  [ChannelStatusMap.Deleted]: { color: 'volcano', text: Intl.formatMessage('BASS_NODE_DELETED') }
};
