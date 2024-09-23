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
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import CategoryTableRow from '../category-table-row';
import CategoryTableToolbar from '../category-table-toolbar';
import CategoryAddUpdateDialog from '../category-add-update-dialog';

const TABLE_HEAD = [
  { id: 'icon', label: i18n.t('category.list.heading.icon'), width: 40 },
  { id: 'name', label: i18n.t('category.list.heading.name'), width: 180, isSort: true },
  { id: 'name_ru', label: i18n.t('category.list.heading.name_ru'), width: 190, isSort: true },
  { id: 'created_at', label: i18n.t('category.list.heading.created_at'), width: 220, isSort: true },
  {
    id: 'modified_at',
    label: i18n.t('category.list.heading.modified_at'),
    width: 180,
    isSort: true,
  },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

export default function CategoryListView() {
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

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const addUpdateHandler = useBoolean();

  const [categoryResponse, isCategoriesLoading, fetchCategories] = useMetaData(
    API_ROUTER.category.list,
    { ...initConfig }
  );

  const [filters] = useState(defaultFilters);

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isEditCategory, setIsCategory] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !categoryResponse?.results?.length;

  const handleFilters = useCallback((name, value) => {
    setTableConfig((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchCategories({ page: 1 });
  }, [fetchCategories]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.category.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.CATEGORY_DELETE_SUCCESS, {
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
    [enqueueSnackbar, onResetConfig]
  );

  const onSearch = useCallback(async () => {
    try {
      setTableConfig((prev) => ({ ...prev, page: 1 }));
      fetchCategories({
        page: 1,
        search: tableConfig?.search?.trim() || '',
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  }, [enqueueSnackbar, fetchCategories, tableConfig]);

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchCategories({
          page: tableConfig.page,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
          ...(tableConfig.search ? { search: tableConfig.search } : {}),
        });
      }
    },
    [table, fetchCategories, tableConfig]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      if (!table.selected.length)
        return enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });

      await Promise.all(
        table.selected.map(async (item) => {
          await axiosDelete(API_ROUTER.category.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.CATEGORIES_DELETE_SUCCESS, {
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
  }, [enqueueSnackbar, table, onResetConfig]);

  const handleEditRow = useCallback(
    (id) => {
      setIsCategory(categoryResponse?.results?.find((item) => item.id === id));
      addUpdateHandler.onTrue();
    },
    [setIsCategory, addUpdateHandler, categoryResponse]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchCategories({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchCategories, table]
  );

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isEditCategory) setIsCategory(false);
  }, [addUpdateHandler, isEditCategory]);

  const onAfterUpdate = useCallback(
    (isEdit = true) => {
      if (isEdit) {
        fetchCategories({
          page: tableConfig.page,
          ...(tableConfig?.search?.trim()
            ? {
                search: tableConfig?.search?.trim() || '',
              }
            : {}),
          ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
        });
      } else {
        onResetConfig();
      }
    },
    [tableConfig, fetchCategories, onResetConfig]
  );

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderAddUpdateCategory = useMemo(
    () => (
      <CategoryAddUpdateDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={onAfterUpdate}
        isEdit={isEditCategory}
      />
    ),
    [addUpdateHandler, isEditCategory, onClose, onAfterUpdate]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('category.heading')}
          links={[
            { name: t('category.page_name.dashboard'), href: paths.dashboard.root },
            { name: t('category.page_name.category'), href: paths.dashboard.category.list },
            { name: t('category.page_name.list') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => addUpdateHandler.onTrue()}
            >
              {t('category.button.new')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {renderAddUpdateCategory}
        {isCategoriesLoading ? (
          renderLoading
        ) : (
          <Card>
            <CategoryTableToolbar
              filters={filters}
              onFilters={handleFilters}
              roleOptions={_roles}
              search={tableConfig?.search}
              onSearch={onSearch}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={categoryResponse?.results?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    categoryResponse?.results?.map((row) => row.id)
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
                    rowCount={categoryResponse?.results?.length}
                    numSelected={table.selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        categoryResponse?.results?.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {categoryResponse?.results?.map((row) => (
                      <CategoryTableRow
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

                    <TableNoData notFound={notFound} title={t('category.list.emptyText')} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={categoryResponse?.count || 0}
              page={tableConfig.page - 1 || 0}
              rowsPerPage={15}
              onPageChange={onChangePage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        )}
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('category.confirmation.title')}
        content={
          <>
            {t('category.table_row.confirmation.child_delete')}
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
