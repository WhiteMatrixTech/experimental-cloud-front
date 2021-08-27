import React, { useState, useCallback } from 'react';
import { connect } from 'dva';


import { Modal, Button } from 'antd';
import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';

import { DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';

interface Iprops {
  path: string;
  name: string;
  User: ConnectState['User'];
  dispatch: Dispatch
}
function DelateFile(props: Iprops) {
  const { dispatch, User } = props;
  const { networkName } = User;
  const [model, setModel] = useState(false);

  const onClickDelate = useCallback(() => {
    setModel(false);
    const params = {
      networkName,
      path: `${props.path}/${props.name}`,
    };
    dispatch({
      type: 'Ipfs/delateFile',
      payload: params
    }).then(() => {
      setTimeout(function () {
        window.location.reload()
      }, 1000)
    });
  }, [dispatch, networkName, props])

  return (
    <>
      <div className={styles.delateFile} onClick={() => setModel(true)}>
        <DeleteOutlined className={styles.icon} />
        移除
      </div>
      <Modal
        centered={true}
        visible={model}
        wrapClassName={styles.web}
        footer={null}
        maskClosable={false}
        onCancel={() => setModel(false)}>
        <div className={styles.delateModel}>
          <div className={styles.delateLogo}>
            <DeleteOutlined className={styles.icon} />
          </div>
          <p className={styles.title}>共享文件</p>
          <div className={styles.content}>
            您确定要删除这些1个文件夹吗？它们将不再出现在“文件”页面中，并将在下次自动清理中被永久删除（虽然它的副本可能存在于其他IPFS节点上），此操作具有不可逆性。
          </div>
          <div className={styles.modelFooter}>
            <Button
              className={styles.cancelButton}
              onClick={() => setModel(false)}>
              取消
            </Button>
            <Button
              className={styles.delateButton}
              onClick={
                onClickDelate
              }>
              移除
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

}))(DelateFile);
