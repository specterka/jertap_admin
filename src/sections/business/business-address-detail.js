import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, MenuItem, Typography } from '@mui/material';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';
import { axiosPatch } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFMap, RHFSelect, RHFTextField } from 'src/components/hook-form';

const center = {
  lat: -3.745,
  lng: -38.523,
};

const BusinessAddressDetail = ({ currentBusiness, fetchBusiness }) => {
  const ChangePassWordSchema = Yup.object().shape({
    address: Yup.string().trim('Enter valid address'),
    address_ru: Yup.string().trim('Enter valid address (In Russian)'),
    location: Yup.string().trim('Enter valid location'),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string().trim('Enter valid country'),
    zipcode: Yup.string().trim('Enter valid zip code'),
    locationConfig: Yup.object().shape({
      latitude: Yup.number(),
      longitude: Yup.number(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      address: currentBusiness?.address || '',
      address_ru: currentBusiness?.address_ru || '',
      location: currentBusiness?.location || '',
      city: currentBusiness?.city ? currentBusiness?.city?.id?.toString() : '',
      state: currentBusiness?.state ? currentBusiness?.state?.id?.toString() : '',
      country: currentBusiness?.country || '',
      zipcode: currentBusiness?.zipcode || '',
      locationConfig: {
        latitude: currentBusiness?.latitude || center.lat,
        longitude: currentBusiness?.longitude || center.lng,
      },
    }),
    [currentBusiness]
  );

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const [cities] = useMetaData(API_ROUTER.getCities);
  const [states] = useMetaData(API_ROUTER.getStates);

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      if (data?.address !== currentBusiness?.address) formData.append('address', data.address);

      if (data?.address_ru !== currentBusiness?.address_ru)
        formData.append('address_ru', data.address_ru);

      if (data?.location !== currentBusiness?.location) formData.append('location', data.location);

      if (data?.city !== currentBusiness?.city) formData.append('city', data.city);

      if (data?.state !== currentBusiness?.state) formData.append('state', data.state);
      if (data?.country !== currentBusiness?.country) formData.append('country', data.country);
      if (data?.zipcode !== currentBusiness?.zipcode) formData.append('zipcode', data.zipcode);

      if (
        data?.locationConfig?.latitude !== currentBusiness?.latitude &&
        data?.locationConfig?.longitude !== currentBusiness?.longitude
      ) {
        formData.append('latitude', data?.locationConfig?.latitude);
        formData.append('longitude', data?.locationConfig?.longitude);
      }

      const res = await axiosPatch(
        API_ROUTER.business.update(currentBusiness.id),
        formData,
        'multipart/form-data'
      );
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }

      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_UPDATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        fetchBusiness();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="address"
                placeholder="Enter business address"
                multiline
                rows={3}
                label="Address"
              />
              <RHFTextField
                name="address_ru"
                placeholder="Enter business address (In Russian)"
                multiline
                rows={3}
                label="Address (In Russian)"
              />
              <RHFTextField name="country" placeholder="Enter country" label="Country" />
              <RHFTextField name="location" placeholder="Enter location" label="Location" />
              <RHFSelect name="city" label="City">
                <MenuItem value="">Select City</MenuItem>
                {cities &&
                  cities.length > 0 &&
                  cities.map((option) => (
                    <MenuItem key={option.id} value={option.id.toString()}>
                      {getTranslatedData(currentLang, option, 'city')}
                    </MenuItem>
                  ))}
              </RHFSelect>
              <RHFSelect name="state" label="State">
                <MenuItem value="">Select State</MenuItem>
                {states &&
                  states.length > 0 &&
                  states.map((option) => (
                    <MenuItem key={option.id} value={option.id.toString()}>
                      {getTranslatedData(currentLang, option, 'state')}
                    </MenuItem>
                  ))}
              </RHFSelect>
              <RHFTextField name="zipcode" placeholder="Enter zipcode" label="Zipcode" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3 }}>
              <Stack>
                <Typography variant="subtitle2">Select Location</Typography>
                <RHFMap name="locationConfig" autocomplete />
              </Stack>
              {isDirty ? (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {isDirty ? 'Save Changes' : 'Update'}
                </LoadingButton>
              ) : null}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default BusinessAddressDetail;

BusinessAddressDetail.propTypes = {
  currentBusiness: PropTypes.object.isRequired,
  fetchBusiness: PropTypes.func.isRequired,
};
