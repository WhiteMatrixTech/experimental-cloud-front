type ProgressStatus = 'success' | 'normal' | 'exception' | 'active' | undefined;

export const passwordProgressMap: {
  ok: ProgressStatus;
  pass: ProgressStatus;
  poor: ProgressStatus;
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};