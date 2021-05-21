import { CommonPortalLayout } from '~/components';
import { BasicLayoutComponentProps } from '~/utils/types';

function CommonPortalBasicLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <CommonPortalLayout children={children} pathname={pathname} />;
}

export default CommonPortalBasicLayout;
