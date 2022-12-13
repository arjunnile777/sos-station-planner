import React, { useRef, useEffect, useState } from 'react';
import { Badge, Button, Col, Input, Row, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { InputRef } from 'antd';
import moment from 'moment';

import SosEllipsisDropdown from '../../component/SosEllipsisDropdown';
import CustomSpinner from '../../component/CustomSpinner';
import {
  CustomerPartLinkageSliceSelector,
  getAllCustomerPartLinkage,
} from '../../store/slices/customerPartLinkage.slice';
import AddCustomerPartLinkagePage from './AddCustomerPartLinkagePage';
import {
  CreateCustomerPartLinkageType,
  DeleteCustomerPartLinkageType,
} from '../../types/customerPartLinkage/customerPartLinkagePayloadType';
import {
  deleteCustomerPartLinkageApi,
  updateCustomerPartLinkageiApi,
} from '../../services/CustomerPartLinkageApi';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import SosConfirmModal from '../../component/SosConfirmModal';
import { TABLE_MAX_HEIGHT_OBJECT } from '../../constants';
import PageHeaderPage from '../../component/PageHeaderPage';

interface CustomerPartLinkagePageType {
  id: number;
  customer_name: string;
  part_no: number;
  customer_part_no: string;
  quantity: string;
  status: number;
  created_on: string;
}

type DataIndex = keyof CustomerPartLinkagePageType;

const CustomerPartLinkagePage = () => {
  const searchInput = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const {
    isCustomerPartLinkageLoading,
    totalCustomerPartLinkage,
    customerPartLinkageData,
  } = useSelector(CustomerPartLinkageSliceSelector);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0);

  const [isAddCustomerPartLinkageOpen, setIsAddCustomerPartLinkageOpen] =
    useState<boolean>(false);
  const [customerPartLinkageList, setCustomerPartLinkageList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [
    isUpdateCustomerPartLinkageModal,
    setIsUpdateCustomerPartLinkageModal,
  ] = useState<boolean>(false);
  const [updateModalData, setUpdateModalData] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    customer_name: '',
    part_no: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>();

  // When component render below code has called and fetch  GET ALL Part masters api.
  useEffect(() => {
    dispatch(getAllCustomerPartLinkage());
  }, []);

  // Success response of get Parts data into below code
  useEffect(() => {
    let dataModify: any = [];
    if (customerPartLinkageData.length) {
      dataModify = customerPartLinkageData.map((item: any) => ({
        ...item,
        created_on: moment(item.created_on).format('DD-MM-YYYY'),
      }));
    }

    setCustomerPartLinkageList(dataModify);
  }, [customerPartLinkageData]);

  // Set total Part masters count
  useEffect(() => {
    setTotalPage(totalCustomerPartLinkage);
  }, [totalCustomerPartLinkage]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isCustomerPartLinkageLoading);
  }, [isCustomerPartLinkageLoading]);

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
  ): ColumnType<CustomerPartLinkagePageType> => ({
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

  const columns: ColumnsType<CustomerPartLinkagePageType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
      key: 'customer_name',
      ...getColumnSearchProps('customer_name'),
    },
    {
      title: 'Part Number',
      dataIndex: 'part_no',
      key: 'part_no',
      ...getColumnSearchProps('part_no'),
    },
    {
      title: 'Customer Part Number',
      key: 'customer_part_no',
      dataIndex: 'customer_part_no',
    },
    {
      title: 'Packaging Qty',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
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
              editLabel="Edit Part"
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
    console.log(filters);
    setCurrentPage(pageInfo.current);
    setCurrentPageSize(pageInfo.pageSize);
    setTotalPage(pageInfo.total);

    const searchFilt = {
      customer_name: filters.customer_name ? filters.customer_name[0] : '',
      part_no: filters.part_no ? filters.part_no[0] : '',
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdateCustomerPartLinkageModal(true);
    setIsAddCustomerPartLinkageOpen(true);
  };

  const onHandleUpdateStatus = async (status: boolean, record: any) => {
    const params: CreateCustomerPartLinkageType = {
      id: record.id,
      customer_name: record.customer_name,
      customer_id: record.customer_id,
      part_no: record.part_no,
      part_id: record.part_id,
      barcode: record.barcode,
      status: status ? 1 : 0,
      quantity: record.quantity,
      customer_part_no: record.customer_part_no,
      duplicate_allow: record.duplicate_allow ? true : false,
    };

    try {
      setIsSpinning(true);
      const response = await updateCustomerPartLinkageiApi(params);
      if (response && response.status === 200 && response.data) {
        handleSuccessResponse(response.data);
      } else {
        if (response.data && response.data.msg) {
          PopupMessagePage({
            title: response.data.msg,
            type: 'error',
          });
        } else {
          PopupMessagePage({
            title: 'Something went wrong, Please try after sometime.',
            type: 'error',
          });
        }
      }
      setIsSpinning(false);
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleSuccessResponse = (successResponse: any) => {
    if (successResponse) {
      PopupMessagePage({
        title: successResponse.msg,
        type: 'success',
      });
      dispatch(getAllCustomerPartLinkage());
    } else {
      PopupMessagePage({
        title: successResponse.msg,
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
    const params: DeleteCustomerPartLinkageType = {
      id: selectedItemToDelete.id,
      markDelete: 1,
    };
    try {
      setIsSpinning(true);
      const response = await deleteCustomerPartLinkageApi(params);
      if (response && response.status === 200 && response.data) {
        PopupMessagePage({
          title: response.data.data,
          type: 'success',
        });
        setIsSpinning(false);
        setDeleteModalVisible(false);
        setSelectedItemToDelete(null);
        dispatch(getAllCustomerPartLinkage());
      } else {
        if (response.data && response.data.msg) {
          PopupMessagePage({
            title: response.data.msg,
            type: 'error',
          });
        } else {
          PopupMessagePage({
            title: 'Something went wrong, Please try after sometime.',
            type: 'error',
          });
        }
      }
      setIsSpinning(false);
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
    dispatch(getAllCustomerPartLinkage(params));
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage
            title="Customer Part Linkage"
            btnLabel="Add Customer Part Linkage"
            onBtnClick={() =>
              setIsAddCustomerPartLinkageOpen(!isAddCustomerPartLinkageOpen)
            }
          />
        </Col>
        <Col span={24}>
          <Table
            className="sos-ant-table"
            columns={columns}
            dataSource={customerPartLinkageList}
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

      {isAddCustomerPartLinkageOpen && (
        <AddCustomerPartLinkagePage
          isModalOpen={isAddCustomerPartLinkageOpen}
          isUpdateModal={isUpdateCustomerPartLinkageModal}
          updateModalData={updateModalData}
          onCloseModal={() => {
            setIsUpdateCustomerPartLinkageModal(false);
            setIsAddCustomerPartLinkageOpen(!isAddCustomerPartLinkageOpen);
            setUpdateModalData(null);
          }}
        />
      )}

      {isSpinning ? <CustomSpinner /> : ''}
      {deleteModalVisible && (
        <SosConfirmModal
          visible={deleteModalVisible}
          title="Remove Customer Part Linkage"
          bodyText={`Are you sure you want to delete linkage ${selectedItemToDelete.customer_name}?`}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default CustomerPartLinkagePage;
