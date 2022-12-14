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
  disabled?: boolean;
  onKeyDown?: (e: any) => void;
};

const SosInputComponent = ({
  label,
  value = '',
  type = 'text',
  name = 'input',
  placeholder,
  required = false,
  onChange,
  onKeyDown,
  error = '',
  disabled = false,
}: SosInputComponentType) => {
  return (
    <div className="sos-input-cs">
      {label && (
        <div className="input-label">
          {label}
          {required && <span className="input-required-label">*</span>}
        </div>
      )}

      {type && type === 'password' ? (
        <Input.Password
          required={required}
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <Input
          required={required}
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {error && <div className="sos-error-line">{`*${error}`}</div>}
    </div>
  );
};

export default SosInputComponent;
