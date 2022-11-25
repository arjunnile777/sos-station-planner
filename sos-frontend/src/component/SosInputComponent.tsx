import React from 'react';
import { Input } from 'antd';

type SosInputComponentType = {
  label?: string;
  value?: string | number;
  type?: string;
  name?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
};

const SosInputComponent = ({
  label,
  value = '',
  type = 'text',
  name = 'input',
  placeholder,
  required = false,
  onChange,
  error = '',
}: SosInputComponentType) => {
  return (
    <div className="sos-input-cs">
      {label && (
        <div className="input-label">
          {label}
          {required && <span className="input-required-label">*</span>}
        </div>
      )}
      <Input
        required={required}
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="sos-error-line">{`*${error}`}</div>}
    </div>
  );
};

export default SosInputComponent;
