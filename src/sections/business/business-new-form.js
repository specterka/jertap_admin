import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useMetaData from 'src/hooks/use-meta-data';
import { useResponsive } from 'src/hooks/use-responsive';

import { API_ROUTER } from 'src/utils/axios';
import { getPastYears, getPhoneNumber, getTranslatedData } from 'src/utils/misc';

import { axiosPost } from 'src/services/axiosHelper';
import { useLocales, useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFMap,
  RHFUpload,
  RHFSelect,
  RHFTextField,
  RHFPhoneInput,
} from 'src/components/hook-form';

const center = {
  lat: -3.745,
  lng: -38.523,
};

export default function BusinessNewForm() {
  const { t } = useTranslate();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const { currentLang } = useLocales();

  const [cities] = useMetaData(API_ROUTER.getCities);
  const [states] = useMetaData(API_ROUTER.getStates);
  const [businessTypes] = useMetaData(API_ROUTER.getBusinessTypes);

  const NewTourSchema = Yup.object()
    .shape({
      name: Yup.string()
        .trim(t('business.create.form.field.name.errors.invalid'))
        .required(t('business.create.form.field.name.errors.required'))
        .min(1, t('business.create.form.field.name.errors.minLength'))
        .max(100, t('business.create.form.field.name.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
          t('business.create.form.field.name.errors.regex')
        ),
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
      phone_number_2: Yup.string(),
      business_instagram: Yup.string().url(),
      average_bill: Yup.number(),
      business_capacity: Yup.number(),
      business_email: Yup.string()
        .email('Please enter valid email address')
        .trim('Enter valid email address')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Please enter valid email address'
        ),
      business_website: Yup.string().url(),
      address: Yup.string().trim(t('business.create.form.field.address.errors.invalid')),
      address_ru: Yup.string().trim(t('business.create.form.field.address.errors.invalid')),
      location: Yup.string().trim(t('business.create.form.field.location.errors.invalid')),
      city: Yup.string().trim(t('business.create.form.field.city.errors.invalid')),
      state: Yup.string().trim(t('business.create.form.field.state.errors.invalid')),
      country: Yup.string().trim(t('business.create.form.field.country.errors.invalid')),
      zipcode: Yup.string().trim(t('business.create.form.field.zipcode.errors.invalid')),
      type: Yup.string().required(t('business.create.form.field.type.errors.required')),
      business_description: Yup.string().trim(
        t('business.create.form.field.business_description.errors.invalid')
      ),
      known_for: Yup.string().trim(t('business.create.form.field.known_for.errors.invalid')),
      must_order: Yup.string().trim(t('business.create.form.field.must_order.errors.invalid')),
      locationConfig: Yup.object().shape({
        latitude: Yup.number(),
        longitude: Yup.number(),
      }),
    })
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      name: '',
      type: '',
      profile_image: '',
      address: '',
      address_ru: '',
      location: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      locationConfig: {
        latitude: center.lat,
        longitude: center.lng,
      },
      year_of_established: '',
      business_whatsapp: '',
      business_description: '',
      known_for: '',
      must_order: '',
      phone_number: '',
      phone_number_2: '',
      business_instagram: '',
      average_bill: 0,
      business_capacity: 0,
      business_email: '',
      business_website: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const YEARS = useMemo(() => getPastYears(50), []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('type', data.type);
      if (data?.profile_image) formData.append('profile_image', data.profile_image);
      if (data?.business_whatsapp)
        formData.append('business_whatsapp', getPhoneNumber(data.business_whatsapp, true));

      if (data?.year_of_established)
        formData.append('year_of_established', data.year_of_established);

      if (data?.phone_number)
        formData.append('phone_number', getPhoneNumber(data.phone_number, true));

      if (data?.address) formData.append('address', data.address);
      if (data?.address_ru) formData.append('address_ru', data.address_ru);

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

      if (data?.phone_number_2) formData.append('phone_number_2', data.phone_number_2);
      if (data?.business_instagram) formData.append('business_instagram', data.business_instagram);

      if (data?.average_bill) formData.append('average_bill', data.average_bill);

      if (data?.business_capacity) formData.append('business_capacity', data.business_capacity);

      if (data?.business_email) formData.append('business_email', data.business_email);

      if (data?.business_website) formData.append('business_website', data.business_website);

      if (
        data?.locationConfig?.latitude !== center.lat &&
        data?.locationConfig?.longitude !== center.lng
      ) {
        formData.append('latitude', data?.locationConfig?.latitude);
        formData.append('longitude', data?.locationConfig?.longitude);
      }

      const res = await axiosPost(API_ROUTER.business.create, formData, 'multipart/form-data');
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }

      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_CREATE_SUCCESS, {
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

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('business.create.business_heading')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('business.create.business_detail')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('business.create.form.field.name.name')}
              </Typography>
              <RHFTextField
                name="name"
                placeholder={t('business.create.form.field.name.placeholder')}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.type.name')}
                </Typography>

                <RHFSelect name="type">
                  <MenuItem value="">{t('business.create.form.field.type.select')}</MenuItem>
                  {businessTypes &&
                    businessTypes.length > 0 &&
                    businessTypes.map((option) => (
                      <MenuItem key={option.id} value={option.id.toString()}>
                        {getTranslatedData(currentLang, option, 'type')}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.year_of_established.name')}
                </Typography>
                <RHFSelect name="year_of_established">
                  {YEARS.map((option) => (
                    <MenuItem key={option} value={option?.toString()}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.phone_number.name')}
                </Typography>
                <RHFPhoneInput name="phone_number" />
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.business_whatsapp.name')}
                </Typography>
                <RHFPhoneInput name="business_whatsapp" />
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.phone_number_2.name')}
                </Typography>
                <RHFPhoneInput name="phone_number_2" />
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.business_instagram.name')}
                </Typography>
                <RHFTextField
                  name="business_instagram"
                  placeholder={t('business.create.form.field.business_instagram.placeholder')}
                  type="url"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify width={24} icon="mdi:instagram" color="#cd486b" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.business_email.name')}
                </Typography>
                <RHFTextField
                  name="business_email"
                  placeholder={t('business.create.form.field.business_email.placeholder')}
                  type="email"
                />
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.business_website.name')}
                </Typography>
                <RHFTextField
                  name="business_website"
                  placeholder={t('business.create.form.field.business_website.placeholder')}
                  type="url"
                />
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('business.create.form.field.business_description.name')}
              </Typography>
              <RHFTextField
                name="business_description"
                placeholder={t('business.create.form.field.business_description.placeholder')}
                multiline
                rows={9}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('business.create.form.field.profile_image.name')}
              </Typography>
              <RHFUpload
                name="profile_image"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAddressDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('business.create.address_heading')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('business.create.address_detail')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Address Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                  {t('business.create.form.field.address.name')}
                </Typography>
                <RHFTextField
                  name="address"
                  placeholder={t('business.create.form.field.address.placeholder')}
                  multiline
                  rows={3}
                />
              </Stack>

              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                  {t('business.create.form.field.address_ru.name')}
                </Typography>
                <RHFTextField
                  name="address_ru"
                  placeholder={t('business.create.form.field.address_ru.placeholder')}
                  multiline
                  rows={3}
                />
              </Stack>
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                {t('business.create.form.field.country.name')}
              </Typography>
              <RHFTextField
                name="country"
                placeholder={t('business.create.form.field.country.placeholder')}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.location.name')}
                </Typography>
                <RHFTextField
                  name="location"
                  placeholder={t('business.create.form.field.location.placeholder')}
                />
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">City</Typography>
                <RHFSelect name="city">
                  <MenuItem value="">Select City</MenuItem>
                  {cities &&
                    cities.length > 0 &&
                    cities.map((option) => (
                      <MenuItem key={option.id} value={option.id.toString()}>
                        {getTranslatedData(currentLang, option, 'city')}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.state.name')}
                </Typography>
                <RHFSelect
                  name="state"
                  placeholder={t('business.create.form.field.state.placeholder')}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states &&
                    states.length > 0 &&
                    states.map((option) => (
                      <MenuItem key={option.id} value={option.id.toString()}>
                        {getTranslatedData(currentLang, option, 'state')}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.zipcode.name')}
                </Typography>
                <RHFTextField
                  name="zipcode"
                  placeholder={t('business.create.form.field.zipcode.placeholder')}
                />
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('business.create.form.field.locationConfig')}
              </Typography>
              <RHFMap name="locationConfig" autocomplete />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderServices = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('business.create.other_heading')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('business.create.other_detail')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Services & Amenities Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('business.create.form.field.known_for.name')}
              </Typography>
              <RHFTextField
                name="known_for"
                placeholder={t('business.create.form.field.known_for.placeholder')}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.average_bill.name')}
                </Typography>
                <RHFTextField
                  name="average_bill"
                  placeholder={t('business.create.form.field.average_bill.placeholder')}
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 100000000 } }}
                />
              </Stack>
              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle2">
                  {t('business.create.form.field.business_capacity.name')}
                </Typography>
                <RHFTextField
                  name="business_capacity"
                  placeholder={t('business.create.form.field.business_capacity.placeholder')}
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 100000000 } }}
                />
              </Stack>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('business.create.form.field.must_order.name')}
              </Typography>
              <RHFTextField
                name="must_order"
                placeholder={t('business.create.form.field.must_order.placeholder')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {t('business.create.form.button.create')}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderAddressDetails}

        {renderServices}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

BusinessNewForm.propTypes = {};
