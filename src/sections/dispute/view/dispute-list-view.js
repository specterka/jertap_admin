'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
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
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { DISPUTE_STATUS_OPTIONS } from 'src/_mock/_dispute';

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
  TablePaginationCustom,
} from 'src/components/table';

import DisputeDialog from '../dispute-dialog';
import DisputeTableRow from '../dispute-table-row';

const TABLE_HEAD = [
  { id: 'query_by', label: i18n.t('dispute.list.heading.raisedBy'), width: 180, isSort: false },
  { id: 'is_resolved', label: i18n.t('dispute.list.heading.status'), width: 180, isSort: true },
  { id: 'created_at', label: i18n.t('dispute.list.heading.createdAt'), width: 220, isSort: true },
  { id: 'modified_at', label: i18n.t('dispute.list.heading.modifiedAt'), width: 180, isSort: true },
  { id: '', width: 88, isSort: false },
];

const STATUS_OPTIONS = [
  { value: '', label: i18n.t('keywords.disputeStatus.all') },
  ...DISPUTE_STATUS_OPTIONS,
];

export default function DisputeListView() {
  const initConfig = {
    page: 1,
    is_resolved: '',
  };

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'created_at',
    defaultOrder: 'desc',
  });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const addUpdateHandler = useBoolean();

  const [disputeResponse, isLoading, fetchDisputes] = useMetaData(API_ROUTER.disputes.list, {
    page: initConfig.page,
  });

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isDisputeOpen, setIsDisputeOpen] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !disputeResponse?.results?.length;

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchDisputes({ page: 1 });
  }, [fetchDisputes]);

  const { t } = useTranslate();

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.disputes.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.DISPUTE_DELETE_SUCCESS, {
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
          await axiosDelete(API_ROUTER.disputes.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.DISPUTES_DELETE_SUCCESS, {
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

  const handleViewRow = useCallback(
    (id) => {
      setIsDisputeOpen(disputeResponse?.results?.find((item) => item.id === id));
      addUpdateHandler.onTrue();
    },
    [setIsDisputeOpen, addUpdateHandler, disputeResponse]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchDisputes({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchDisputes, table]
  );

  const onChangeStatus = (_, value) => {
    setTableConfig((prev) => ({ ...prev, page: initConfig.page, is_resolved: value }));
    fetchDisputes({ page: 1, ...(value !== '' ? { is_resolved: value } : {}) });
  };

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchDisputes({
          page: tableConfig.page,
          ...(tableConfig.is_resolved !== '' ? { is_resolved: tableConfig.is_resolved } : {}),
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        });
      }
    },
    [table, fetchDisputes, tableConfig]
  );

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isDisputeOpen) setIsDisputeOpen(false);
  }, [addUpdateHandler, isDisputeOpen]);

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
      <DisputeDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onResetConfig()}
        isEdit={isDisputeOpen}
      />
    ),
    [addUpdateHandler, isDisputeOpen, onClose, onResetConfig]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('dispute.heading')}
          links={[
            { name: t('dispute.links.dashboard'), href: paths.dashboard.root },
            { name: t('dispute.links.dispute'), href: paths.dashboard.dispute.list },
            { name: t('dispute.links.list') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {renderRequestDialog}
        {isLoading ? (
          renderLoading
        ) : (
          <Card>
            <Tabs
              value={tableConfig.is_resolved}
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
                    rowCount={disputeResponse?.results?.length}
                    numSelected={table.selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {disputeResponse?.results?.map((row) => (
                      <DisputeTableRow
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

                    <TableNoData notFound={notFound} title={t('dispute.list.emptyText')} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={disputeResponse?.count || 0}
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
        title={t('dispute.button.delete')}
        content={
          <>
            {t('dispute.confirmation.deleteText')} <strong> {table.selected.length} </strong>{' '}
            {t('dispute.confirmation.items')}
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
            {t('dispute.button.delete')}
          </Button>
        }
      />
    </>
  );
}
