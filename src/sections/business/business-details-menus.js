import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState, useCallback } from 'react';
import { IconButton } from 'yet-another-react-lightbox';

import { Card, Table, Stack, Button, Tooltip, TableBody, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';

import useMetaData from 'src/hooks/use-meta-data';
import { useBoolean } from 'src/hooks/use-boolean';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';
import { axiosDelete } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import BusinessMenuTableRow from './business-menu-table-row';
import BusinessMenuTableToolbar from './business-menu-toolbar';
import BusinessMenuUploadDialog from './business-menu-upload-dialog';
import BusinessMenuAddUpdateDialog from './business-menu-add-update-dialog';

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

const TABLE_HEAD = [
  { id: 'cover_image', label: i18n.t('business.tabs.menus.list.heading.image'), width: 110 },
  {
    id: 'Item_name',
    label: i18n.t('business.tabs.menus.list.heading.name'),
    width: 180,
    isSort: true,
  },
  {
    id: 'price',
    label: i18n.t('business.tabs.menus.list.heading.price'),
    width: 180,
    isSort: true,
  },
  {
    id: 'menu_type.name',
    label: i18n.t('business.tabs.menus.list.heading.type'),
    width: 190,
    isSort: true,
  },
  {
    id: 'description',
    label: i18n.t('business.tabs.menus.list.heading.description'),
    width: 220,
    isSort: true,
  },
  {
    id: 'is_veg',
    label: i18n.t('business.tabs.menus.list.heading.isVeg'),
    width: 140,
    isSort: true,
  },
  {
    id: 'created_at',
    label: i18n.t('business.tabs.menus.list.heading.created_at'),
    width: 220,
    isSort: true,
  },
  {
    id: 'modified_at',
    label: i18n.t('business.tabs.menus.list.heading.modified_at'),
    width: 180,
    isSort: true,
  },
  { id: '', width: 88 },
];

export default function BusinessDetailsMenus({ business }) {
  // Hooks
  const initConfig = {
    page: 1,
  };

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'created_at',
    defaultOrder: 'desc',
  });

  const confirm = useBoolean();

  const addUpdateHandler = useBoolean();

  const uploadHandler = useBoolean();

  const [menuResponse, isMenusLoading, fetchMenus] = useMetaData(
    API_ROUTER.business.menus.list(business.id),
    { ...initConfig }
  );

  const [filters] = useState(defaultFilters);

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isEditCategory, setIsCategory] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !menuResponse?.results?.length;

  const handleFilters = useCallback((name, value) => {
    setTableConfig((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchMenus({ page: 1 });
  }, [fetchMenus]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.business.menus.remove(business.id, id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.BUSINESS_CUISINE_DELETE_SUCCESS, {
            variant: TOAST_TYPES.SUCCESS,
          });
          onResetConfig();
        }
      } catch (error) {
        enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      return null;
    },
    [enqueueSnackbar, onResetConfig, business]
  );

  const onSearch = useCallback(async () => {
    try {
      setTableConfig((prev) => ({ ...prev, page: 1 }));
      fetchMenus({
        page: 1,
        search: tableConfig?.search?.trim() || '',
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  }, [enqueueSnackbar, fetchMenus, tableConfig]);

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchMenus({
          page: tableConfig.page,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
          ...(tableConfig.search ? { search: tableConfig.search } : {}),
        });
      }
    },
    [table, fetchMenus, tableConfig]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      if (!table.selected.length)
        return enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });

      await Promise.all(
        table.selected.map(async (item) => {
          await axiosDelete(API_ROUTER.business.menus.remove(business.id, item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.BUSINESS_CUISINE_DELETE_SUCCESS, {
        variant: TOAST_TYPES.SUCCESS,
      });
      table.setSelected([]);
      onResetConfig();
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  }, [enqueueSnackbar, table, onResetConfig, business]);

  const handleEditRow = useCallback(
    (id) => {
      setIsCategory(menuResponse?.results?.find((item) => item.id === id));
      addUpdateHandler.onTrue();
    },
    [setIsCategory, addUpdateHandler, menuResponse]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchMenus({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchMenus, table]
  );

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isEditCategory) setIsCategory(false);
  }, [addUpdateHandler, isEditCategory]);

  const onCloseUpload = useCallback(() => {
    uploadHandler.onFalse();
  }, [uploadHandler]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderAddUpdateBusinessMenu = useMemo(
    () => (
      <BusinessMenuAddUpdateDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onResetConfig()}
        isEdit={isEditCategory}
        businessId={business.id}
      />
    ),
    [addUpdateHandler, isEditCategory, onClose, onResetConfig, business]
  );

  const renderUploadBusinessMenu = useMemo(
    () => (
      <BusinessMenuUploadDialog
        open={uploadHandler.value}
        onClose={() => onCloseUpload()}
        fetchData={() => onResetConfig()}
        businessId={business.id}
      />
    ),
    [uploadHandler, onCloseUpload, onResetConfig, business]
  );

  return (
    <>
      <CustomBreadcrumbs
        heading={t('business.tabs.menus.title')}
        links={[
          { name: t('business.tabs.menus.links.dashboard'), href: paths.dashboard.root },
          { name: business?.name, href: paths.dashboard.business.view(business.id) },
          { name: t('business.tabs.menus.title') },
        ]}
        action={
          <Stack direction={{ md: 'row', xs: 'column' }} gap={1}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:upload-bold" />}
              onClick={() => uploadHandler.onTrue()}
              color="primary"
            >
              {t('business.tabs.menus.button.upload')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => addUpdateHandler.onTrue()}
            >
              {t('business.tabs.menus.button.create')}
            </Button>
          </Stack>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {renderAddUpdateBusinessMenu}
      {renderUploadBusinessMenu}
      {isMenusLoading ? (
        renderLoading
      ) : (
        <Card>
          <BusinessMenuTableToolbar
            filters={filters}
            onFilters={handleFilters}
            search={tableConfig?.search}
            onSearch={onSearch}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={menuResponse?.results?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  menuResponse?.results?.map((row) => row.id)
                )
              }
              action={
                <Tooltip title={t('category.button.delete')}>
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
                  rowCount={menuResponse?.results?.length}
                  numSelected={table.selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      menuResponse?.results?.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {menuResponse?.results?.map((row) => (
                    <BusinessMenuTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, [].length)}
                  />
                  <TableNoData notFound={notFound} title="No Menus Found" />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={menuResponse?.count || 0}
            page={tableConfig.page - 1 || 0}
            rowsPerPage={15}
            onPageChange={onChangePage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      )}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('category.confirmation.title')}
        content={
          <>
            {t('category.confirmation.description')} <strong> {table.selected.length} </strong>{' '}
            {t('category.confirmation.items')}
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
            {t('category.button.delete')}
          </Button>
        }
      />
    </>
  );
}

BusinessDetailsMenus.propTypes = {
  business: PropTypes.object,
};
