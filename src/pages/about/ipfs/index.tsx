/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Dispatch, request } from 'umi';

import { ConnectState } from '~/models/connect';

import { Table, Menu, Dropdown, Upload, Button, notification } from 'antd';
import copy from 'copy-to-clipboard';

import {
  FolderOpenOutlined,
  FileOutlined,
  EllipsisOutlined,
  CopyOutlined,
  PushpinOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Breadcrumb, SearchBar } from '~/components';
import { saveAs } from 'file-saver';

import { DelateFile, Rename, ShareLink, NewFolder, Preview } from './conponents'
import { MenuList, getCurBreadcrumb } from '~/utils/menu';
import styles from './index.less';
import { getTokenData } from '~/utils/encryptAndDecrypt';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/ipfs');


interface Iprops {
  Ipfs: {
    ipfsList: [],
    downloadFileRs: any,
    stat: {
      cid: string,
      type: string
    }
  }
  qryLoading: boolean;
  User: ConnectState['User'];
  dispatch: Dispatch
}
function IPFS(props: Iprops) {
  const { Ipfs, qryLoading, dispatch, User } = props;
  const { networkName } = User;
  const { ipfsList, stat } = Ipfs;
  const { cid } = stat;
  const pathHash = cid;
  const [ipfsHash, setIpfsHash] = useState('');
  const [value, setValue] = useState('');
  const [path, setPath] = useState('');
  const [name, setName] = useState<string>('');
  const [type, setType] = useState('');
  const [visiable, setVisiable] = useState<boolean>(false);
  const [fileType, setFileType] = useState('');

  const [file, setFile] = useState<string | undefined>()

  const { accessToken, roleToken } = getTokenData();

  const uploadProps = {
    name: 'file' || 'directory',
    listType: 'text',
    action: `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/add`,
    // accept: '.zip, .jar, .rar, .gz',
    multiple: false,
    showUploadList: false,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      RoleAuth: roleToken || '',
    },

    onChange(info: { file: { status: string; name: any; response: any } }) {
      if (info.file.status === 'done') {
        request(`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/cpFile?from=/ipfs/${info.file.response[0].cid}&to=${path}/${info.file.response[0].path}`, {
          mode: 'cors',
          method: 'POST',
        }).then((res: any) => {

          notification.success({ message: `Succeed in uploading ${info.file.name}`, top: 64, duration: 3 });
          setTimeout(function () {
            window.location.reload();
          }, 1000)

        })
          .catch((errMsg) => {
            console.log(errMsg)
          });

      } else if (info.file.status === 'error') {
        notification.error({
          message: info.file.response ? info.file.response.message : '合约上传出错',
          top: 64,
          duration: 3,
        });
      }
    },
  };

  // 搜索
  const onSearch = (value: string, event: any): void => {
    if (event.type && (event.type === 'click' || event.type === 'keydown')) {
      setPath(`/ipfs/${value}`);
      getPathHash();
      if (type === 'directory') {
        setIpfsHash(`/ipfs/${value || pathHash}`);
      }
      if (type === 'file') {
        request(
          `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/catFile?ipfsPath=${value}`,
          {
            mode: 'cors',
            method: 'POST',
            responseType: 'blob'
          }
        )
          .then((res: any) => {
            const fileBlob = new Blob([res], { type: 'text/plain' });
            let imgSrc = window.URL.createObjectURL(fileBlob);
            const typeName = name.split('.').pop().toLowerCase()
            if (typeName === 'txt' || 'yaml' || 'md') {
              fileBlob.text().then(data => {
                setFile(data)
              })
            }
            if (typeName !== 'txt' || 'yaml' || 'md') {
              setFile(imgSrc)
            }
            setFileType(typeName)
          })
      }

      setVisiable(true);
      if (value === '') {
        setVisiable(false)
        setPath('/');
        getPathHash();
        setFileType('')
        setFile('')
      }
    }
  };

  const getPathHash = useCallback(() => {
    const params = {
      networkName,
      path: path || '/'
    };
    dispatch({
      type: 'Ipfs/getPathHash',
      payload: params
    });
  }, [dispatch, networkName, path]);

  const downloadFile = () => {
    if (type === 'file') {
      request(
        `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/download?path=${value}&name=${name}`,
        {
          mode: 'cors',
          method: 'GET',
          responseType: 'blob'
        }
      )
        .then((res: any) => {
          const file = new File([res], name, { type: 'text/plain' });
          saveAs(file);
        })
        .catch((errMsg) => {
          if (!errMsg) {
            notification.error({ message: '文件下载失败', top: 64, duration: 3 });
          }
        });
    }

    if (type === 'dir') {
      request(
        `http://8.142.34.146:5001/api/v0/get?arg=${value}&compress=true&compression-level=5&archive=true`,
        {
          method: 'POST',
          responseType: 'blob',
        }
      )
        .then((res: any) => {
          const file = new File([res], `${name}.zip`, { type: 'application/tar+gzip' });

          saveAs(file);
        })
        .catch((errMsg) => {
          // DOMException: The user aborted a request.
          if (!errMsg) {
            notification.error({ message: '文件夹下载失败', top: 64, duration: 3 });
          }
        });
    }
  };



  const getIpfsList = useCallback(() => {
    const params = {
      networkName,
      cid: ipfsHash
    };
    dispatch({
      type: 'Ipfs/getIpfsList',
      payload: params
    });
  }, [dispatch, networkName, ipfsHash]);

  const menuHeader = (
    <Menu>
      <Menu.Item key="0">
        <Upload {...uploadProps}>
          <div className={styles.import}>
            <FileOutlined
              style={{ color: '#69c4cd', fontSize: '20px', marginRight: '10px' }}
            />
          文件
        </div>
        </Upload>
      </Menu.Item>
      <Menu.Item key="1">
        <div className={styles.uploadFolder}>
          <input type='file' webkitdirectory='true' onChange={(e: any) => {
            var fd = new FormData();
            for (var i = 0; i < e.target.files.length; i++) {
              fd.append(`file${i}`, e.target.files[i]);
            }


            request(
              `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/add`,
              {
                mode: 'cors',
                method: 'POST',
                requestType: 'form',
                data: fd
              }
            )
              .then((res: any) => {
                const folder = res.pop()
                request(`${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/cpFile?from=/ipfs/${folder.cid}&to=${path}/${folder.path}`, {
                  mode: 'cors',
                  method: 'POST',
                }).then((res: any) => {
                  if (res) {
                    notification.success({ message: '文件夹上传成功', top: 64, duration: 3 });
                    setTimeout(function () {
                      window.location.reload();
                    }, 1000)
                  }
                })

              })
              .catch((errMsg) => {
                if (!errMsg) {
                  notification.error({ message: '文件夹上传失败', top: 64, duration: 3 });
                }
              });
          }} />
          <div className={styles.import}>
            <FolderOpenOutlined
              style={{ color: '#69c4cd', fontSize: '20px', marginRight: '10px' }}
            />
          文件夹
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <NewFolder path={path} name={name} />
      </Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu>
      <Menu.Item key="a">
        <ShareLink hash={value} />
      </Menu.Item>
      <Menu.Item key="b">
        <div className={styles.moreItem} onClick={() => copy(value)}>
          <CopyOutlined className={styles.moreIcon} />
          复制CID
        </div>
      </Menu.Item>
      {/* <Menu.Item key="c">
        <SetFixed hash={value} />
      </Menu.Item> */}
      <Menu.Item key="d">
        <div className={styles.moreItem} onClick={downloadFile}>
          <DownloadOutlined className={styles.moreIcon} />
          下载
        </div>
      </Menu.Item>
      <Menu.Item key="e">
        <Rename path={path} name={name} pathHash={pathHash} fun={setIpfsHash} />
      </Menu.Item>
      <Menu.Item key="f">
        <DelateFile path={path} name={name} />
      </Menu.Item>
    </Menu>
  );

  const catFile = (text: any) => {
    if (text.type === 'dir') {
      setPath(`${path}/${text.name}`)

      setIpfsHash(text.fileCid)
    }
    if (text.type === 'file') {
      request(
        `${process.env.BAAS_BACKEND_LINK}/network/${networkName}/ipfs/download?path=${text.fileCid}&name=${text.name}`,
        {
          mode: 'cors',
          method: 'GET',
          responseType: 'blob'
        }
      )
        .then((res: any) => {
          const fileBlob = new Blob([res], { type: 'text/plain' });
          let imgSrc = window.URL.createObjectURL(fileBlob);
          const typeName = text.name.split('.').pop().toLowerCase()
          if (typeName === 'txt' || 'yaml' || 'md') {
            fileBlob.text().then(data => {
              setFile(data)
            })
          }
          if (typeName !== 'txt' || 'yaml' || 'md') {
            setFile(imgSrc)
          }
          setFileType(typeName)
          setVisiable(true)
          setPath(`${path}/${text.name}`)
        })
        .catch((errMsg) => {
          // DOMException: The user aborted a request.
          if (!errMsg) {
            notification.error({ message: '文件下载失败', top: 64, duration: 3 });
          }
        });
    }
  }
  const columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: '',
      ellipsis: true,
      render: (text: any) => (
        <div
          style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }} onClick={() => catFile(text)}>
          <div>
            {text.type === 'dir' ? <FolderOpenOutlined
              style={{ fontSize: '30px', color: '#69c4cd' }}
            /> : <FileOutlined style={{ fontSize: '30px', color: '#69c4cd' }} />}
          </div>
          <div style={{ marginLeft: '10px' }}>
            <div>{text.name}</div>
            <div style={{ color: '#b7bbc8' }}>{text.fileCid}</div>
          </div>
        </div>
      )
    },
    {
      title: '固定状态',
      key: 'state',
      dataIndex: '',
      ellipsis: true,
      render: (text: any) => (
        text.isPin === "pin" && (
          <div>
            <PushpinOutlined style={{ fontSize: '20px', color: '#69c4cd' }} />
          </div>)
      )
      ,
      width: '10%'
    },
    {
      title: '大小',
      key: 'size',
      dataIndex: 'size',
      ellipsis: true,
      width: '10%'
    },
    {
      title: '',
      dataIndex: '',
      ellipsis: true,
      key: 'more',
      render: (text: any) => (
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            <EllipsisOutlined
              style={{ fontSize: '40px', color: '#d9dbe2' }}
              onClick={() => { setValue(text.fileCid); setName(text.name); setType(text.type) }}
            />
          </a>
        </Dropdown>
      ),
      width: '10%'
    }
  ];

  console.log('path', path)


  useEffect(() => {
    getPathHash();
  }, [getPathHash]);

  useEffect(() => {
    setIpfsHash(pathHash);
  }, [pathHash]);

  useEffect(() => {
    if (ipfsHash) {
      getIpfsList();
    }
  }, [getIpfsList, ipfsHash])



  return (
    <div className="page-wrapper">
      <Breadcrumb breadCrumbItem={breadCrumbItem} />
      <div className="page-content page-content-shadow table-wrapper">
        <div className={styles['ipfs-wrapper']}>

          <SearchBar placeholder="QmHash/bafyHash" onSearch={onSearch} />


          {!visiable && <div className={styles['header']}>
            <Dropdown overlay={menuHeader} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                <Button type="primary">
                  <i>+ </i> 导入
                </Button>
              </a>
            </Dropdown>
          </div>}
          {!file &&
            <Table
              rowKey="ipfsHash"
              loading={qryLoading}
              columns={columns}
              dataSource={ipfsList}
              pagination={
                {
                  pageSize: 5,
                  position: ['bottomCenter']
                }
              } />}
          {file && <Preview type={fileType} src={file} />}

        </div>

      </div>
    </div>
  );
}

export default connect(({ User, Ipfs, loading }) => ({
  User,
  Ipfs,
  qryLoading: loading.effects['Ipfs/getIpfsList']
}))(IPFS);
