import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

import { Modal, Button, Input } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import styles from './index.less';

interface Iprop {
  hash: string
}
export default function ShareLink(prop: Iprop) {
  const [model, setModel] = useState(false);

  return (
    <>
      <div className={styles.shareLink} onClick={() => setModel(true)}>
        <ShareAltOutlined className={styles.icon} />
        分享链接
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
            <ShareAltOutlined className={styles.icon} />
          </div>
          <p className={styles.title}>共享文件</p>
          <div className={styles.content}>请复制以下链接并与您的朋友分享。</div>
          <Input
            className={styles.input}
            disabled={true}
            value={`https://ipfs.io/ipfs/${prop.hash}`}
          />
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
