import { BaaSLayout } from 'components';

function BasicLayout(props) {
  const { children, location } = props;
  const { pathname } = location;
  return <BaaSLayout children={children} pathname={pathname} />
}

BasicLayout.wrappers = ['wrappers/auth']

export default BasicLayout;
