import { BaaSLayout } from '@/components';
import { BasicLayoutComponentProps } from '@/utils/types';

function BasicLayout(props: BasicLayoutComponentProps) {
  const { children, location } = props;
  const { pathname } = location;
  return <BaaSLayout children={children} pathname={pathname} />;
}

export default BasicLayout;
