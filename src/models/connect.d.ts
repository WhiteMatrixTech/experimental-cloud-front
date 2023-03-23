import { BlockChainCompileModelState } from './block-chain-compile';
import { BlockModelState } from './block';
import { CertificateModelState } from './certificate';
import { ChannelModelState } from './channel';
import { ClusterModelState } from './cluster';
import { ContractModelState } from './contract';
import { CustomImageModelState } from './custom-image';
import { DashboardModelState } from './dashboard';
import { DIDModelState } from './did';
import { ElasticServerModelState } from './elastic-cloud-server';
import { MemberModelState } from './member';
import { EvidenceModelState } from './evidence';
import { FabricRoleModelState } from './fabric-role';
import { LayoutModelState } from './layout';
import { LogsModelState } from './logs';
import { MessageModelState } from './message';
import { MyInfoModelState } from './my-info';
import { PeerModelState } from './node';
import { OrganizationModelState } from './organization';
import { RBACModelState } from './rbac';
import { TransactionsModelState } from './transactions';
import { UserModelState } from './user';
import { UserRoleModelState } from './user-role';

export declare type ConnectState = {
  Block: BlockModelState;
  BlockChainCompile: BlockChainCompileModelState;
  Certificate: CertificateModelState;
  Channel: ChannelModelState;
  Cluster: ClusterModelState;
  Contract: ContractModelState;
  CustomImage: CustomImageModelState;
  Dashboard: DashboardModelState;
  DID: DIDModelState;
  ElasticServer: ElasticServerModelState;
  Member: MemberModelState;
  Evidence: EvidenceModelState;
  FabricRole: FabricRoleModelState;
  Layout: LayoutModelState;
  Logs: LogsModelState;
  Message: MessageModelState;
  MyInfo: MyInfoModelState;
  Peer: PeerModelState;
  Organization: OrganizationModelState;
  RBAC: RBACModelState;
  Transactions: TransactionsModelState;
  User: UserModelState;
  UserRole: UserRoleModelState;
  loading: { effects: Record<boolean> };
};
