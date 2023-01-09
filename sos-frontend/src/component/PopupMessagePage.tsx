import { message } from 'antd';

type PopupPageType = {
  title: string;
  type: string;
  duration?: number;
};

export const PopupMessagePage = ({  
  title,
  type,
  duration = 3,
}: PopupPageType) => {
  if (type === 'success') return message.success(title, duration);
  else if (type === 'error') return message.error(title, duration);
  else if (type === 'warning') return message.warning(title, duration);
  else return '';
};
