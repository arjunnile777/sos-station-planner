import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Switch } from 'antd';
import SosEllipsisIcon from './SosEllipsisIcon';

type SosEllipsisDropdownType = {
  item: any;
  handleEditUser: () => void;
  handleUpdateStatus?: (status: boolean) => void;
  editLabel?: string;
  handleRemove: () => void;
  handleReprint?: () => void;
  isStatusVisible?: boolean;
  isReprintOption?: boolean;
};

const SosEllipsisDropdown = ({
  item,
  handleEditUser,
  handleUpdateStatus,
  editLabel = 'EDIT USER',
  handleRemove,
  handleReprint = () => {
    console.log('reprint click');
  },
  isStatusVisible = true,
  isReprintOption = false,
}: SosEllipsisDropdownType) => {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    item.status === 1 ? true : false,
  );

  useEffect(() => {
    setIsChecked(item.status === 1 ? true : false);
  }, [item.status]);

  const updateStatus = () => {
    setIsChecked(!isChecked);
    if (isStatusVisible && handleUpdateStatus) {
      handleUpdateStatus(!isChecked);
    }
  };

  const handleMenuClick = (e: any) => {
    e.domEvent.stopPropagation();
    if (e.key === 'edit') {
      handleEditUser();
    }
    if (e.key === 'remove') {
      handleRemove();
    }
    if (e.key === 'reprint' && isReprintOption) {
      handleReprint();
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  const menu = (
    <Menu
      className="sos-ellipsis-dropdown-cs"
      onClick={e => handleMenuClick(e)}
      items={
        isStatusVisible
          ? [
              {
                label: editLabel,
                key: 'edit',
              },
              {
                label: 'Remove',
                key: 'remove',
              },
              {
                type: 'divider',
              },
              {
                label: (
                  <>
                    <label>{isChecked ? 'Active' : 'Inactive'}</label>
                    <Switch
                      checked={isChecked}
                      size="small"
                      onChange={updateStatus}
                    />
                  </>
                ),
                key: 'status',
              },
            ]
          : [
              {
                label: editLabel,
                key: 'edit',
              },
              {
                label: 'Remove',
                key: 'remove',
              },
              {
                label: 'Reprint',
                key: 'reprint',
              },
            ]
      }
    />
  );

  return (
    <Dropdown overlay={menu} onVisibleChange={handleOpenChange} visible={open}>
      <div
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <SosEllipsisIcon />
      </div>
    </Dropdown>
  );
};

export default SosEllipsisDropdown;
