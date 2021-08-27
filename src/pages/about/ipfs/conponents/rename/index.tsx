import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';

import { Modal, Button, Input } from 'antd';
import { Dispatch } from 'umi';

import { EditOutlined } from '@ant-design/icons';
import { ConnectState } from '~/models/connect';
import styles from './index.less';

interface Iprops {
  path: string;
  name: string;
  pathHash: string;
  fun: Function;
  User: ConnectState['User'];
  dispatch: Dispatch
}
function Rename(props: Iprops) {
  const { dispatch, User } = props;
  const { networkName } = User;
  const [model, setModel] = useState(false);
  const [value, setValue] = useState('')


  const onClickRename = useCallback(() => {
    setModel(false);
    const params = {
      networkName,
      from: `${props.path}/${props.name}`,
      to: `${props.path}/${value}`
    };
    dispatch({
      type: 'Ipfs/rename',
      payload: params
    }).then((res: any) => {
      if (res) {
        setTimeout(function () {
          window.location.reload()
        }, 1000)
      }
    });
  }, [dispatch, networkName, value, props])



  return (
    <>
      <div className={styles.rename} onClick={() => setModel(true)}>
        <EditOutlined className={styles.icon} />
        重命名
      </div>
      <Modal
        centered={true}
        visible={model}
        wrapClassName={styles.web}
        footer={null}
        maskClosable={false}
        onCancel={() => setModel(false)}>
        <div className={styles.shareModel}>
          <div className={styles.shareLogo}>
            <EditOutlined className={styles.icon} />
          </div>
          <p className={styles.title}>重命名</p>
          <div className={styles.content}>重命名此文件</div>
          <Input className={styles.input} defaultValue={props.name} onChange={(e) => setValue(e.target.value)} />
          <div className={styles.modelFooter}>
            <Button
              className={styles.cancelButton}
              onClick={() => setModel(false)}>
              关闭
            </Button>
            <Button
              className={styles.copyButton}
              onClick={onClickRename}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default connect(({ User, Ipfs }) => ({
  User,
  Ipfs,

}))(Rename);
