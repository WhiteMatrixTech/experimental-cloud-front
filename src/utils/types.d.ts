import type { Dispatch } from 'umi';

export type BasicComponentProps = {
  dispatch: Dispatch
}

export type BasicLayoutComponentProps = {
  children: JSX.Element,
  location: any
}