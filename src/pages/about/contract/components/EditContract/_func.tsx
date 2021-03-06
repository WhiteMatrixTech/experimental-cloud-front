import { notification } from 'antd';

export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

// 上传前校验文件大小
export const handleBeforeUpload = (file: any, beforeUploadList: any[]) => {
  const biggerThanMaxSize = beforeUploadList.some((innerItem) => innerItem.size > 1024 * 1024 * 1024 * 5);
  if (biggerThanMaxSize) {
    notification.error({ message: '合约文件大小不能超过5M', top: 64, duration: 3 });
    return false;
  }
  return true;
};
