import { Row, Col } from 'antd';
import styles from './index.less';

export default function NodeExplorer() {
  return (
    <div className={styles['tabs-body']}>
      <Row gutter={[16, 16]}>
        <Col span={5}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <div className={styles.inline}>
                <iframe
                  src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=14`}
                  title="Memory Basic"
                  id="Memory Basic"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.inline}>
                <iframe
                  src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=75`}
                  title="Memory Basic"
                  id="Memory Basic"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.inline}>
                <iframe
                  src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=15`}
                  title="Memory Basic"
                  id="Memory Basic"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.inline}>
                <iframe
                  src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=20`}
                  title="Memory Basic"
                  id="Memory Basic"
                  frameBorder="0"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <div className={styles['h215-iframe']}>
            <iframe
              src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=7`}
              title="CPU Basic"
              id="CPU Basic"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={13}>
          <div className={styles['h215-iframe']}>
            <iframe
              src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=175`}
              title="Time Spent Doing I/Os"
              id="Time Spent Doing I/Os"
              frameBorder="0"
            ></iframe>
          </div>
        </Col>
        <Col span={5}>
          <iframe
            src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=156`}
            title="Memory Basic"
            id="Memory Basic"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={6}>
          <iframe
            src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=157`}
            title="Network Traffic Basic"
            id="Network Traffic Basic"
            frameBorder="0"
          ></iframe>
        </Col>
        <Col span={13}>
          <iframe
            src={`${process.env.FABRIC_NODE_EXPLORER}?orgId=1&refresh=5s&theme=light&panelId=164`}
            title="Disk Space Used Basic(EXT4/XFS)"
            id="Disk Space Used Basic(EXT4/XFS)"
            frameBorder="0"
          ></iframe>
        </Col>
      </Row>
    </div>
  );
}
