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
  EmployeeMasterSliceSelector,
  getAllEmployeeMasters,
} from '../../store/slices/employeeMaster.slice';
import AddEmployeeMasterPage from './AddEmployeeMasterPage';
import {
  CreateEmployeeMasterType,
  DeleteEmployeeMasterType,
} from '../../types/employeeMaster/employeeMasterPayloadType';
import {
  deleteEmployeeMasterApi,
  updateEmployeeMasteriApi,
} from '../../services/EmployeeMasterApi';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import SosConfirmModal from '../../component/SosConfirmModal';
import { ROLE_ARRAY, TABLE_MAX_HEIGHT_OBJECT } from '../../constants';
import PageHeaderPage from '../../component/PageHeaderPage';

interface EmployeeMasterPageType {
  id: number;
  name: string;
  eid: string;
  role_name: number;
  password: number;
  status: number;
  created_on: string;
}

type DataIndex = keyof EmployeeMasterPageType;

const EmployeeMasterPage = () => {
  const searchInput = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const { isEmployeeMasterLoading, totalEmployeeMaster, employeeMasterData } =
    useSelector(EmployeeMasterSliceSelector);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0);

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState<boolean>(false);
  const [employeeMastersList, setEmployeeMastersList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isUpdateEmployeeModal, setIsUpdateEmployeeModal] =
    useState<boolean>(false);
  const [updateModalData, setUpdateModalData] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    eid: '',
    role: 0,
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>();
  // When component render below code has called and fetch  GET ALL Part masters api.
  useEffect(() => {
    dispatch(getAllEmployeeMasters());
  }, []);

  // Success response of get Parts data into below code
  useEffect(() => {
    let dataModify: any = [];
    if (employeeMasterData.length) {
      dataModify = employeeMasterData.map((item: any) => ({
        ...item,
        role_name: ROLE_ARRAY[parseInt(item.role)],
        created_on: moment(item.created_on).format('DD-MM-YYYY'),
      }));
    }

    setEmployeeMastersList(dataModify);
  }, [employeeMasterData]);

  // Set total Part masters count
  useEffect(() => {
    setTotalPage(totalEmployeeMaster);
  }, [totalEmployeeMaster]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isEmployeeMasterLoading);
  }, [isEmployeeMasterLoading]);

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
  ): ColumnType<EmployeeMasterPageType> => ({
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

  const columns: ColumnsType<EmployeeMasterPageType> = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Employee ID',
      dataIndex: 'eid',
      key: 'eid',
      ...getColumnSearchProps('eid'),
    },
    {
      title: 'Role',
      key: 'role_name',
      dataIndex: 'role_name',
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
              editLabel="Edit Employee"
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
      name: filters.name ? filters.name[0] : '',
      eid: filters.eid ? filters.eid[0] : '',
      role: filters.role ? filters.role[0] : 0,
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdateEmployeeModal(true);
    setIsAddEmployeeOpen(true);
  };

  const onHandleUpdateStatus = async (status: boolean, record: any) => {
    const params: CreateEmployeeMasterType = {
      id: record.id,
      name: record.name,
      eid: record.eid,
      role: record.role,
      username: record.username,
      password: record.password,
      status: status ? 1 : 0,
    };

    try {
      setIsSpinning(true);
      const response = await updateEmployeeMasteriApi(params);
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
      dispatch(getAllEmployeeMasters());
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
    const params: DeleteEmployeeMasterType = {
      id: selectedItemToDelete.id,
      markDelete: 1,
    };
    try {
      setIsSpinning(true);
      const response = await deleteEmployeeMasterApi(params);
      if (response && response.data) {
        PopupMessagePage({
          title: response.data.data,
          type: 'success',
        });
        setIsSpinning(false);
        setDeleteModalVisible(false);
        setSelectedItemToDelete(null);
        dispatch(getAllEmployeeMasters());
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
    dispatch(getAllEmployeeMasters(params));
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage
            title="Employee Master"
            btnLabel="Add Employee Master"
            onBtnClick={() => setIsAddEmployeeOpen(!isAddEmployeeOpen)}
          />
        </Col>
        <Col span={24}>
          <Table
            className="sos-ant-table"
            columns={columns}
            dataSource={employeeMastersList}
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

      {isAddEmployeeOpen && (
        <AddEmployeeMasterPage
          isModalOpen={isAddEmployeeOpen}
          isUpdateModal={isUpdateEmployeeModal}
          updateModalData={updateModalData}
          onCloseModal={() => {
            setIsUpdateEmployeeModal(false);
            setIsAddEmployeeOpen(!isAddEmployeeOpen);
            setUpdateModalData(null);
          }}
        />
      )}

      {isSpinning ? <CustomSpinner /> : ''}
      {deleteModalVisible && (
        <SosConfirmModal
          visible={deleteModalVisible}
          title="Remove Employee Master"
          bodyText={`Are you sure you want to delete employee ${selectedItemToDelete.name}?`}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default EmployeeMasterPage;
