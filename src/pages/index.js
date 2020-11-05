import React from "react";
import { Redirect } from 'umi';

const index = () => <Redirect to="/about/leagueDashboard" />;

index.wrappers = ['wrappers/auth']

export default index;