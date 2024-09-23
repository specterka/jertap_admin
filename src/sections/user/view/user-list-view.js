'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useMetaData from 'src/hooks/use-meta-data';
import { useBoolean } from 'src/hooks/use-boolean';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { _user_roles } from 'src/_mock';
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

import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

const TABLE_HEAD = [
  { id: 'username', label: i18n.t('user.list.heading.username'), width: 180, isSort: true },
  { id: 'firstName', label: i18n.t('user.list.heading.firstName'), width: 180, isSort: true },
  { id: 'mobile_number', label: i18n.t('user.list.heading.mobile_number'), width: 180 },
  { id: 'email', label: i18n.t('user.list.heading.email'), width: 220, isSort: true },
  { id: 'role', label: i18n.t('user.list.heading.role'), width: 180 },
  { id: 'created_at', label: i18n.t('user.list.heading.created_at'), width: 180, isSort: true },
  { id: '', width: 88 },
];

const defaultFilters = {
  search: '',
  role: [],
};

export default function UserListView() {
  const initConfig = {
    page: 1,
  };
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'created_at', defaultOrder: 'asc' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const [userResponse, isLoading, fetchUsers] = useMetaData(API_ROUTER.user.list, {
    ...initConfig,
  });

  const [tableConfig, setTableConfig] = useState(initConfig);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !userResponse?.results?.length;

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    fetchUsers({ page: 1 });
  }, [fetchUsers]);

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchUsers({ page: 1 });
  }, [fetchUsers]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.user.remove(id));
        if (!res.status) {
          return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.USER_DELETE_SUCCESS, {
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

  const handleDeleteRows = useCallback(async () => {
    try {
      if (!table.selected.length)
        return enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });

      await Promise.all(
        table.selected.map(async (item) => {
          await axiosDelete(API_ROUTER.user.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.USERS_DELETE_SUCCESS, {
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

  const onSearch = useCallback(async () => {
    try {
      setTableConfig((prev) => ({ ...prev, page: 1 }));
      fetchUsers({
        page: 1,
        search: filters?.search?.trim() || '',
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  }, [enqueueSnackbar, fetchUsers, filters, tableConfig]);

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchUsers({
          page: tableConfig.page,
          ...(tableConfig.search !== '' ? { search: tableConfig.search } : {}),
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        });
      }
    },
    [table, fetchUsers, tableConfig]
  );

  const handleRemoveKeyword = useCallback(() => {
    setFilters((prev) => ({ ...prev, search: '' }));
    fetchUsers({ page: 1 });
  }, [fetchUsers]);

  const handleRemoveRole = useCallback(
    (inputValue) => {
      setFilters((prev) => ({ ...prev, role: '' }));
      setTableConfig((prev) => ({ ...prev, page: 1 }));
      fetchUsers({
        page: 1,
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
    },
    [fetchUsers, tableConfig]
  );

  const handleFilterRole = useCallback(
    (event) => {
      setFilters((prev) => ({
        ...prev,
        role: event.target.value,
        search: '',
      }));
      setTableConfig((prev) => ({ ...prev, page: 1 }));
      fetchUsers({
        page: 1,
        ...(event.target.value ? { [event.target.value]: 'True' } : {}),
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
    },
    [fetchUsers, tableConfig]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchUsers({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchUsers, table]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('user.heading')}
          links={[
            { name: t('user.page_name.dashboard'), href: paths.dashboard.root },
            { name: t('user.page_name.user'), href: paths.dashboard.user.list },
            { name: t('user.page_name.list') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          {isLoading ? (
            renderLoading
          ) : (
            <>
              <UserTableToolbar
                filters={filters}
                onFilters={handleFilters}
                //
                roleOptions={_user_roles}
                search={tableConfig?.search}
                onSearch={onSearch}
                handleFilterRole={handleFilterRole}
              />

              {canReset && (
                <UserTableFiltersResult
                  filters={filters}
                  onFilters={handleFilters}
                  onResetFilters={handleResetFilters}
                  results={userResponse?.count}
                  sx={{ p: 2.5, pt: 0 }}
                  handleRemoveKeyword={handleRemoveKeyword}
                  handleRemoveRole={handleRemoveRole}
                />
              )}

              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected.length}
                  rowCount={userResponse?.results?.length}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      userResponse?.results?.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Delete">
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
                      rowCount={userResponse?.results?.length}
                      numSelected={table.selected.length}
                      onSort={onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          userResponse?.results?.map((row) => row.id)
                        )
                      }
                    />

                    <TableBody>
                      {userResponse?.results?.map((row) => (
                        <UserTableRow
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

                      <TableNoData notFound={notFound} title="No Users Found" />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={userResponse?.count || 0}
                page={tableConfig.page - 1 || 0}
                rowsPerPage={15}
                onPageChange={onChangePage}
                dense={table.dense}
                onChangeDense={table.onChangeDense}
              />
            </>
          )}
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('user.confirmation.title')}
        content={
          <>
            {t('user.confirmation.description')} <strong> {table.selected.length} </strong>{' '}
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
            {t('user.button.delete')}
          </Button>
        }
      />
    </>
  );
}
