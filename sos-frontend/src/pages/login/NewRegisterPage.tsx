import React from 'react';
import { LOGIN_ROUTE } from '../../constants';
import AddEmployeeMasterPage from '../masters/AddEmployeeMasterPage';
const NewRegisterPage = () => {
  return (
    <AddEmployeeMasterPage
      isModalOpen={true}
      isUpdateModal={false}
      updateModalData={null}
      onCloseModal={() => {
        window.location.assign(`/${LOGIN_ROUTE}?new=1`);
      }}
    />
  );
};
export default NewRegisterPage;
