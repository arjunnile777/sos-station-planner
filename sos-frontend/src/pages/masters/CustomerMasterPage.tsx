import React, { useRef, useEffect, useState } from 'react';
import { Badge, Button, Col, Input, Row, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { InputRef } from 'antd';
import moment from 'moment';

import SosEllipsisDropdown from '../../component/SosEllipsisDropdown';
import AddCustomerMasterPage from './AddCustomerMasterPage';
import {
  CustomerMasterSliceSelector,
  getAllCustomerMasters,
} from '../../store/slices/customerMaster.slice';
import CustomSpinner from '../../component/CustomSpinner';
import {
  CreateCustomerMasterType,
  DeleteCustomerMasterType,
} from '../../types/customerMaster/CustomerMasterPayloadType';
import {
  deleteCustomerMasterApi,
  updateCustomerMasteriApi,
} from '../../services/CustomerMasterApi';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import SosConfirmModal from '../../component/SosConfirmModal';
import { TABLE_MAX_HEIGHT_OBJECT } from '../../constants';

interface CustomerMasterPageType {
  id: number;
  name: string;
  code: number;
  contact_person: string;
  phone: number;
  status: number;
  created_on: string;
}

type DataIndex = keyof CustomerMasterPageType;

const CustomerMasterPage = () => {
  const searchInput = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const { isCustomerMasterLoading, totalCustomerMaster, customerMasterData } =
    useSelector(CustomerMasterSliceSelector);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);
  const [customerMastersList, setCustomerMastersList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isUpdateCustomerModal, setIsUpdateCustomerModal] =
    useState<boolean>(false);
  const [updateModalData, setUpdateModalData] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    phone: '',
    contact_person: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>();

  // When component render below code has called and fetch  GET ALL customer masters api.
  useEffect(() => {
    dispatch(getAllCustomerMasters());
  }, []);

  // Success response of get customers data into below code
  useEffect(() => {
    let dataModify: any = [];
    if (customerMasterData.length) {
      dataModify = customerMasterData.map((item: any) => ({
        ...item,
        created_on: moment(item.created_on).format('DD-MM-YYYY'),
      }));
    }

    setCustomerMastersList(dataModify);
  }, [customerMasterData]);

  // Set total customer masters count
  useEffect(() => {
    setTotalPage(totalCustomerMaster);
  }, [totalCustomerMaster]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isCustomerMasterLoading);
  }, [isCustomerMasterLoading]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: any) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    // const searchFilt = { ...searchFilters, [dataIndex]: selectedKeys[0] };
    // setSearchFilters(searchFilt);
    // onApplyFilters(searchFilt);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<CustomerMasterPageType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              if (clearFilters) {
                setSelectedKeys([]);
                handleSearch([], confirm, dataIndex);
                handleReset(clearFilters);
              }
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  const columns: ColumnsType<CustomerMasterPageType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Contact Person',
      key: 'contact_person',
      dataIndex: 'contact_person',
      ...getColumnSearchProps('contact_person'),
    },
    {
      title: 'Phone no',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text: any, record: any) => (
        <>
          <Badge
            status={record.status === 1 ? 'success' : 'error'}
            text={record.status === 1 ? 'Active' : 'Inactive'}
          />
        </>
      ),
    },
    {
      title: 'Created On',
      key: 'created_on',
      dataIndex: 'created_on',
    },
    {
      title: '',
      render: (text: any, record: any) => (
        <>
          <div style={{ cursor: 'pointer' }}>
            <SosEllipsisDropdown
              editLabel="Edit Customer"
              item={record}
              handleEditUser={() => onHandleEditUser(record)}
              handleUpdateStatus={status =>
                onHandleUpdateStatus(status, record)
              }
              handleRemove={() => onHandleRemove(record)}
            />
          </div>
        </>
      ),
      dataIndex: 'btnEvent',
      key: 'btnEvent',
      width: '100px',
      align: 'center',
    },
  ];

  const onChangePagination = (pageInfo: any, filters: any) => {
    console.log(pageInfo);
    console.log(filters);
    setCurrentPage(pageInfo.current);
    setCurrentPageSize(pageInfo.pageSize);
    setTotalPage(pageInfo.total);

    const searchFilt = {
      name: filters.name ? filters.name[0] : '',
      phone: filters.phone ? filters.phone[0] : '',
      contact_person: filters.contact_person ? filters.contact_person[0] : '',
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdateCustomerModal(true);
    setIsAddCustomerOpen(true);
  };

  const onHandleUpdateStatus = async (status: boolean, record: any) => {
    const params: CreateCustomerMasterType = {
      id: record.id,
      name: record.name,
      code: record.code,
      contact_person: record.contact_person,
      address: record.address,
      phone: record.phone,
      status: status ? 1 : 0,
    };

    try {
      setIsSpinning(true);
      const response = await updateCustomerMasteriApi(params);
      if (response && response.data) {
        handleSuccessResponse(response.data);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleSuccessResponse = (successResponse: any) => {
    if (successResponse) {
      PopupMessagePage({
        title: successResponse.message,
        type: 'success',
      });
      dispatch(getAllCustomerMasters());
    } else {
      PopupMessagePage({
        title: successResponse.message,
        type: 'warning',
      });
    }
    setIsSpinning(false);
  };

  const onHandleRemove = (record: any) => {
    setDeleteModalVisible(true);
    setSelectedItemToDelete(record);
  };

  const onConfirm = (confirm: boolean) => {
    if (confirm && selectedItemToDelete) deleteSelectedItem();
    else setDeleteModalVisible(false);
  };

  const deleteSelectedItem = async () => {
    const params: DeleteCustomerMasterType = {
      id: selectedItemToDelete.id,
      markDelete: 1,
    };
    try {
      setIsSpinning(true);
      const response = await deleteCustomerMasterApi(params);
      if (response && response.data) {
        PopupMessagePage({
          title: response.data.data,
          type: 'success',
        });
        setIsSpinning(false);
        setDeleteModalVisible(false);
        setSelectedItemToDelete(null);
        dispatch(getAllCustomerMasters());
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const onApplyFilters = (filters: any, page?: number, page_size?: number) => {
    const params = {
      ...filters,
      page: page ? page : currentPage,
      page_size: page_size ? page_size : currentPageSize,
    };
    dispatch(getAllCustomerMasters(params));
  };

  return (
    <>
      <Row>
        <Col span={24} style={{ textAlign: 'end', marginBottom: '10px' }}>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => setIsAddCustomerOpen(!isAddCustomerOpen)}
          >
            Add Customer Master
          </Button>
        </Col>
        <Col span={24}>
          <Table
            className="sos-ant-table"
            columns={columns}
            dataSource={customerMastersList}
            bordered
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              current: currentPage,
              total: totalPages,
              pageSize: currentPageSize,
            }}
            onChange={onChangePagination}
            scroll={TABLE_MAX_HEIGHT_OBJECT}
          />
        </Col>
      </Row>

      {isAddCustomerOpen && (
        <AddCustomerMasterPage
          isModalOpen={isAddCustomerOpen}
          isUpdateModal={isUpdateCustomerModal}
          updateModalData={updateModalData}
          onCloseModal={() => {
            setIsUpdateCustomerModal(false);
            setIsAddCustomerOpen(!isAddCustomerOpen);
            setUpdateModalData(null);
          }}
        />
      )}

      {isSpinning ? <CustomSpinner /> : ''}
      {deleteModalVisible && (
        <SosConfirmModal
          visible={deleteModalVisible}
          title="Remove Customer Master"
          bodyText={`Are you sure you want to delete ${selectedItemToDelete.name}`}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default CustomerMasterPage;
