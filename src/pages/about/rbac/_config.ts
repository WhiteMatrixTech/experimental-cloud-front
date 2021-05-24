import { RbacRole } from 'umi';

// 访问行为
export enum AccessAction {
  Read = 'Read', // 查看
  QueryMethod = 'QueryChainCodeMethod', // 链码调用方法
  InvokeMethod = 'InvokeChainCodeMethod', // 链码查询方法
  Download = 'Download', // 合约下载
}

// 资源类型
export enum AccessSubject {
  BlockInfo = 'BlockInfo',
  Transaction = 'Transaction',
  ChainCode = 'ChainCode',
}

// 访问范围
export enum AccessField {
  All = 'All', // 可访问网络下所有资源
  InChannel = 'InChannel', // 可访问通道下的所有资源
  Own = 'Own', // 可访问自己创建的资源
  None = 'None', // 任何资源无法访问
  Custom = 'Custom', // 只能访问指定资源
}

// chainCode唯一标识符
export type ChainCodeIndex = {
  networkName: string;
  channelId: string;
  chainCodeName: string;
};

export type UserAccessPolicy = {
  action: AccessAction; // 访问行为
  subject: AccessSubject; // 访问资源类型
  field: AccessField; // 可访问的范围
  custom?: ChainCodeIndex[]; // 如果自定义，则为链码的index
};

export const DisabledRole = ['NetworkAdmin', 'NetworkMember', 'OrgMember'];

export const defaultValue = {
  BlockInfo: AccessField.All,
  Transaction: AccessField.All,
  viewChaincode: AccessField.InChannel,
  downloadChaincode: AccessField.InChannel,
  invokeChaincode: AccessField.InChannel,
};

export function setParams(formValue: any, roleName: string, networkName: string, chaincodeList: ChainCodeIndex[]) {
  let params: RbacRole & { networkName: string } = {
    networkName,
    roleName,
    policy: [
      {
        action: AccessAction.Read,
        subject: AccessSubject.BlockInfo,
        field: formValue.BlockInfo,
      },
      {
        action: AccessAction.Read,
        subject: AccessSubject.Transaction,
        field: formValue.Transaction,
      },
      {
        action: AccessAction.Read,
        subject: AccessSubject.ChainCode,
        field: formValue.viewChaincode,
      },
      {
        action: AccessAction.Download,
        subject: AccessSubject.ChainCode,
        field: formValue.downloadChaincode,
      },
      {
        action: AccessAction.QueryMethod,
        subject: AccessSubject.ChainCode,
        field: formValue.invokeChaincode,
      },
      {
        action: AccessAction.InvokeMethod,
        subject: AccessSubject.ChainCode,
        field: formValue.invokeChaincode,
      },
    ],
  };
  if (formValue.invokeChaincode === 'Custom') {
    const customList: any[] = [];
    formValue.invokeChaincodeSubject.forEach((chainCodeName: string) => {
      const chaincode = chaincodeList.find((item: ChainCodeIndex) => item.chainCodeName === chainCodeName);
      if (chaincode) {
        const chaincodeInfo = {
          networkName,
          channelId: chaincode.channelId,
          chainCodeName: chaincode.chainCodeName,
        };
        customList.push(chaincodeInfo);
      }
    });
    params.policy[4].custom = customList;
    params.policy[5].custom = customList;
  }
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
