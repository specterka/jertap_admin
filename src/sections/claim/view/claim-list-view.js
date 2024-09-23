'use client';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { Tab, Tabs, alpha } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';
import { axiosDelete } from 'src/services/axiosHelper';
import { CLAIM_STATUS_OPTIONS } from 'src/_mock/_claim';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import ClaimTableRow from '../claim-table-row';
import ClaimTableToolbar from '../claim-table-toolbar';

const STATUS_OPTIONS = [{ value: '', label: 'All' }, ...CLAIM_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'request_for.name', label: i18n.t('claim.list.heading.request_for'), width: 200 },
  { id: 'request_by.username', label: i18n.t('claim.list.heading.request_by'), width: 200 },
  { id: 'is_approved', label: i18n.t('claim.list.heading.is_approved'), width: 120, isSort: true },
  { id: 'created_at', label: i18n.t('claim.list.heading.created_at'), width: 150, isSort: true },
  { id: 'modified_at', label: i18n.t('claim.list.heading.modified_at'), width: 150, isSort: true },
  { id: '', width: 88 },
];

export default function ClaimListView() {
  const initConfig = {
    page: 1,
    is_approved: '',
  };
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'created_at',
    defaultOrder: 'asc',
  });

  const settings = useSettingsContext();

  const router = useRouter();

  const [claimResponse, isClaimFetching, fetchClaims] = useMetaData(API_ROUTER.claim.list, {
    page: initConfig.page,
  });

  const [tableConfig, setTableConfig] = useState(initConfig);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !claimResponse?.results?.length;

  const handleFilters = useCallback((name, value) => {
    setTableConfig((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1, search: '', is_approved: '' }));
    fetchClaims({ page: 1 });
  }, [fetchClaims]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.claim.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.CLAIM_DELETE_SUCCESS, {
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
      fetchClaims({
        page: 1,
        search: tableConfig?.search?.trim() || '',
        ...(tableConfig.is_approved !== '' ? { is_approved: tableConfig.is_approved } : {}),
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  }, [enqueueSnackbar, fetchClaims, tableConfig]);

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchClaims({
          page: tableConfig.page,
          ...(tableConfig.is_resolved !== '' ? { is_resolved: tableConfig.is_resolved } : {}),
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
          ...(tableConfig.is_approved !== '' ? { is_approved: tableConfig.is_approved } : {}),
        });
      }
    },
    [table, fetchClaims, tableConfig]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.claim.edit(id));
    },
    [router]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchClaims({
        page: page + 1,
        ...(tableConfig.is_approved !== '' ? { is_approved: tableConfig.is_approved } : {}),
        ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
      });
      table.setSelected([]);
    },
    [setTableConfig, fetchClaims, table, tableConfig]
  );

  const onChangeStatus = (_, value) => {
    setTableConfig((prev) => ({ ...prev, page: initConfig.page, is_approved: value, search: '' }));
    fetchClaims({
      page: 1,
      ...(value !== '' ? { is_approved: value } : {}),
      ...(tableConfig.ordering ? { ordering: tableConfig.ordering } : {}),
    });
  };

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('claim.heading')}
        links={[
          { name: t('claim.page_name.dashboard'), href: paths.dashboard.root },
          { name: t('claim.page_name.claim'), href: paths.dashboard.claim.list },
          { name: t('claim.page_name.list') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isClaimFetching ? (
        renderLoading
      ) : (
        <Card>
          <Tabs
            value={tableConfig.is_approved}
            onChange={onChangeStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
          <ClaimTableToolbar
            onFilters={handleFilters}
            search={tableConfig?.search}
            onSearch={onSearch}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={claimResponse?.results?.length}
                  numSelected={table.selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {claimResponse?.results?.map((row) => (
                    <ClaimTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, [].length)}
                  />

                  <TableNoData notFound={notFound} title="No Categories Found" />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={claimResponse?.count || 0}
            page={tableConfig.page - 1 || 0}
            rowsPerPage={15}
            onPageChange={onChangePage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      )}
    </Container>
  );
}
