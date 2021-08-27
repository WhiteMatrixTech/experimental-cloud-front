import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

import { Modal, Button, Input } from 'antd';
import { PushpinOutlined } from '@ant-design/icons';
import styles from './index.less';

interface Iprop {
  hash: string
}
export default function SetFixed(prop: Iprop) {
  const [model, setModel] = useState(false);

  return (
    <>
      <div className={styles.shareLink} onClick={() => setModel(true)}>
        <PushpinOutlined className={styles.icon} />
        设置固定
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
            <PushpinOutlined className={styles.icon} />
          </div>
          <p className={styles.title}>设置固定</p>
          <div className={styles.content}>选择你想将这些文件固定到哪里</div>
          <div className={styles.modelFooter}>
            <Button
              className={styles.cancelButton}
              onClick={() => setModel(false)}>
              关闭
            </Button>
            <Button
              className={styles.copyButton}
              onClick={() => {
                copy(`https://ipfs.io/ipfs/${prop.hash}`);
                setModel(false);
              }}>
              复制
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
