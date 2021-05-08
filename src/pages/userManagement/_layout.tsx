import { LeaguePageLayout } from '@/components';
import { BasicLayoutComponentProps } from '@/utils/types';

function UserManagementLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <LeaguePageLayout children={children} pathname={pathname} />;
}

export default UserManagementLayout;
