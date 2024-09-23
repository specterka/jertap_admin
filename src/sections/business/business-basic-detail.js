import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import React, { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, MenuItem, Typography, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { getPastYears, getPhoneNumber, getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';
import { axiosPatch } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFUpload, RHFTextField, RHFPhoneInput } from 'src/components/hook-form';

const BusinessBasicDetail = ({ currentBusiness }) => {
  const ChangePassWordSchema = Yup.object().shape({
    name: Yup.string()
      .trim('Enter valid restaurant name')
      .required('Business name is required')
      .min(1, 'Business name is too short')
      .max(100, 'Business name is too long - should be at most 100 characters')
      .matches(/^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/, 'Business name must contain at least one letter'),
    profile_image: Yup.mixed()
      .test('fileSize', 'Profile image size is too large', (value) =>
        // eslint-disable-next-line no-nested-ternary
        value ? (typeof value !== 'string' ? value.size <= 5 * 1024 * 1024 : true) : true
      )
      .test('fileType', 'Invalid profile image', (value) =>
        // eslint-disable-next-line no-nested-ternary
        value
          ? typeof value !== 'string'
            ? ['image/jpeg', 'image/png', 'image/jpg'].includes(value?.type)
            : true
          : true
      ),
    year_of_established: Yup.string(),
    business_whatsapp: Yup.string(),
    phone_number: Yup.string(),
    type: Yup.string().required('Business type is required'),
    business_description: Yup.string().trim('Enter valid description'),
    known_for: Yup.string().trim('Enter valid known for'),
    must_order: Yup.string().trim('Enter valid must order'),
    phone_number_2: Yup.string(),
    business_instagram: Yup.string().url('Enter valid link'),
    average_bill: Yup.number(),
    business_capacity: Yup.number(),
    business_email: Yup.string()
      .email('Enter valid email address')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter valid email address'
      ),
    business_website: Yup.string().url('Enter valid link'),
  });

  const defaultValues = useMemo(
    () => ({
      profile_image: currentBusiness?.profile_image || '',
      name: currentBusiness?.name || '',
      year_of_established: currentBusiness?.year_of_established || '',
      type: currentBusiness?.type ? currentBusiness?.type?.id?.toString() : '',
      phone_number: currentBusiness?.phone_number
        ? getPhoneNumber(currentBusiness?.phone_number)
        : '',
      business_whatsapp: currentBusiness?.business_whatsapp
        ? getPhoneNumber(currentBusiness?.business_whatsapp)
        : '',
      known_for: currentBusiness?.known_for || '',
      must_order: currentBusiness?.must_order || '',
      business_description: currentBusiness?.business_description || '',
      phone_number_2: currentBusiness?.phone_number_2
        ? getPhoneNumber(currentBusiness?.phone_number_2)
        : '',
      business_instagram: currentBusiness?.business_instagram || '',
      average_bill: currentBusiness?.average_bill || 0,
      business_capacity: currentBusiness?.business_capacity || 0,
      business_email: currentBusiness?.business_email || '',
      business_website: currentBusiness?.business_website || '',
    }),
    [currentBusiness]
  );

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  const { currentLang } = useLocales();

  const [businessTypes] = useMetaData(API_ROUTER.getBusinessTypes);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const YEARS = useMemo(() => getPastYears(50), []);

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('type', data.type);
      if (data?.profile_image && data?.profile_image !== currentBusiness?.profile_image)
        formData.append('profile_image', data.profile_image);
      if (data?.business_whatsapp)
        formData.append('business_whatsapp', getPhoneNumber(data.business_whatsapp, true));

      if (data?.year_of_established)
        formData.append('year_of_established', data.year_of_established);

      if (data?.phone_number)
        formData.append('phone_number', getPhoneNumber(data.phone_number, true));
      if (data?.phone_number_2)
        formData.append('phone_number_2', getPhoneNumber(data.phone_number_2, true));

      if (data?.address) formData.append('address', data.address);

      if (data?.location) formData.append('location', data.location);

      if (data?.city) formData.append('city', data.city);

      if (data?.state) formData.append('state', data.state);
      if (data?.country) formData.append('country', data.country);
      if (data?.zipcode) formData.append('zipcode', data.zipcode);

      if (data?.business_description)
        formData.append('business_description', data.business_description);

      if (data?.known_for) formData.append('known_for', data.known_for);

      if (data?.must_order) formData.append('must_order', data.must_order);

      if (data?.country) formData.append('country', data.country);

      if (data?.business_instagram) formData.append('business_instagram', data.business_instagram);

      if (data?.average_bill) formData.append('average_bill', data.average_bill);

      if (data?.business_capacity) formData.append('business_capacity', data.business_capacity);

      if (data?.business_email) formData.append('business_email', data.business_email);

      if (data?.business_website) formData.append('business_website', data.business_website);

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
        reset();
        router.push(paths.dashboard.business.list);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('profile_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('profile_image', null);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <Typography sx={{ position: 'absolute', top: 24, left: 24 }} variant="h6">
              Profile Image
            </Typography>
            <RHFUpload
              name="profile_image"
              maxSize={3145728}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
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
              <RHFTextField name="name" label="Business Name" placeholder="Enter business name" />
              <RHFSelect name="type" label="Business Type">
                <MenuItem value="">Select Type</MenuItem>
                {businessTypes &&
                  businessTypes.length > 0 &&
                  businessTypes.map((option) => (
                    <MenuItem key={option.id} value={option.id.toString()}>
                      {getTranslatedData(currentLang, option, 'type')}
                    </MenuItem>
                  ))}
              </RHFSelect>
              <RHFSelect name="year_of_established" label="Established Year">
                {YEARS.map((option) => (
                  <MenuItem key={option} value={option?.toString()}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFPhoneInput name="phone_number" label="Phone Number" />
              <RHFPhoneInput name="phone_number_2" label="Secondary Phone Number" />
              <RHFTextField
                name="business_email"
                placeholder="Enter your business email"
                type="email"
              />
              <RHFTextField
                name="business_instagram"
                placeholder="Enter your business instagram link"
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify width={24} icon="mdi:instagram" color="#cd486b" />
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="average_bill"
                placeholder="Average Bill"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 100000000 } }}
              />
              <RHFTextField
                name="business_capacity"
                placeholder="Business Capacity"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 100000000 } }}
              />
              <RHFPhoneInput name="business_whatsapp" label="Whatsapp Number" />
              <RHFTextField name="known_for" placeholder="Known For" label="Known For" />
              <RHFTextField name="must_order" placeholder="Must Order" label="Must Order" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField
                name="business_description"
                placeholder="Enter business description"
                label="Description"
                multiline
                rows={9}
              />
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default BusinessBasicDetail;

BusinessBasicDetail.propTypes = {
  currentBusiness: PropTypes.object.isRequired,
};
