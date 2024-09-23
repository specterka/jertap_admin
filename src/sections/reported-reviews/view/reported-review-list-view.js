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

import ReportedReviewDialog from '../reported-review-dialog';
import ReportedReviewTableRow from '../reported-review-table-row';

const TABLE_HEAD = [
  { id: 'restaurant.id', label: i18n.t('reportedReview.list.heading.business'), width: 220 },
  { id: 'user.id', label: i18n.t('reportedReview.list.heading.reviewer'), width: 180 },
  { id: 'rating', label: i18n.t('reportedReview.list.heading.rating'), width: 180 },
  {
    id: 'created_at',
    label: i18n.t('reportedReview.list.heading.reportedAt'),
    width: 220,
    isSort: true,
  },
  {
    id: 'modified_at',
    label: i18n.t('reportedReview.list.heading.modifiedAt'),
    width: 180,
    isSort: true,
  },
  { id: '', width: 88 },
];

export default function ReportedReviewListView() {
  const initConfig = {
    page: 1,
  };

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'created_at',
  });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const addUpdateHandler = useBoolean();

  const [reviewsResponse, isReviewsLoading, fetchReviews] = useMetaData(
    API_ROUTER.reportReview.list,
    { ...initConfig }
  );

  const [tableConfig, setTableConfig] = useState(initConfig);

  const [isViewReview, setIsViewReview] = useState(false);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = !reviewsResponse?.results?.length;

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchReviews({ page: 1 });
  }, [fetchReviews]);

  const { t } = useTranslate();

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.reportReview.remove(id));
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.REPORTED_REVIEW_DELETE_SUCCESS, {
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
          await axiosDelete(API_ROUTER.reportReview.remove(item));
        })
      );
      enqueueSnackbar(TOAST_ALERTS.REPORTED_REVIEWS_DELETE_SUCCESS, {
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
      setIsViewReview(reviewsResponse?.results?.find((item) => item.id === id));
      addUpdateHandler.onTrue();
    },
    [setIsViewReview, addUpdateHandler, reviewsResponse]
  );

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page: page + 1 }));
      fetchReviews({ page: page + 1 });
      table.setSelected([]);
    },
    [setTableConfig, fetchReviews, table]
  );

  const onSort = useCallback(
    (id) => {
      table.onSort(id);
      if (id) {
        setTableConfig((prev) => ({
          ...prev,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        }));
        fetchReviews({
          page: tableConfig.page,
          ordering: `${table.order === 'desc' ? '-' : ''}${id}`,
        });
      }
    },
    [table, fetchReviews, tableConfig]
  );

  const onClose = useCallback(() => {
    addUpdateHandler.onFalse();
    if (isViewReview) setIsViewReview(false);
  }, [addUpdateHandler, isViewReview]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderReviewDialog = useMemo(
    () => (
      <ReportedReviewDialog
        open={addUpdateHandler.value}
        onClose={() => onClose()}
        fetchData={() => onResetConfig()}
        isEdit={isViewReview}
      />
    ),
    [addUpdateHandler, isViewReview, onClose, onResetConfig]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('reportedReview.heading')}
          links={[
            { name: t('reportedReview.links.dashboard'), href: paths.dashboard.root },
            {
              name: t('reportedReview.links.reportedReviews'),
              href: paths.dashboard.reportReview.list,
            },
            { name: t('reportedReview.links.list') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {renderReviewDialog}
        {isReviewsLoading ? (
          renderLoading
        ) : (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={reviewsResponse?.results?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    reviewsResponse?.results?.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title={t('reportedReview.button.delete')}>
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
                    rowCount={reviewsResponse?.results?.length}
                    numSelected={table.selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        reviewsResponse?.results?.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {reviewsResponse?.results?.map((row) => (
                      <ReportedReviewTableRow
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

                    <TableNoData notFound={notFound} title={t('reportedReview.list.emptyText')} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={reviewsResponse?.count || 0}
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
        title={t('reportedReview.button.delete')}
        content={
          <>
            {t('reportedReview.confirmation.confirmationText')}{' '}
            <strong> {table.selected.length} </strong> {t('reportedReview.confirmation.items')}
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
            {t('reportedReview.button.delete')}
          </Button>
        }
      />
    </>
  );
}
