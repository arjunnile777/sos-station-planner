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
  getAllStationMasters,
  StationMasterSliceSelector,
} from '../../store/slices/stationMaster.slice';
import AddStationMasterPage from './AddStationMasterPage';
import {
  CreateStationMasterType,
  DeleteStationMasterType,
} from '../../types/stationMaster/stationMasterPayloadType';
import {
  deleteStationMasterApi,
  updateStationMasteriApi,
} from '../../services/StationMasterApi';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import SosConfirmModal from '../../component/SosConfirmModal';
import { TABLE_MAX_HEIGHT_OBJECT } from '../../constants';
import PageHeaderPage from '../../component/PageHeaderPage';

interface StationMasterPageType {
  id: number;
  station_name: string;
  status: number;
  created_on: string;
}

type DataIndex = keyof StationMasterPageType;

const StationMasterPage = () => {
  const searchInput = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const { isStationMasterLoading, totalStationMaster, stationMasterData } =
    useSelector(StationMasterSliceSelector);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0);

  const [isAddStationOpen, setIsAddStationOpen] = useState<boolean>(false);
  const [stationMastersList, setStationMastersList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isUpdateStationModal, setIsUpdateStationModal] =
    useState<boolean>(false);
  const [updateModalData, setUpdateModalData] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    station_name: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>();

  // When component render below code has called and fetch  GET ALL Part masters api.
  useEffect(() => {
    dispatch(getAllStationMasters());
  }, []);

  // Success response of get Parts data into below code
  useEffect(() => {
    let dataModify: any = [];
    if (stationMasterData.length) {
      dataModify = stationMasterData.map((item: any) => ({
        ...item,
        created_on: moment(item.created_on).format('DD-MM-YYYY'),
      }));
    }

    setStationMastersList(dataModify);
  }, [stationMasterData]);

  // Set total Part masters count
  useEffect(() => {
    setTotalPage(totalStationMaster);
  }, [totalStationMaster]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isStationMasterLoading);
  }, [isStationMasterLoading]);

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
  ): ColumnType<StationMasterPageType> => ({
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

  const columns: ColumnsType<StationMasterPageType> = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    // },
    {
      title: 'Name',
      dataIndex: 'station_name',
      key: 'station_name',
      ...getColumnSearchProps('station_name'),
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
      station_name: filters.station_name ? filters.station_name[0] : '',
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdateStationModal(true);
    setIsAddStationOpen(true);
  };

  const onHandleUpdateStatus = async (status: boolean, record: any) => {
    const params: CreateStationMasterType = {
      id: record.id,
      station_name: record.station_name,
      status: status ? 1 : 0,
    };

    try {
      setIsSpinning(true);
      const response = await updateStationMasteriApi(params);
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
      dispatch(getAllStationMasters());
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
    const params: DeleteStationMasterType = {
      id: selectedItemToDelete.id,
      markDelete: 1,
    };
    try {
      setIsSpinning(true);
      const response = await deleteStationMasterApi(params);
      if (response && response.status === 200 && response.data) {
        PopupMessagePage({
          title: response.data.data,
          type: 'success',
        });
        setIsSpinning(false);
        setDeleteModalVisible(false);
        setSelectedItemToDelete(null);
        dispatch(getAllStationMasters());
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
    dispatch(getAllStationMasters(params));
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage
            title="Station Master"
            btnLabel="Add Station Master"
            onBtnClick={() => setIsAddStationOpen(!isAddStationOpen)}
          />
        </Col>
        <Col span={24}>
          <Table
            className="sos-ant-table"
            columns={columns}
            dataSource={stationMastersList}
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

      {isAddStationOpen && (
        <AddStationMasterPage
          isModalOpen={isAddStationOpen}
          isUpdateModal={isUpdateStationModal}
          updateModalData={updateModalData}
          onCloseModal={() => {
            setIsUpdateStationModal(false);
            setIsAddStationOpen(!isAddStationOpen);
            setUpdateModalData(null);
          }}
        />
      )}

      {isSpinning ? <CustomSpinner /> : ''}
      {deleteModalVisible && (
        <SosConfirmModal
          visible={deleteModalVisible}
          title="Remove Station Master"
          bodyText={`Are you sure you want to delete station ${selectedItemToDelete.station_name}`}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default StationMasterPage;
