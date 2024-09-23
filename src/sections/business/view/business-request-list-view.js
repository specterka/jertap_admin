'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { Tab, Tabs, alpha } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import useMetaData from 'src/hooks/use-meta-data';
import { useBoolean } from 'src/hooks/use-boolean';

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

import BusinessRequestDialog from '../business-request-dialog';
import BusinessRequestTableRow from '../business-request-table-row';

const TABLE_HEAD = [
  {
    id: 'request_for.name',
    label: i18n.t('business.request_busiess.heading.request_for'),
    width: 200,
  },
  {
    id: 'request_by.username',
    label: i18n.t('business.request_busiess.heading.request_by'),
    width: 200,
  },
  { id: 'type', label: i18n.t('business.request_busiess.heading.type'), width: 120 },
  { id: 'is_approved', label: i18n.t('business.request_busiess.heading.is_approved'), width: 120 },
  { id: 'created_at', label: i18n.t('business.request_busiess.heading.created_at'), width: 150 },
  { id: 'modified_at', label: i18n.t('business.request_busiess.heading.modified_at'), width: 150 },
  { id: '', width: 88 },
];

const STATUS_OPTIONS = [{ value: '', label: 'All' }, ...CLAIM_STATUS_OPTIONS];

export default function BusinessRequestListView() {
  const initConfig = {
    page: 1,
    is_approved: '',
  };

  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const [requestResponse, isClaimFetching, fetchCategories] = useMetaData(
    API_ROUTER.business.requests.list,
    {
      page: initConfig.page,
    }
  );

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const addUpdateHandler = useBoolean();

  const notFound = !requestResponse?.results?.length;

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1, search: '', is_approved: '' }));
    fetchCategories({ page: 1 });
  }, [fetchCategories]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.business.requests.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.BUSINESS_REQUESTS_DELETE_SUCCESS, {
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
  const handleViewRow = useCallback(
    (id) => {
      setIsRequestOpen(requestResponse?.results?.find((item) => item.id === id));
      addUpdateHandler.onTrue();
    },
    [setIsRequestOpen, addUpdateHandler, requestResponse]
  );

  const onChangeStatus = (_, value) => {
    setTableConfig((prev) => ({ ...prev, page: initConfig.page, is_approved: value }));
    fetchCategories({ page: 1, ...(value !== '' ? { is_approved: value } : {}) });
  };

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchCategories({
        page: page + 1,
        ...(tableConfig.is_approved !== '' ? { is_approved: tableConfig.is_approved } : {}),
      });
      table.setSelected([]);
    },
    [setTableConfig, fetchCategories, table, tableConfig.is_approved]
  );
  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isRequestOpen) setIsRequestOpen(false);
  }, [addUpdateHandler, isRequestOpen]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderRequestDialog = useMemo(
    () => (
      <BusinessRequestDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onResetConfig()}
        isEdit={isRequestOpen}
      />
    ),
    [addUpdateHandler, isRequestOpen, onClose, onResetConfig]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('business.request_busiess.heading.request_list')}
        links={[
          {
            name: i18n.t('business.request_busiess.page_name.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: i18n.t('business.request_busiess.page_name.category'),
            href: paths.dashboard.business.requests,
          },
          { name: i18n.t('business.request_busiess.page_name.list') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {renderRequestDialog}
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
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={requestResponse?.results?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {requestResponse?.results?.map((row) => (
                    <BusinessRequestTableRow
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

                  <TableNoData notFound={notFound} title={t('business.request_busiess.title')} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={requestResponse?.count || 0}
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
