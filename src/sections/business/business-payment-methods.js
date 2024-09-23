import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import React, { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Card, Grid, Table, MenuItem, TableBody, TableContainer } from '@mui/material';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPost, axiosDelete } from 'src/services/axiosHelper';

import Scrollbar from 'src/components/scrollbar';
import { RHFSelect } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import BusinessPaymentMethodTableRow from './business-payment-method-table-row';

const TABLE_HEAD = [
  { id: 'payment_name', label: 'Payment Method', width: 180 },
  { id: 'created_at', label: 'Created At', width: 220 },
  { id: 'modified_at', label: 'Modified At', width: 180 },
  { id: '', width: 88 },
];

const BusinessPaymentMethods = ({ currentBusiness, fetchBusiness }) => {
  const ChangePassWordSchema = Yup.object().shape({
    payment: Yup.string().required('Please select payment method'),
  });

  const defaultValues = useMemo(
    () => ({
      payment: '',
    }),
    []
  );

  const [allServices, isAllServiceLoading, fetchAllServices] = useMetaData(
    API_ROUTER.getAllPaymentMethods(currentBusiness?.id)
  );

  const [services, isServiceLoading, fetchServices] = useMetaData(
    API_ROUTER.getBusinessPaymentMethods(currentBusiness?.id),
    {}
  );

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultRowsPerPage: 10 });
  const { currentLang } = useLocales();

  const denseHeight = table.dense ? 56 : 56 + 20;

  const UPDATED_SERVICES = useMemo(() => {
    if (allServices && allServices?.length > 0) {
      return allServices?.filter((item) => !item?.is_added);
    }
    return [];
  }, [allServices]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async ({ payment }) => {
    try {
      const res = await axiosPost(API_ROUTER.addPaymentMethodToBusiness(currentBusiness.id), {
        payment,
      });
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }

      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_PAYMENT_METHOD_CREATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        reset();
        fetchServices();
        fetchAllServices();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  });

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const res = await axiosDelete(
          API_ROUTER.deletePaymentMethodFromBusiness(currentBusiness?.id, id)
        );
        if (!res.status) {
          return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
            variant: TOAST_TYPES.ERROR,
          });
        }
        if (res.status) {
          enqueueSnackbar(TOAST_ALERTS.BUSINESS_PAYMENT_METHOD_DELETE_SUCCESS, {
            variant: TOAST_TYPES.SUCCESS,
          });
          fetchServices();
          fetchAllServices();
        }
      } catch (error) {
        enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      return null;
    },
    [enqueueSnackbar, currentBusiness, fetchServices, fetchAllServices]
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
    <Grid container spacing={2}>
      <Grid xs={12} mb={3}>
        <Card sx={{ p: 3, alignItems: 'center' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={11}>
                <RHFSelect name="payment" label="Select Payment Method">
                  {UPDATED_SERVICES?.map((item) => (
                    <MenuItem value={item.id}>
                      {getTranslatedData(currentLang, item, 'payment_name')}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={1}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={isSubmitting}
                >
                  Add
                </LoadingButton>
              </Grid>
            </Grid>
          </FormProvider>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card>
          {isServiceLoading || isAllServiceLoading ? (
            renderLoading
          ) : (
            <Card>
              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                  <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={services?.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                    />

                    <TableBody>
                      {services?.map((row) => (
                        <BusinessPaymentMethodTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                        />
                      ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, [].length)}
                      />

                      <TableNoData notFound={!services?.length} title="No Payment Methods Found" />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Card>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default BusinessPaymentMethods;

BusinessPaymentMethods.propTypes = {
  currentBusiness: PropTypes.object.isRequired,
  fetchBusiness: PropTypes.func.isRequired,
};
