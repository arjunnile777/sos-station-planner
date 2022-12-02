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
  getAllPartMasters,
  PartMasterSliceSelector,
} from '../../store/slices/partMaster.slice';
import AddPartMasterPage from './AddPartMasterPage';
import {
  CreatePartMasterType,
  DeletePartMasterType,
} from '../../types/partMaster/partMasterPayloadType';
import {
  deletePartMasterApi,
  updatePartMasteriApi,
} from '../../services/PartMasterApi';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import SosConfirmModal from '../../component/SosConfirmModal';
import { TABLE_MAX_HEIGHT_OBJECT } from '../../constants';

interface PartMasterPageType {
  id: number;
  part_no: string;
  description: string;
  um: string;
  status: number;
  created_on: string;
}

type DataIndex = keyof PartMasterPageType;

const PartMasterPage = () => {
  const searchInput = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const { isPartMasterLoading, totalPartMaster, partMasterData } = useSelector(
    PartMasterSliceSelector,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [isAddPartOpen, setIsAddPartOpen] = useState<boolean>(false);
  const [partMastersList, setPartMastersList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isUpdatePartModal, setIsUpdatePartModal] = useState<boolean>(false);
  const [updateModalData, setUpdateModalData] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    part_no: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>();

  // When component render below code has called and fetch  GET ALL Part masters api.
  useEffect(() => {
    dispatch(getAllPartMasters());
  }, []);

  // Success response of get Parts data into below code
  useEffect(() => {
    let dataModify: any = [];
    if (partMasterData.length) {
      dataModify = partMasterData.map((item: any) => ({
        ...item,
        created_on: moment(item.created_on).format('DD-MM-YYYY'),
      }));
    }

    setPartMastersList(dataModify);
  }, [partMasterData]);

  // Set total Part masters count
  useEffect(() => {
    setTotalPage(totalPartMaster);
  }, [totalPartMaster]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isPartMasterLoading);
  }, [isPartMasterLoading]);

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
  ): ColumnType<PartMasterPageType> => ({
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

  const columns: ColumnsType<PartMasterPageType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Part Number',
      dataIndex: 'part_no',
      key: 'part_no',
      ...getColumnSearchProps('part_no'),
    },
    {
      title: 'Description',
      dataIndex: 'part_description',
      key: 'part_description',
    },
    {
      title: 'UoM',
      key: 'uom',
      dataIndex: 'uom',
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
      part_no: filters.part_no ? filters.part_no[0] : '',
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdatePartModal(true);
    setIsAddPartOpen(true);
  };

  const onHandleUpdateStatus = async (status: boolean, record: any) => {
    const params: CreatePartMasterType = {
      id: record.id,
      part_no: record.part_no,
      uom: record.uom,
      part_description: record.part_description,
      status: status ? 1 : 0,
    };

    try {
      setIsSpinning(true);
      const response = await updatePartMasteriApi(params);
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
      dispatch(getAllPartMasters());
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
    const params: DeletePartMasterType = {
      id: selectedItemToDelete.id,
      markDelete: 1,
    };
    try {
      setIsSpinning(true);
      const response = await deletePartMasterApi(params);
      if (response && response.data) {
        PopupMessagePage({
          title: response.data.data,
          type: 'success',
        });
        setIsSpinning(false);
        setDeleteModalVisible(false);
        setSelectedItemToDelete(null);
        dispatch(getAllPartMasters());
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
    dispatch(getAllPartMasters(params));
  };

  return (
    <>
      <Row>
        <Col span={24} style={{ textAlign: 'end', marginBottom: '10px' }}>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => setIsAddPartOpen(!isAddPartOpen)}
          >
            Add Part Master
          </Button>
        </Col>
        <Col span={24}>
          <Table
            className="sos-ant-table"
            columns={columns}
            dataSource={partMastersList}
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

      {isAddPartOpen && (
        <AddPartMasterPage
          isModalOpen={isAddPartOpen}
          isUpdateModal={isUpdatePartModal}
          updateModalData={updateModalData}
          onCloseModal={() => {
            setIsUpdatePartModal(false);
            setIsAddPartOpen(!isAddPartOpen);
            setUpdateModalData(null);
          }}
        />
      )}

      {isSpinning ? <CustomSpinner /> : ''}
      {deleteModalVisible && (
        <SosConfirmModal
          visible={deleteModalVisible}
          title="Remove Part Master"
          bodyText={`Are you sure you want to delete ${selectedItemToDelete.part_no}`}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PartMasterPage;
