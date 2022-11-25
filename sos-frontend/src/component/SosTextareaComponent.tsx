import React from 'react';
import TextArea from 'antd/lib/input/TextArea';

type SosTextAreaComponentType = {
  label?: string;
  value?: string | number;
  name?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
};

const SosTextAreaComponent = ({
  label,
  value = '',
  name = 'input',
  placeholder,
  required = false,
  onChange,
  error = '',
}: SosTextAreaComponentType) => {
  return (
    <div className="sos-textarea-cs">
      {label && (
        <div className="input-label">
          {label}
          {required && <span className="input-required-label">*</span>}
        </div>
      )}
      <TextArea
        rows={2}
        required={required}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="sos-error-line">{`*${error}`}</div>}
    </div>
  );
};

export default SosTextAreaComponent;
