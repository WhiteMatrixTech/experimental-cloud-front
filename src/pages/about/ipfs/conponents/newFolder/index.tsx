import React, { useState, useCallback } from 'react';
import { connect } from 'dva';

import { Modal, Button, Input } from 'antd';
import { Dispatch } from 'umi';

import { FolderAddOutlined } from '@ant-design/icons';
import { ConnectState } from '~/models/connect';

import styles from './index.less';


interface Iprops {
  path: string;
  name: string;
  User: ConnectState['User'];
  dispatch: Dispatch
}
function NewFloder(props: Iprops) {
  const { dispatch, User } = props;
  const { networkName } = User;
  const [model, setModel] = useState(false);
  const [value, setValue] = useState('')

  const newFolder = useCallback(() => {
    setModel(false);
    const params = {
      networkName,
      path: `${props.path}/${value}`
    };
    dispatch({
      type: 'Ipfs/newFolder',
      payload: params
    }).then((res: any) => {
      if (res) {
        window.location.reload()
      }
    });
  }, [dispatch, networkName, props, value])

  return (
    <>
      <div className={styles.newFolder} onClick={() => setModel(true)}>
        <FolderAddOutlined className={styles.icon} />
        新建文件夹
      </div>
      <Modal
        centered={true}
        visible={model}
        wrapClassName={styles.web}
        footer={null}
        maskClosable={false}
        onCancel={() => setModel(false)}>
        <div className={styles.newFolderModel}>
          <div className={styles.newFolderLogo}>
            <FolderAddOutlined className={styles.icon} />
          </div>
          <p className={styles.title}>新建文件夹</p>
          <div className={styles.content}>输入新建文件夹名称</div>
          <Input className={styles.input} onChange={(e) => setValue(e.target.value)} />
          <div className={styles.modelFooter}>
            <Button
              className={styles.cancelButton}
              onClick={() => setModel(false)}>
              取消
            </Button>
            <Button
              className={styles.copyButton}
              onClick={newFolder}>
              创建
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

}))(NewFloder);
