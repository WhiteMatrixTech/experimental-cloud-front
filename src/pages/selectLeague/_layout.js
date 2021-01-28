
function NetworkLayout(props) {
  const { children } = props;
  return <>{children}</>
}

NetworkLayout.wrappers = ['wrappers/auth']

export default NetworkLayout;
