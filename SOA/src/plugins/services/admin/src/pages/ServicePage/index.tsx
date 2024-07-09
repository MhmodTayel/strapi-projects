import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { useParams, Link } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MRT_Localization_AR } from '../../helpers/ar';
import 'dayjs/locale/en';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import api from '../../api';
import dayjsAr from '../../helpers/arDayjs';
import { statusMap } from '../../helpers';
import {
  BaseHeaderLayout,
  Layout,
  ContentLayout,
  Button,
} from '@strapi/design-system';
import { Plus } from '@strapi/icons';

import { useHistory } from 'react-router-dom';

type Request = {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceName: string;
  talent_name: string;
};

const ServicePage = () => {
  const { slug: serviceSlug } = useParams<{ slug: string }>();
  const history = useHistory();
  const [service, setService] = useState<any>({ id: 1, name: 'test' });
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState('');
  const handleGlobalFilterChangeDebounced = debounce((value) => {
    setDebouncedGlobalFilter(value);
  }, 300);
  const [requests, setRequests] = useState<any[]>([]);
  //data and fetching state
  const [data, setData] = useState<Request[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const handleRowClick = (row: any) => {
    const reqId = row.id;
    history.push(`/plugins/services/${serviceSlug}/${reqId}`);
  };

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      const serviceData: any =
        serviceSlug && (await api.getServiceBySlug(serviceSlug));

      const params = {
        'pagination[page]': `${pagination.pageIndex + 1}`,
        'pagination[pageSize]': `${pagination.pageSize}`,
        ...(sorting[0]?.id
          ? {
              sort: `${sorting[0]?.id}:${sorting[0]?.desc ? 'DESC' : 'ASC'}`,
            }
          : { sort: 'updatedAt:DESC' }),
        ...(debouncedGlobalFilter && { _q: debouncedGlobalFilter }),
        ...columnFilters.reduce((acc, curr, idx) => {
          if (curr?.id == 'id') {
            acc[`filters[$or][${idx}][${curr.id}][$eq]`] = `${curr?.value}`;
            //@ts-ignore
          } else if (curr?.value.$d) {
            const startDate = new Date(curr?.value as Date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            acc[`filters[$or][${idx}][${curr.id}][$gte]`] =
              startDate.toISOString();
            acc[`filters[$or][${idx}][${curr.id}][$lt]`] =
              endDate.toISOString();
            //@ts-ignore
          } else if (Array.isArray(curr?.value)) {
            //@ts-ignore
            curr?.value?.forEach((value, index) => {
              acc[`filters[$or][${index}][${curr.id}][$contains]`] = `${value}`;
            });
          } else {
            acc[
              `filters[$or][${idx}][${curr?.id}][$contains]`
            ] = `${curr?.value}`;
          }

          return acc;
        }, {}),
      };
      const searchParams = new URLSearchParams(params);
      try {
        const requestsData: any = await api.getAllRequestsByServiceSlug(
          serviceData.data[0].attributes.slug,
          searchParams.toString()
        );
        const tableData = requestsData.data.map((req) => {
          req.attributes.id = req.id;
          return req.attributes;
        });
        setData(tableData);
        setService(serviceData.data[0].attributes);
        // setRequests(requestsData.results);
        setRowCount(requestsData.pagination.total);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      } finally {
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters, //re-fetch when column filters change
    debouncedGlobalFilter, //re-fetch when global filter changes
    pagination.pageIndex, //re-fetch when page index changes
    pagination.pageSize, //re-fetch when page size changes
    sorting, //re-fetch when sorting changes
  ]);
  const columns = useMemo<MRT_ColumnDef<Request>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'رقم الطلب',
      },
      {
        accessorKey: 'talent_name',
        header: 'مقدم الطلب',
      },
      {
        accessorKey: 'status',
        header: 'حالة الطلب',
        filterSelectOptions: [
          { label: 'قيد المراجعه', value: 'reviewing' },
          { label: 'تم الرفض', value: 'rejected' },
          { label: 'فى انتظار الدفع', value: 'waitForPayment' },
          { label: 'استيفاء بيانات', value: 'missingData' },
          { label: 'تم الغاء الطلب', value: 'cancelled' },
          { label: 'تم الدفع', value: 'paid' },
          { label: 'جاهز للاستلام', value: 'readyToPick' },
          { label: 'تم الاستلام', value: 'picked' },
        ],
        filterVariant: 'multi-select',
        Cell: ({ cell }) => statusMap[cell.getValue<string>()],
      },
      {
        id: 'createdAt',
        accessorFn: (originalRow) => new Date(originalRow.createdAt),
        header: 'تاريخ الإنشاء',
        filterVariant: 'date',
        Cell: ({ cell }) =>
          dayjsAr(cell.getValue<Date>()).format('D MMMM YYYY h:mm A'),
      },

      {
        id: 'updatedAt',
        accessorFn: (originalRow) => new Date(originalRow.updatedAt),
        header: 'تاريخ آخر تعديل',
        filterVariant: 'date',
        Cell: ({ cell }) =>
          dayjsAr(cell.getValue<Date>()).format('D MMMM YYYY h:mm A'),
      },
      {
        accessorKey: 'serviceName',
        header: 'اسم الخدمة',
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      showColumnFilters: false,
      sorting: [{ id: 'updatedAt', desc: true }],
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'حدث خطأ في عرض البيانات',
        }
      : undefined,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleRowClick(row.original);
      },
      sx: {
        cursor: 'pointer',
      },
    }),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobalFilterChangeDebounced,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    localization: MRT_Localization_AR,
    rowCount,
    state: {
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <div className="services">
        <Layout>
          <BaseHeaderLayout
            title={service.label}
            subtitle={service.description}
            as="h2"
          />
          <div className="createRequest">
            <Link to={`/plugins/services/${serviceSlug}/createRequest`}>
              <Button variant="secondary" endIcon={<Plus />}>
                انشاء طلب جديد
              </Button>
            </Link>
          </div>

          <ContentLayout>
            <MaterialReactTable table={table} />
          </ContentLayout>
        </Layout>
      </div>
    </LocalizationProvider>
  );
};

export default ServicePage;
