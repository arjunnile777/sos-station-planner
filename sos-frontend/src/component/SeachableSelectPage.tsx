import React from 'react';
import { Select } from 'antd';

type SearchableSelectPageType = {
  optionsData: any[];
  required?: boolean;
  placeholder?: string;
  error?: string;
  label?: string;
  value: string;
  name?: string;
  showSearch?: boolean;
  handleChange: (value: any) => void;
};

const SearchableSelectPage = ({
  label = 'Select Search',
  required = false,
  error = '',
  placeholder = 'Seach Select Option',
  optionsData = [],
  name = '',
  value = '',
  showSearch = true,
  handleChange,
}: SearchableSelectPageType) => {
  return (
    <div className="sos-select-cs">
      {label && (
        <div className="select-label">
          {label}
          {required && <span className="select-required-label">*</span>}
        </div>
      )}
      <Select
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())
        }
        onChange={handleChange}
        value={value}
        options={optionsData}
      />
      {error && <div className="sos-error-line">{`*${error}`}</div>}
    </div>
  );
};

export default SearchableSelectPage;
