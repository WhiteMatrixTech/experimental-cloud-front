import type { Dispatch } from 'umi';

type BasicComponentProps = {
  dispatch: Dispatch;
};

type BasicLayoutComponentProps = {
  children: JSX.Element;
  location: Location;
};

type BasicPaginationParams = {
  offset: number;
  limit: number;
};

type AllPaginationParams = {
  from: undefined | number | Date; // 分页开始
  offset: number; // 分页偏移量
  limit: number; // 每页数目
  ascend?: boolean; // 是否升序
};

type BasicApiParams = {
  networkName: string;
  channelId?: string;
};

interface DetailViewAttr {
  label: string;
  value: any;
  fullRow?: boolean;
  onClick?: () => void;
  buttonName?: string;
  showJson?: boolean;
}

export {
  BasicComponentProps,
  BasicLayoutComponentProps,
  BasicPaginationParams,
  AllPaginationParams,
  BasicApiParams,
  DetailViewAttr,
};
