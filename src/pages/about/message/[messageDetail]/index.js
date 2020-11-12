import React, { Component } from 'react';
import { connect } from "dva";
import { history } from 'umi';
import { Breadcrumb } from 'components';
import { MenuList, getCurBreadcrumb } from 'utils/menu.js';
import style from './index.less';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const breadCrumbItem = getCurBreadcrumb(MenuList, '/about/message')
breadCrumbItem.push({
  menuName: "消息详情",
  menuHref: `/`,
})

class MessageDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    const { match: { params: { messageDetail } } } = this.props;
    this.props.dispatch({
      type: 'Message/getMesDetail',
      payload: { messageId: messageDetail }
    })
  }

  onClickReturn = () => {
    history.push('/about/message')
  }

  onClickDelete = () => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除此条消息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: this.onDeleteMes
    });
  }

  onDeleteMes = () => {
    const { match: { params: { messageDetail } } } = this.props;
    this.props.dispatch({
      type: 'Message/deleteMes',
      payload: { messageId: messageDetail }
    }).then(res => {
      if (res) {
        history.push('/about/message')
      }
    })
  }

  render() {
    return (
      <div className='page-wrapper'>
        <Breadcrumb breadCrumbItem={breadCrumbItem} />
        <div className='page-content'>
          <div className={style['message-detail-wrapper']}>
            <ul>
              <li>发送方: 系统</li>
              <li>2020-11-06 15:21:07</li>
            </ul>
            <span>
              <Button className='default-blue-btn' style={{ marginRight: '10px' }} onClick={this.onClickReturn}>
                返回
                </Button>
              <Button type="primary" danger onClick={this.onClickDelete}>
                删除
                </Button>
            </span>
          </div>
          <div className={style['message-detail-wrapper']}>
            <div className={style['message-content-wrapper']}>
              <div className={style['message-title']}>交易通知</div>
              <div>尊敬的用户:</div>
              <div className={style['message-content']}>
                您好，【金山云org1593778464955】（组织MSP：Sorg1593778464955MSP）于 2020-11-06 15:21:07 在【数研院】的【数研院】（通道名：syychannel）成功调用了合约【jsjrfw】（合约版本： 1.2），产生了一笔交易，交易ID为【4a071bf420c7a4c89d922c657d9fd59c680b913a7074b7ab68a6a3b1b50d1aa5】，请在【交易-交易详情】页面查看交易详情
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default connect(({ Message, loading }) => ({
  Message,
  qryLoading: loading.effects['Message/getMesDetail']
}))(MessageDetail);
