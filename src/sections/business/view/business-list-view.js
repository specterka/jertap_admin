'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPatch, axiosDelete } from 'src/services/axiosHelper';

import Iconify from 'src/components/iconify';
import { useTable } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BusinessList from '../business-list';
import BusinessSort from '../business-sort';
import BusinessSearch from '../business-search';
import BusinessSortOrder from '../business-sort-order';
import BusinessFiltersResult from '../business-filters-result';

const defaultFilters = {
  search: '',
  role: [],
};

export const BUSINESS_SORT_OPTIONS = [
  { value: 'name', label: i18n.t('business.business_sort_options.label.name') },
  { value: 'city', label: i18n.t('business.business_sort_options.label.city') },
  { value: 'created_at', label: i18n.t('business.business_sort_options.label.created_at') },
];
export const BUSINESS_SORT_ORDER_OPTIONS = [
  { value: 'asc', label: i18n.t('business.business_sort_options.label.asc') },
  { value: 'desc', label: i18n.t('business.business_sort_options.label.desc') },
];
export default function BusinessListView() {
  const initConfig = {
    page: 1,
  };

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const table = useTable();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const [sortBy, setSortBy] = useState('name');
  const [sortByOrder, setSortByOrder] = useState('asc');

  const [businessResponse, isLoading, fetchBusinesses] = useMetaData(API_ROUTER.business.list, {
    ...initConfig,
  });

  const [tableConfig, setTableConfig] = useState(initConfig);

  const canReset = !isEqual(defaultFilters, filters);

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
    fetchBusinesses({ page: 1 });
  }, [fetchBusinesses]);

  const onResetConfig = useCallback(() => {
    setTableConfig((prev) => ({ ...prev, page: 1 }));
    fetchBusinesses({ page: 1 });
  }, [fetchBusinesses]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(API_ROUTER.business.remove(id));
        if (!res.status) {
          return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.BUSINESS_DELETE_SUCCESS, {
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

  const handleApproveRow = useCallback(
    async (businessId) => {
      try {
        const res = await axiosPatch(API_ROUTER.business.update(businessId), {
          is_approved: true,
        });
        if (!res.status) {
          return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.BUSINESS_UPDATE_SUCCESS, {
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

  const handleSearch = useCallback(
    (inputValue) => {
      setTableConfig((prevState) => ({
        ...prevState,
        page: 1,
        search: inputValue,
      }));
      fetchBusinesses({ page: 1, search: inputValue?.trim() || '' });
    },
    [fetchBusinesses]
  );

  const dataFiltered = [];

  const onChangePage = useCallback(
    (e, page) => {
      setTableConfig((prev) => ({ ...prev, page }));
      fetchBusinesses({ page });
    },
    [setTableConfig, fetchBusinesses]
  );

  const handleSortBy = useCallback(
    (newValue) => {
      setSortBy(newValue);
      fetchBusinesses({
        page: tableConfig.page,
        ...(tableConfig.search ? { search: tableConfig.search } : {}),
        ordering: `${sortByOrder === 'desc' ? '-' : ''}${newValue}`,
      });
    },
    [fetchBusinesses, tableConfig, sortByOrder]
  );

  const handleSortByOrder = useCallback(
    (newValue) => {
      setSortByOrder(newValue);
      fetchBusinesses({
        page: tableConfig.page,
        ...(tableConfig.search ? { search: tableConfig.search } : {}),
        ordering: `${newValue === 'desc' ? '-' : ''}${sortBy}`,
      });
    },
    [fetchBusinesses, tableConfig, sortBy]
  );

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <BusinessSearch
        query={tableConfig.search}
        results={businessResponse?.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.dashboard.business.view(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <BusinessSort sort={sortBy} onSort={handleSortBy} sortOptions={BUSINESS_SORT_OPTIONS} />
        <BusinessSortOrder
          sort={sortByOrder}
          onSort={handleSortByOrder}
          sortOptions={BUSINESS_SORT_ORDER_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <BusinessFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('business.heading')}
        links={[
          { name: t('business.page_name.dashboard'), href: paths.dashboard.root },
          {
            name: t('business.page_name.business'),
            href: paths.dashboard.business.list,
          },
          { name: t('business.page_name.list') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.business.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('business.button.new')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {isLoading ? (
        renderLoading
      ) : (
        <BusinessList
          businesses={businessResponse?.results}
          handleDeleteRow={handleDeleteRow}
          businessResponse={businessResponse}
          page={tableConfig?.page}
          onChangePage={onChangePage}
          handleApproveRow={handleApproveRow}
        />
      )}

      {!businessResponse?.results?.length && (
        <EmptyContent title={t('business.list.no_business')} filled sx={{ py: 10 }} />
      )}
    </Container>
  );
}
