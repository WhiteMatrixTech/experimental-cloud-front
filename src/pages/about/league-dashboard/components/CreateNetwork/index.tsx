import React, { useState, useMemo, useCallback } from 'react';
import { Button, Modal, Steps } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'umi';
import { useBoolean, useGetState } from 'ahooks';
import { ConnectState } from '~/models/connect';
import ConfigNetwork from './ConfigNetwork';
import { ConfigOrg } from './ConfigOrg';
import { ConfigChannel } from './ConfigChannel';
import styles from './index.less';

const { Step } = Steps;

export enum EStepType {
  CONFIG_NETWORK,
  CONFIG_ORG,
  CONFIG_CHANNEL
}

interface CreateNetworkProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: (res?: any) => void;
  createLoading: boolean;
  User: ConnectState['User'];
}

function CreateNetwork(props: CreateNetworkProps) {
  const { visible, createLoading, User, onCancel, dispatch } = props;

  const [configMode, setConfigMode] = useGetState<'default' | 'custom'>('default');
  const [currentStep, setCurrentStep] = useState<EStepType>(0);
  const [shouldCheck, { setTrue: setCheckTrue, setFalse: setCheckFalse }] = useBoolean(false);

  const [networkBaseInfo, setNetworkBaseInfo, getNetworkBaseInfo] = useGetState<Record<string, any>>({
    network: User.networkName,
    ordererNodeNum: 1,
    caCertExpiryTime: 1
  });
  const [networkOrgInfo, setNetworkOrgInfo, getNetworkOrgInfo] = useGetState<Record<string, any>>();
  const [networkChannelInfo, setNetworkChannelInfo, getNetworkChannelInfo] = useGetState<Record<string, any>>();

  const triggerCheck = useCallback(() => {
    setCheckTrue();
  }, [setCheckTrue]);

  const handleSubmit = async () => {
    const baseInfo = getNetworkBaseInfo();
    const orgInfo = getNetworkOrgInfo();
    const channelInfo = getNetworkChannelInfo();

    let createResult;
    if (configMode === 'default') {
      const defaultNetworkConfig = {
        cluster: baseInfo.cluster,
        network: baseInfo.network,
        orgName: baseInfo.orgName,
        channel: {
          name: baseInfo.channelName,
          description: baseInfo.channelDesc
        }
      };
      createResult = await dispatch({
        type: 'Dashboard/createNetworkDefault',
        payload: defaultNetworkConfig
      });
    } else {
      const customNetworkConfig = {
        ...orgInfo,
        cluster: baseInfo.cluster,
        network: baseInfo.network,
        caCertExpiryTime: `${baseInfo.caCertExpiryTime}h`,
        ordererNodeNum: baseInfo.ordererNodeNum,
        channel: {
          ...channelInfo,
          batchTimeout: `${channelInfo?.batchTimeout.timeout}${channelInfo?.batchTimeout.unit}`
        }
      };
      createResult = await dispatch({
        type: 'Dashboard/createNetworkCustom',
        payload: customNetworkConfig
      });
    }

    if (createResult) {
      onCancel(true);
    }
  };

  const failCheck = useCallback(() => {
    setCheckFalse();
  }, [setCheckFalse]);

  const afterFormCheck = (values: any, step: EStepType, isDefaultMode?: boolean) => {
    setCheckFalse();
    if (step === EStepType.CONFIG_NETWORK) {
      setNetworkBaseInfo(values);
      if (isDefaultMode) {
        handleSubmit();
      } else {
        setCurrentStep(EStepType.CONFIG_ORG);
      }
    } else if (step === EStepType.CONFIG_ORG) {
      setNetworkOrgInfo(values);
      setCurrentStep(EStepType.CONFIG_CHANNEL);
    } else if (step === EStepType.CONFIG_CHANNEL) {
      setNetworkChannelInfo(values);
      handleSubmit();
    }
  };

  const btnList = useMemo(() => {
    if (configMode === 'default') {
      return [
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={createLoading} onClick={triggerCheck}>
          创建
        </Button>
      ];
    } else {
      switch (currentStep) {
        case EStepType.CONFIG_NETWORK:
          return [
            <Button key="cancel" onClick={onCancel}>
              取消
            </Button>,
            <Button key="next" type="primary" onClick={triggerCheck}>
              下一步
            </Button>
          ];
        case EStepType.CONFIG_ORG:
          return [
            <Button key="prev" onClick={() => setCurrentStep(EStepType.CONFIG_NETWORK)}>
              上一步
            </Button>,
            <Button key="next" type="primary" onClick={triggerCheck}>
              下一步
            </Button>
          ];
        case EStepType.CONFIG_CHANNEL:
          return [
            <Button key="prev" onClick={() => setCurrentStep(EStepType.CONFIG_ORG)}>
              上一步
            </Button>,
            <Button key="submit" type="primary" loading={createLoading} onClick={triggerCheck}>
              创建
            </Button>
          ];
        default:
          return [];
      }
    }
  }, [configMode, createLoading, currentStep, onCancel, triggerCheck]);

  const drawerProps = {
    width: 600,
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '创建网络',
    footer: btnList,
    onCancel: () => onCancel()
  };

  return (
    <Modal {...drawerProps}>
      {configMode === 'custom' && (
        <Steps className={styles.step} current={currentStep}>
          <Step title="配置网络" />
          <Step title="配置组织" />
          <Step title="配置通道" />
        </Steps>
      )}
      {currentStep === EStepType.CONFIG_NETWORK && (
        <ConfigNetwork
          configMode={configMode}
          shouldCheck={shouldCheck}
          networkBaseInfo={networkBaseInfo}
          setConfigMode={setConfigMode}
          afterFormCheck={afterFormCheck}
          failCheck={failCheck}
        />
      )}
      {currentStep === EStepType.CONFIG_ORG && (
        <ConfigOrg
          shouldCheck={shouldCheck}
          networkOrgInfo={networkOrgInfo}
          afterFormCheck={afterFormCheck}
          failCheck={failCheck}
        />
      )}
      {currentStep === EStepType.CONFIG_CHANNEL && (
        <ConfigChannel
          shouldCheck={shouldCheck}
          networkChannelInfo={networkChannelInfo}
          afterFormCheck={afterFormCheck}
          failCheck={failCheck}
        />
      )}
    </Modal>
  );
}

export default connect(({ User, Dashboard, Cluster, CustomImage, loading }: ConnectState) => ({
  User,
  Dashboard,
  Cluster,
  CustomImage,
  createLoading: loading.effects['Dashboard/createNetworkDefault'] || loading.effects['Dashboard/createNetworkCustom']
}))(CreateNetwork);
