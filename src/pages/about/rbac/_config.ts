import { RbacRole } from 'umi';

// 访问行为
export enum AccessOperation {
  QUERY = 'QUERY', // 查看
  INTERACT = 'INTERACT', // 链码调用方法
  DOWNLOAD = 'DOWNLOAD' // 合约下载
}

// 资源类型
export enum AccessResource {
  BLOCK = 'BLOCK',
  TRANSACTION = 'TRANSACTION',
  CHAIN_CODE = 'CHAIN_CODE'
}

// 访问范围
export enum AccessScope {
  ALL = 'ALL', // 可访问网络下所有资源
  CHANNEL = 'CHANNEL', // 可访问通道下的所有资源
  SELF = 'SELF', // 可访问自己创建的资源
  NONE = 'NONE', // 任何资源无法访问
  CUSTOM = 'CUSTOM'
}

export type UserAccessPolicy = {
  operation: AccessOperation; // 访问行为
  resource: AccessResource; // 访问资源类型
  scope: AccessScope; // 可访问的范围
};

export const defaultAccessValue = {
  BlockInfo: AccessScope.ALL,
  Transaction: AccessScope.ALL,
  viewChaincode: AccessScope.CHANNEL,
  downloadChaincode: AccessScope.CHANNEL,
  invokeChaincode: AccessScope.CHANNEL
};

export function setParams(formValue: any, roleName: string, networkName: string) {
  let params: RbacRole & { networkName: string } = {
    networkName,
    roleName,
    policy: [
      {
        operation: AccessOperation.QUERY,
        resource: AccessResource.BLOCK,
        scope: formValue.BlockInfo
      },
      {
        operation: AccessOperation.QUERY,
        resource: AccessResource.TRANSACTION,
        scope: formValue.Transaction
      },
      {
        operation: AccessOperation.QUERY,
        resource: AccessResource.CHAIN_CODE,
        scope: formValue.viewChaincode
      },
      {
        operation: AccessOperation.DOWNLOAD,
        resource: AccessResource.CHAIN_CODE,
        scope: formValue.downloadChaincode
      },
      {
        operation: AccessOperation.INTERACT,
        resource: AccessResource.CHAIN_CODE,
        scope: formValue.invokeChaincode
      }
    ]
  };
  return params;
}
export interface configValueState {
  BlockInfo?: string;
  Transaction?: string;
  viewChaincode?: string;
  downloadChaincode?: string;
  invokeChaincode?: string;
  invokeChaincodeSubject?: string[];
}
