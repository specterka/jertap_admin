'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import useMetaData from 'src/hooks/use-meta-data';
import { useBoolean } from 'src/hooks/use-boolean';

import { API_ROUTER } from 'src/utils/axios';

import { _roles } from 'src/_mock';
import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';
import { axiosDelete } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import CuisineTableRow from '../cuisine-table-row';
import CuisineTableToolbar from '../cuisine-table-toolbar';
import CuisineAddUpdateDialog from '../cuisine-add-update-dialog';

const TABLE_HEAD = [
  { id: 'cuisines', label: i18n.t('cuisine.list.heading.cuisines'), width: 120, isSort: true },
  {
    id: 'cuisines_ru',
    label: i18n.t('cuisine.list.heading.cuisines_ru'),
    width: 120,
    isSort: true,
  },
  { id: 'created_at', label: i18n.t('cuisine.list.heading.created_at'), width: 120, isSort: true },
  {
    id: 'modified_at',
    label: i18n.t('cuisine.list.heading.modified_at'),
    width: 120,
    isSort: true,
  },
  { id: '', width: 88 },
];

const defaultFilters = {
  cuisines: '',
};

export default function CuisineListView() {
  // States
  const [filters, setFilters] = useState(defaultFilters);

  const [isEditService, setIsService] = useState(false);

  // Hooks
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'created_at',
    defaultOrder: 'desc',
  });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const addUpdateHandler = useBoolean();

  const [cuisines, isCuisineLoading, fetchCuisines] = useMetaData(API_ROUTER.cuisine.list);

  const dataFiltered = applyFilter({
    inputData: cuisines || [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !!filters.cuisines;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const onReset = useCallback(() => {
    table.onResetPage();
    fetchCuisines();
  }, [table, fetchCuisines]);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.cuisine.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.CUISINE_DELETE_SUCCESS, {
            variant: TOAST_TYPES.SUCCESS,
          });
          onReset();
        }
      } catch (error) {
        enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      return null;
    },
    [enqueueSnackbar, onReset]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      if (!table.selected.length)
        return enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });

      await Promise.all(
        table.selected.map(async (item) => {
          await axiosDelete(API_ROUTER.cuisine.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.CUISINE_DELETE_SUCCESS, {
        variant: TOAST_TYPES.SUCCESS,
      });
      table.setSelected([]);
      onReset();
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  }, [enqueueSnackbar, table, onReset]);

  const handleEditRow = async (id) => {
    setIsService(dataFiltered?.find((item) => item.id === id));
    addUpdateHandler.onTrue();
  };

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isEditService) setIsService(false);
  }, [addUpdateHandler, isEditService]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderAddUpdateService = useMemo(
    () => (
      <CuisineAddUpdateDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onReset()}
        isEdit={isEditService}
      />
    ),
    [addUpdateHandler, isEditService, onClose, onReset]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('cuisine.heading')}
          links={[
            { name: t('cuisine.page_name.dashboard'), href: paths.dashboard.root },
            { name: t('cuisine.page_name.cuisine'), href: paths.dashboard.cuisine.list },
            { name: t('cuisine.page_name.list') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => addUpdateHandler.onTrue()}
            >
              {t('cuisine.button.new')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {renderAddUpdateService}
        {isCuisineLoading ? (
          renderLoading
        ) : (
          <Card>
            <CuisineTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles} />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered?.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title={t('cuisine.button.delete')}>
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered?.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered?.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      ?.map((row) => (
                        <CuisineTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} title={t('cuisine.list.emptyText')} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        )}
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('cuisine.confirmation.title')}
        content={
          <>
            {t('cuisine.confirmation.description')} <strong> {table.selected.length} </strong>{' '}
            {t('cuisine.confirmation.items')}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {t('cuisine.button.delete')}
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { cuisines } = filters;
  const stabilizedThis = inputData?.map((el, index) => [el, index]) ?? [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (cuisines) {
    inputData = inputData.filter(
      (service) =>
        service.cuisines.toLowerCase().indexOf(cuisines.toLowerCase()) !== -1 ||
        service.cuisines.toLowerCase().indexOf(cuisines.toLowerCase()) !== -1
    );
  }

  return inputData;
}
