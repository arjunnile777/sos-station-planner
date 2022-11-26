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

interface PartMasterPageType {
  id: number;
  name: string;
  code: number;
  contact_person: string;
  phone: number;
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
    name: '',
    phone: '',
    contact_person: '',
  });

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
              editLabel="Edit Part"
              item={record}
              handleEditUser={() => onHandleEditUser(record)}
              handleUpdateStatus={onHandleUpdateStatus}
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
      phone: filters.phone ? filters.phone[0] : '',
      contact_person: filters.contact_person ? filters.contact_person[0] : '',
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdatePartModal(true);
    setIsAddPartOpen(true);
  };

  const onHandleUpdateStatus = () => {
    console.log('Handle on update status');
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
    </>
  );
};

export default PartMasterPage;
