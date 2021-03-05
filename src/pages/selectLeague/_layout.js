import { LeaguePageLayout } from 'components';
function NetworkLayout(props) {
  const { children, location } = props;
  const { pathname } = location;
  return <LeaguePageLayout children={children} pathname={pathname} />;
}

NetworkLayout.wrappers = ['wrappers/auth'];

export default NetworkLayout;
