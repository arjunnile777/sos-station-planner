import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Switch } from 'antd';
import SosEllipsisIcon from './SosEllipsisIcon';

type SosEllipsisDropdownType = {
  item: any;
  handleEditUser: () => void;
  handleUpdateStatus: (status: boolean) => void;
  editLabel?: string;
};

const SosEllipsisDropdown = ({
  item,
  handleEditUser,
  handleUpdateStatus,
  editLabel = 'EDIT USER',
}: SosEllipsisDropdownType) => {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    item.status === 1 ? true : false,
  );

  const updateStatus = () => {
    setIsChecked(!isChecked);
    handleUpdateStatus(!isChecked);
  };

  const handleMenuClick = (e: any) => {
    e.domEvent.stopPropagation();
    if (e.key === 'edit') {
      handleEditUser();
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  const menu = (
    <Menu
      className="sos-ellipsis-dropdown-cs"
      onClick={e => handleMenuClick(e)}
      items={[
        {
          label: editLabel,
          key: 'edit',
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
      ]}
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
