import React, { useState } from 'react';
import { Button, Modal } from 'antd';

type SosNotificationModalPageType = {
  onResetPrintClick: () => void;
  onCloseClick: () => void;
  isModalOpen: boolean;
  title: string;
  descriptionText: string;
  okText: string;
};

const SosNotificationModalPage = ({
  onResetPrintClick,
  onCloseClick,
  isModalOpen = false,
  title,
  descriptionText,
  okText,
}: SosNotificationModalPageType) => {
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={onResetPrintClick}
      onCancel={onCloseClick}
      okText={okText}
    >
      <p>{descriptionText}</p>
    </Modal>
  );
};

export default SosNotificationModalPage;
