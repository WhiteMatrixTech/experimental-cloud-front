import moment from 'moment';
import { PlaceHolder } from '~/components';

export function renderDateWithDefault(value?: string) {
  if (!value) {
    return <PlaceHolder text="" placeHolderText="未设置" />;
  }
  return moment(value).add(16, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

export function formatDate(value: string) {
  if (value) {
    return moment(value).add(16, 'hours').format('YYYY-MM-DD HH:mm:ss');
  } else {
    return '';
  }
}
