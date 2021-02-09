import { BaaSLayout } from 'components';

function BasicLayout(props) {
  const { children, location } = props;
  const { pathname } = location;
  return <BaaSLayout children={children} pathname={pathname} />;
}

export default BasicLayout;
