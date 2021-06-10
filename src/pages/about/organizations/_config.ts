import { Intl } from '~/utils/locales';

export const orgStatus = {
  InUse: { color: 'green', text: Intl.formatMessage('BASS_NODE_INUSE') },
  Creating: { color: 'orange', text: Intl.formatMessage('BASS_NODE_CREATE_IN_PROGRESS') },
  CreationFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_CREATE_FAILED') },
  Stopping: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_DEACTIVATED') },
  StopFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_DEACTIVATION_FAILED') },
  Stopped: { color: ':#E2E9F7', text: Intl.formatMessage('BASS_NODE_DEACTIVATED') },
  Deleting: { color: 'orange', text: Intl.formatMessage('BASS_NODE_BEING_REMOVED') },
  DeletionFailed: { color: 'red', text: Intl.formatMessage('BASS_NODE_DELETED_FAILED') },
  Deleted: { color: 'volcano', text: Intl.formatMessage('BASS_NODE_DELETED') }
};

export enum OrgStatusEnum {
  InUse = 'InUse',
  Creating = 'Creating',
  CreationFailed = 'CreationFailed',
  Stopping = 'Stopping',
  StopFailed = 'StopFailed',
  Stopped = 'Stopped',
  Deleting = 'Deleting',
  DeletionFailed = 'DeletionFailed',
  Deleted = 'Deleted'
}
