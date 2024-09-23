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

import AdsTableRow from '../ads-table-row';
import AdsAddUpdateDialog from '../ads-add-update-dialog';

const TABLE_HEAD = [
  { id: 'cover_img', label: i18n.t('ads.list.heading.cover_img'), width: 180 },
  { id: 'priority', label: i18n.t('ads.list.heading.priority'), width: 180, isSort: true },
  { id: 'is_active', label: i18n.t('ads.list.heading.is_active'), width: 160 },
  { id: 'created_at', label: i18n.t('ads.list.heading.created_at'), width: 180, isSort: true },
  { id: 'modified_at', label: i18n.t('ads.list.heading.modified_at'), width: 180, isSort: true },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function AdsListView() {
  const initConfig = {
    page: 1,
  };
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'created_at',
  });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const addUpdateHandler = useBoolean();

  const [adsResponse, isAdsLoading, fetchAds] = useMetaData(API_ROUTER.ads.list, { ...initConfig });

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isEditAds, setIsAds] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !adsResponse?.results?.length;

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchAds({ page: 1 });
  }, [fetchAds]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.ads.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.ADS_DELETE_SUCCESS, {
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
          await axiosDelete(API_ROUTER.ads.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.ADS_DELETE_SUCCESS, {
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
      setIsAds(adsResponse?.results?.find((item) => item.id === id));
      addUpdateHandler.onTrue();
    },
    [setIsAds, addUpdateHandler, adsResponse]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchAds({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchAds, table]
  );

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchAds({
          page: tableConfig.page,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        });
      }
    },
    [table, fetchAds, tableConfig]
  );

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isEditAds) setIsAds(false);
  }, [addUpdateHandler, isEditAds]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderAddUpdateAds = useMemo(
    () => (
      <AdsAddUpdateDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onResetConfig()}
        isEdit={isEditAds}
      />
    ),
    [addUpdateHandler, isEditAds, onClose, onResetConfig]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('ads.heading')}
          links={[
            { name: t('ads.page_name.dashboard'), href: paths.dashboard.root },
            { name: t('ads.page_name.ads'), href: paths.dashboard.ads.list },
            { name: t('ads.page_name.list') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => addUpdateHandler.onTrue()}
            >
              {t('ads.button.new')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {renderAddUpdateAds}
        {isAdsLoading ? (
          renderLoading
        ) : (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={adsResponse?.results?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    adsResponse?.results?.map((row) => row.id)
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
                    rowCount={adsResponse?.results?.length}
                    numSelected={table.selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        adsResponse?.results?.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {adsResponse?.results?.map((row) => (
                      <AdsTableRow
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

                    <TableNoData notFound={notFound} title="No Advertisement Found" />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={adsResponse?.count || 0}
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
        title={t('ads.confirmation.title')}
        content={
          <>
            {t('ads.confirmation.description')} <strong> {table.selected.length} </strong>{' '}
            {t('ads.confirmation.items')}
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
            {t('ads.button.delete')}
          </Button>
        }
      />
    </>
  );
}
