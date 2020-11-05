import React from 'react';
import { Input } from 'antd';
import styles from './index.less';

const { Search } = Input;

function SearchBar({ placeholder, onSearch }) {

  return (
    <div className={styles['search-wrapper']}>
      <Search allowClear placeholder={placeholder} onSearch={onSearch} style={{ width: 300 }} />
    </div>
  );
}

export default SearchBar