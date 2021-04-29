export const DisabledRole = ['NetworkAdmin', 'NetworkMember', 'OrgMember'];

export const defaultValue = {
  BlockInfo: 'All',
  Transaction: 'All',
  viewChaincode: 'InChannel',
  downloadChaincode: 'InChannel',
  invokeChaincode: 'InChannel',
};

export function setParams(formValue, roleName, networkName, chaincodeList) {
  let params = {
    networkName,
    roleName,
    policy: [
      {
        action: 'Read',
        subject: 'BlockInfo',
        field: formValue.BlockInfo,
      },
      {
        action: 'Read',
        subject: 'Transaction',
        field: formValue.Transaction,
      },
      {
        action: 'Read',
        subject: 'ChainCode',
        field: formValue.viewChaincode,
      },
      {
        action: 'Download',
        subject: 'ChainCode',
        field: formValue.downloadChaincode,
      },
      {
        action: 'QueryChainCodeMethod',
        subject: 'ChainCode',
        field: formValue.invokeChaincode,
      },
      {
        action: 'InvokeChainCodeMethod',
        subject: 'ChainCode',
        field: formValue.invokeChaincode,
      },
    ],
  };
  if (formValue.invokeChaincode === 'Custom') {
    const customList = [];
    formValue.invokeChaincodeSubject.forEach((chainCodeName) => {
      const chaincode = chaincodeList.find((item) => item.chainCodeName === chainCodeName);
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
