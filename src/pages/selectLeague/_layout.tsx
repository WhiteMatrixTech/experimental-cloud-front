import { LeaguePageLayout } from '~/components';
import { BasicLayoutComponentProps } from '~/utils/types';

function NetworkLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <LeaguePageLayout children={children} pathname={pathname} />;
}

NetworkLayout.wrappers = ['wrappers/auth'];

export default NetworkLayout;
