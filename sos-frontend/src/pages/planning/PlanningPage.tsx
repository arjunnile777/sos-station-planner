import React, { useRef, useEffect, useState } from 'react';
import { Badge, Button, Col, Input, Row, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { InputRef } from 'antd';
import moment from 'moment';

import SosEllipsisDropdown from '../../component/SosEllipsisDropdown';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import SosConfirmModal from '../../component/SosConfirmModal';
import AddPlanningPage from './AddPlanningPage';
import {
  getAllPlannings,
  PlanningSliceSelector,
} from '../../store/slices/planning.slice';
import { DeletePlanningType } from '../../types/planning/planningPayloadType';
import { deletePlanningApi } from '../../services/PlanningApi';
import { TABLE_MAX_HEIGHT_OBJECT } from '../../constants';
import PageHeaderPage from '../../component/PageHeaderPage';
import { getIndividualLinkageApi } from '../../services/CustomerPartLinkageApi';
import { getIndividualCustomerMasterApi } from '../../services/CustomerMasterApi';
import { getIndividualPartMasterApi } from '../../services/PartMasterApi';
import { saveScannedDataApi } from '../../services/ClientApi';
import { getLoginUserDetails } from '../../utils/localStorage';

const PLANNING_STATUS_ARRAY = ['Open', 'Hold', 'Dispatch'];

interface PlanningPageType {
  customer_name: string;
  part_no: string;
  order_no: string;
  scanned_quantity: number;
  total_quantity: number;
  status: string;
}

type DataIndex = keyof PlanningPageType;

const PlanningPage = () => {
  const searchInput = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const { isPlanningLoading, totalPlanning, planningData } = useSelector(
    PlanningSliceSelector,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [totalPages, setTotalPage] = useState<number>(0);

  const [isAddPlanningOpen, setIsAddPlanningOpen] = useState<boolean>(false);
  const [planningList, setPlanningList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isUpdatePlanningModal, setIsUpdatePlanningModal] =
    useState<boolean>(false);
  const [updateModalData, setUpdateModalData] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    customer_name: '',
    part_number: '',
    order_no: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<any>();

  // When component render below code has called and fetch  GET ALL Part masters api.
  useEffect(() => {
    dispatch(getAllPlannings());
  }, []);

  // Success response of get Parts data into below code
  useEffect(() => {
    let pdata: any = [];
    if (planningData.length > 0) {
      pdata = planningData.map((item: any) => ({
        ...item,
        status_name: PLANNING_STATUS_ARRAY[parseInt(item.status)],
      }));
    }

    setPlanningList(pdata);
  }, [planningData]);

  // Set total Part masters count
  useEffect(() => {
    setTotalPage(totalPlanning);
  }, [totalPlanning]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isPlanningLoading);
  }, [isPlanningLoading]);

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
  ): ColumnType<PlanningPageType> => ({
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

  const columns: ColumnsType<PlanningPageType> = [
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
      title: 'Order Number',
      dataIndex: 'order_no',
      key: 'order_no',
      ...getColumnSearchProps('order_no'),
    },
    {
      title: 'Scanned Qty',
      dataIndex: 'scanned_quantity',
      key: 'scanned_quantity',
      width: '120px',
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: '120px',
    },
    {
      title: 'Status',
      dataIndex: 'status_name',
      key: 'status_name',
      width: '120px',
    },
    {
      title: '',
      render: (text: any, record: any) => (
        <>
          <div style={{ cursor: 'pointer' }}>
            <SosEllipsisDropdown
              isStatusVisible={false}
              isReprintOption={true}
              editLabel="Edit Part"
              item={record}
              handleEditUser={() => onHandleEditUser(record)}
              handleRemove={() => onHandleRemove(record)}
              handleReprint={() => onHandleReprintOrder(record)}
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
      part_number: filters.part_number ? filters.part_number[0] : '',
      order_no: filters.order_no ? filters.order_no[0] : '',
    };
    setSearchFilters(searchFilt);
    onApplyFilters(searchFilt, pageInfo.current, pageInfo.pageSize);
  };

  const onHandleEditUser = (record: any) => {
    setUpdateModalData(record);
    setIsUpdatePlanningModal(true);
    setIsAddPlanningOpen(true);
  };

  const onHandleUpdateStatus = () => {
    console.log('Handle on update status');
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
    const params: DeletePlanningType = {
      id: selectedItemToDelete.id,
      markDelete: 1,
    };
    try {
      setIsSpinning(true);
      const response = await deletePlanningApi(params);
      if (response && response.status === 200 && response.data) {
        PopupMessagePage({
          title: response.data.data,
          type: 'success',
        });
        setIsSpinning(false);
        setDeleteModalVisible(false);
        setSelectedItemToDelete(null);
        dispatch(getAllPlannings());
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
    console.log(filters);
    const params = {
      ...filters,
      page: page ? page : currentPage,
      page_size: page_size ? page_size : currentPageSize,
    };
    dispatch(getAllPlannings(params));
  };

  const onHandleReprintOrder = async (data: any) => {
    let linkageCallData = null;
    let customerCallData = null;
    let partCallData = null;

    console.log('************* Reprint *****************=', data);
    try {
      const response = await getIndividualLinkageApi({
        customer_id: data.customer_id,
        part_id: data.part_id,
      });
      console.log('Linkagessss data===', response);
      if (response && response.data) {
        linkageCallData = response.data.data[0];
      }
    } catch (e) {
      console.log('error');
    }

    try {
      const response = await getIndividualCustomerMasterApi({
        customer_id: data.customer_id,
        part_id: data.part_id,
      });
      console.log('customer data===', response);
      if (response && response.data) {
        customerCallData = response.data.data[0];
      }
    } catch (e) {
      console.log('error');
    }

    try {
      const response = await getIndividualPartMasterApi({
        customer_id: data.customer_id,
        part_id: data.part_id,
      });
      console.log('part data===', response);
      if (response && response.data) {
        partCallData = response.data.data[0];
      }
    } catch (e) {
      console.log('error');
    }

    const loggedInUserDetails = getLoginUserDetails();
    console.log('************* End  *****************');
    const dateVal = new Date();
    const mm =
      dateVal.getMonth() < 10
        ? `0${dateVal.getMonth() + 1}`
        : dateVal.getMonth() + 1;

    const dd =
      dateVal.getDate() < 10 ? `0${dateVal.getDate()}` : dateVal.getDate();
    const seconds = dateVal.getSeconds();
    const minutes = dateVal.getMinutes();
    const hour = dateVal.getHours();

    const date = `${dd}/${mm}/${dateVal.getFullYear()} ${hour}:${minutes}:${seconds}`;

    const params: any = {
      order_no: data.order_no,
      date: date,
      scanned_qty: data.total_quantity,
      total_qty: data.total_quantity,
      part_no: data.part_no,
      part_description: partCallData.part_description,
      customer_part_no: linkageCallData.customer_part_no,
      customer: data.customer_name,
      address: customerCallData.address,
      type: 'build',
      login_user_name: loggedInUserDetails.name,
    };

    try {
      const response = await saveScannedDataApi(params);
      if (response && response.status === 200 && response.data) {
        console.log('*************** File Saved successfully *********');
        // onClientBtnClick();
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
    } catch (e) {
      console.log('Error=', e);
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage
            title="Planning"
            btnLabel="Add Planning"
            onBtnClick={() => setIsAddPlanningOpen(!isAddPlanningOpen)}
          />
        </Col>
        <Col span={24}>
          <Table
            className="sos-ant-table"
            columns={columns}
            dataSource={planningList}
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

      {isAddPlanningOpen && (
        <AddPlanningPage
          isModalOpen={isAddPlanningOpen}
          isUpdateModal={isUpdatePlanningModal}
          updateModalData={updateModalData}
          onCloseModal={() => {
            setIsUpdatePlanningModal(false);
            setIsAddPlanningOpen(!isAddPlanningOpen);
            setUpdateModalData(null);
          }}
        />
      )}

      {isSpinning ? <CustomSpinner /> : ''}
      {deleteModalVisible && (
        <SosConfirmModal
          visible={deleteModalVisible}
          title="Remove Station Master"
          bodyText={`Are you sure you want to delete ${selectedItemToDelete.station_name}`}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PlanningPage;
