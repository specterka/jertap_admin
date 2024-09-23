'use client';

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
import { RouterLink } from 'src/routes/components';

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

import CollaboratorTableRow from '../collaborator-table-row';
import CollaboratorTableToolbar from '../collaborator-table-toolbar';

const TABLE_HEAD = [
  {
    id: 'full_name',
    label: i18n.t('collaborator.list.heading.full_name'),
    width: 180,
    isSort: true,
  },
  { id: 'whatsapp', label: i18n.t('collaborator.list.heading.whatsapp'), width: 180 },
  { id: 'is_active', label: i18n.t('collaborator.list.heading.is_active'), width: 180 },
  {
    id: 'created_at',
    label: i18n.t('collaborator.list.heading.created_at'),
    width: 220,
    isSort: true,
  },
  {
    id: 'modified_at',
    label: i18n.t('collaborator.list.heading.modified_at'),
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

// ----------------------------------------------------------------------

export default function CollaboratorListView() {
  const initConfig = {
    page: 1,
  };
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'full_name',
    defaultOrder: 'desc',
  });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const router = useRouter();

  const [collaboratorResponse, isLoading, fetchCollaborators] = useMetaData(
    API_ROUTER.collaborator.list,
    { ...initConfig, is_active: false }
  );

  const [filters] = useState(defaultFilters);

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isSearched, setIsSearched] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !collaboratorResponse?.results?.length;

  const handleFilters = useCallback((name, value) => {
    setTableConfig((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchCollaborators({ page: 1 });
  }, [fetchCollaborators]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.collaborator.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.COLLABORATOR_DELETE_SUCCESS, {
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

  const onSearch = useCallback(
    async (isRefreshed = false) => {
      try {
        setTableConfig((prev) => ({ ...prev, page: 1 }));
        fetchCollaborators({
          page: 1,
          search: tableConfig?.search?.trim() || '',
          ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
        });
        if (!tableConfig?.search?.trim() && isRefreshed) setIsSearched(false);
        else setIsSearched(true);
      } catch (error) {
        enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
      }
    },
    [enqueueSnackbar, fetchCollaborators, tableConfig]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      if (!table.selected.length)
        return enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });

      await Promise.all(
        table.selected.map(async (item) => {
          await axiosDelete(API_ROUTER.collaborator.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.COLLABORATORS_DELETE_SUCCESS, {
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
      router.push(paths.dashboard.collaborator.edit(id));
    },
    [router]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchCollaborators({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchCollaborators, table]
  );

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchCollaborators({
          page: tableConfig.page,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
          ...(tableConfig.search ? { search: tableConfig.search } : {}),
        });
      }
    },
    [table, fetchCollaborators, tableConfig]
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
          heading={t('collaborator.heading')}
          links={[
            { name: t('collaborator.page_name.dashboard'), href: paths.dashboard.root },
            {
              name: t('collaborator.page_name.collaborators'),
              href: paths.dashboard.collaborator.list,
            },
            { name: t('collaborator.page_name.list') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              component={RouterLink}
              href={paths.dashboard.collaborator.new}
            >
              {t('collaborator.button.new')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {isLoading ? (
          renderLoading
        ) : (
          <Card>
            <CollaboratorTableToolbar
              filters={filters}
              onFilters={handleFilters}
              roleOptions={_roles}
              search={tableConfig?.search}
              onSearch={onSearch}
              isSearched={isSearched}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={collaboratorResponse?.results?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    collaboratorResponse?.results?.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title={t('collaborator.button.delete')}>
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
                    rowCount={collaboratorResponse?.results?.length}
                    numSelected={table.selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        collaboratorResponse?.results?.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {collaboratorResponse?.results?.map((row) => (
                      <CollaboratorTableRow
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

                    <TableNoData notFound={notFound} title={t('collaborator.list.emptyText')} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={collaboratorResponse?.count || 0}
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
        title={t('collaborator.button.delete')}
        content={
          <>
            {`${t('collaborator.confirmation.description')} ${table.selected.length} ${t(
              'collaborator.confirmation.items'
            )}`}
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
            {t('collaborator.button.delete')}
          </Button>
        }
      />
    </>
  );
}
