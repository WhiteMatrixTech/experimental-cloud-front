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
  pending: '未审批',
  approved: '通过',
  rejected: '驳回',
};

export const validStatus = {
  // 可用状态
  invalid: '停用',
  valid: '启用',
  pending: '- -',
};
