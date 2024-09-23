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

import MenuTypeTableRow from '../menu-type-table-row';
import MenuTypeTableToolbar from '../menu-type-table-toolbar';
import ServiceAddUpdateDialog from '../menu-type-add-update-dialog';

const TABLE_HEAD = [
  { id: 'type', label: i18n.t('menuType.list.heading.menuType'), width: 120, isSort: true },
  { id: 'type_ru', label: i18n.t('menuType.list.heading.menuTypeRu'), width: 120, isSort: true },
  { id: '', width: 88 },
];

const defaultFilters = {
  type: '',
};

export default function MenuTypeListView() {
  // States
  const [filters, setFilters] = useState(defaultFilters);

  const [isEditMenuType, setIsEditMenuType] = useState(false);

  // Hooks
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const { t } = useTranslate();

  const addUpdateHandler = useBoolean();

  const [menuTypes, isMenuTypeLoading, fetchMenuType] = useMetaData(API_ROUTER.menuType.list);

  const dataFiltered = applyFilter({
    inputData: menuTypes || [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !!filters.type;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const onReset = useCallback(() => {
    table.onResetPage();
    fetchMenuType();
  }, [table, fetchMenuType]);

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
        const res = await axiosDelete(API_ROUTER.menuType.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.MENU_TYPE_DELETE_SUCCESS, {
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
          await axiosDelete(API_ROUTER.menuType.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.MENU_TYPE_DELETE_SUCCESS, {
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
    setIsEditMenuType(dataFiltered?.find((item) => item.id === id));
    addUpdateHandler.onTrue();
  };

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isEditMenuType) setIsEditMenuType(false);
  }, [addUpdateHandler, isEditMenuType]);

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
      <ServiceAddUpdateDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onReset()}
        isEdit={isEditMenuType}
      />
    ),
    [addUpdateHandler, isEditMenuType, onClose, onReset]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('menuType.heading')}
          links={[
            { name: t('menuType.links.dashboard'), href: paths.dashboard.root },
            { name: t('menuType.links.menuType'), href: paths.dashboard.menuType.list },
            { name: t('menuType.links.list') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => addUpdateHandler.onTrue()}
            >
              {t('menuType.button.add')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {renderAddUpdateService}
        {isMenuTypeLoading ? (
          renderLoading
        ) : (
          <Card>
            <MenuTypeTableToolbar
              filters={filters}
              onFilters={handleFilters}
              roleOptions={_roles}
            />
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
                  <Tooltip title={t('menuType.tooltip.delete')}>
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
                        <MenuTypeTableRow
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

                    <TableNoData notFound={notFound} title={t('menuType.list.emptyText')} />
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
        title={t('menuType.button.delete')}
        content={
          <>
            {t('menuType.texts.confirmationText')} <strong> {table.selected.length} </strong>{' '}
            {t('menuType.texts.type')}
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
            {t('menuType.button.delete')}
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { type } = filters;
  const stabilizedThis = inputData?.map((el, index) => [el, index]) ?? [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (type) {
    inputData = inputData.filter(
      (service) =>
        service.type.toLowerCase().indexOf(type.toLowerCase()) !== -1 ||
        service.type.toLowerCase().indexOf(type.toLowerCase()) !== -1
    );
  }

  return inputData;
}
