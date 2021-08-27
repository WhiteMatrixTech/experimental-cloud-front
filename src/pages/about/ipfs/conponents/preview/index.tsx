import React, { useState, useCallback } from 'react';
import { connect } from 'dva';


import { Dispatch } from 'umi';
import { ConnectState } from '~/models/connect';
import FileViewer from 'react-file-viewer';

import styles from './index.less';

interface Iprops {
  src: string;
  type: string;
  User: ConnectState['User'];
  dispatch: Dispatch
}
function Preview(props: Iprops) {
  switch (props.type) {
    case 'txt':
      return (
        <pre>
          {props.src}
        </pre>
      )

    default:
      return (
        <div style={{ height: '50vh', margin: '30px auto' }}>
          <FileViewer fileType={props.type} filePath={props.src} />
        </div>
      )
  }
}

export default connect(({ User, Ipfs }) => ({
  User,
  Ipfs,

}))(Preview);
