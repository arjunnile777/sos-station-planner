import React from 'react';
import { Button, Modal } from 'antd';

type InputTypes = {
  visible?: boolean;
  title?: string;
  bodyText?: string;
  onConfirm?: (flag: boolean) => void;
  width?: string;
  loading?: boolean;
};

const SosConfirmModal = ({
  visible,
  title,
  bodyText,
  onConfirm = (flag: boolean) => {
    console.log(flag);
  },
  width = '30em',
}: InputTypes) => {
  return (
    <Modal
      visible={visible}
      width={width}
      centered
      onCancel={() => onConfirm(false)}
      closable={true}
      title={title}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={() => onConfirm(false)}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={() => onConfirm(true)}>
          Confirm Remove
        </Button>,
      ]}
    >
      {bodyText}
    </Modal>
  );
};

export default SosConfirmModal;
