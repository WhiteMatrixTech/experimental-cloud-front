import { Intl } from '~/utils/locales';

export const chainCodeStatusInfo = {
  Installing: { color: 'gold', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_INSTALL') },
  Installed: { color: '#87d068', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_INSTALLED') },
  InstallationFailed: { color: 'red', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_INSTALL_FAILED') },
  Approving: { color: 'gold', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_BEING_PUBLISH') },
  Approved: { color: '#87d068', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_PUBLISHED') },
  ApproveFailed: { color: 'red', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_PUBLISH_FAILED') },
  Archived: { color: '#d9d9d9', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_ARCHIVED') },
  Pending: { color: 'gold', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_PENDING_AUDIT') },
  Verified: { color: '#87d068', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_AUDIT_PASSED') },
  Rejected: { color: 'red', text: Intl.formatMessage('BASS_CONTRACT_CONFIG_NOT_PASSED') }
};

export enum ChainCodeStatus {
  Installing = 'Installing',
  Installed = 'Installed',
  InstallationFailed = 'InstallationFailed',
  Approving = 'Approving', //审批
  Approved = 'Approved', //已批准
  ApproveFailed = 'ApproveFailed',
  Archived = 'Archived', //已归档
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected'
}

export const VerifyChainCodeStatus = {
  Pending: 'Pending', // 待审核
  Verified: 'Verified', // 通过
  Rejected: 'Rejected' // 驳回
};

export const VerifyStatusList = [
  VerifyChainCodeStatus.Pending,
  VerifyChainCodeStatus.Rejected,
  VerifyChainCodeStatus.Verified
];

export const UpdateStatusList = [
  ChainCodeStatus.Pending,
  ChainCodeStatus.Rejected,
  ChainCodeStatus.Installed,
  ChainCodeStatus.InstallationFailed,
  ChainCodeStatus.Approved
];
