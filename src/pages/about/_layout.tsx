import { NetworkPortalLayout } from '~/components';
import { BasicLayoutComponentProps } from '~/utils/types';

function BasicLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <NetworkPortalLayout children={children} pathname={pathname} />;
}

export default BasicLayout;
