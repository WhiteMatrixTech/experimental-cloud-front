import React from 'react';
import { Input, Button } from 'antd';
import styles from './index.less';

const { Search } = Input;

type SearchBarProps = {
  placeholder: string,
  onSearch: (value: string, event: any) => void,
  btnName: string,
  onClickBtn: () => void
}

function SearchBar({ placeholder = '', onSearch, btnName = '', onClickBtn }: SearchBarProps) {

  return (
    <div className={styles['search-wrapper']} style={{ justifyContent: btnName ? 'space-between' : 'flex-end' }}>
      {btnName && <Button type='primary' onClick={onClickBtn}>{btnName}</Button>}
      <Search allowClear placeholder={placeholder} onSearch={onSearch} style={{ width: 300 }} />
    </div>
  );
}

export default SearchBar;