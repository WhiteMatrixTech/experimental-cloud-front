import { Intl } from '~/utils/locales';
export enum MemberApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Any = 'any'
}

export enum MemberValidStatus {
  Invalid = 'invalid',
  Valid = 'valid',
  Pending = 'pending'
}

export const statusList = {
  // 审批状态
  pending: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_PENDING'),
  approved: Intl.formatMessage('BASS_CONTRACT_PASSED'),
  rejected: Intl.formatMessage('BASS_CONTRACT_NOT_PASSED')
};

export const validStatus = {
  // 可用状态
  invalid: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_STOP'),
  valid: Intl.formatMessage('BASS_MEMBER_MANAGEMENT_RESTART'),
  pending: '- -'
};
