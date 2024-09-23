import * as Yup from 'yup';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Tooltip, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getUserRole } from 'src/utils/misc';
import { API_ROUTER } from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { axiosPatch } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS, USER_TYPES_MAPPER } from 'src/constants';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFPhoneInput,
  RHFUploadAvatar,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    username: Yup.string()
      .trim(t('user.update_menu.form.field.username.errors.invalid'))
      .required(t('user.update_menu.form.field.username.errors.required'))
      .min(1, t('user.update_menu.form.field.username.errors.minLength'))
      .max(50, t('user.update_menu.form.field.username.errors.maxLength'))
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9 _]*$/,
        t('user.update_menu.form.field.username.errors.regex')
      ),
    first_name: Yup.string()
      .trim(t('user.update_menu.form.field.first_name.errors.invalid'))
      .required(t('user.update_menu.form.field.first_name.errors.required'))
      .min(1, t('user.update_menu.form.field.first_name.errors.minLength'))
      .max(50, t('user.update_menu.form.field.first_name.errors.maxLength'))
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
        t('user.update_menu.form.field.first_name.errors.regex')
      ),
    last_name: Yup.string()
      .trim(t('user.update_menu.form.field.last_name.errors.invalid'))
      .required(t('user.update_menu.form.field.last_name.errors.required'))
      .min(1, t('user.update_menu.form.field.last_name.errors.minLength'))
      .max(50, t('user.update_menu.form.field.last_name.errors.maxLength'))
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
        t('user.update_menu.form.field.last_name.errors.regex')
      ),
    email: Yup.string()
      .email(t('user.update_menu.form.field.email.errors.invalid'))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter valid email address'
      ),
    mobile_number: Yup.string(),
    profile_image: Yup.mixed()
      .test(
        'isExist',
        t('user.update_menu.form.field.profile_image.errors.isExist'),
        (value) => !!value
      )
      .test('fileSize', t('user.update_menu.form.field.profile_image.errors.fileSize'), (value) =>
        // eslint-disable-next-line no-nested-ternary
        value ? (typeof value !== 'string' ? value.size <= 3 * 1024 * 1024 : true) : false
      )
      .test('fileType', t('user.update_menu.form.field.profile_image.errors.fileType'), (value) =>
        // eslint-disable-next-line no-nested-ternary
        value
          ? typeof value !== 'string'
            ? ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'].includes(value?.type)
            : true
          : false
      ),
    date_of_birth: Yup.date(),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      profile_image: currentUser?.profile_image || null,
      mobile_number: currentUser?.mobile_number ? `+${currentUser?.mobile_number}` : '',
      date_of_birth: currentUser?.date_of_birth
        ? new Date(currentUser?.date_of_birth)
        : new Date(2000),
      role: USER_TYPES_MAPPER[getUserRole(currentUser)],
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = new FormData();
      if (formData.profile_image !== currentUser?.profile_image) {
        payload.append('profile_image', formData?.profile_image);
      }
      if (formData?.mobile_number)
        payload.append('mobile_number', formData?.mobile_number?.split(' ')?.join(''));
      if (formData?.date_of_birth)
        payload.append(
          'date_of_birth',
          formData.date_of_birth ? format(formData.date_of_birth, 'yyyy-MM-dd') : ''
        );
      if (formData?.email) payload.append('email', formData.email);
      if (formData?.username) payload.append('username', formData.username);
      if (formData?.first_name) payload.append('first_name', formData.first_name);
      if (formData?.last_name) payload.append('last_name', formData.last_name);

      const res = await axiosPatch(
        API_ROUTER.user.update(currentUser.id),
        payload,
        'multipart/form-data'
      );
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.USER_UPDATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        reset();
        router.push(paths.dashboard.user.list);
      }
    } catch (error) {
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label color="warning" sx={{ position: 'absolute', top: 24, right: 24 }}>
                {USER_TYPES_MAPPER[getUserRole(currentUser)]}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="profile_image"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
                name="username"
                label={t('user.update_menu.form.field.username.label')}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="This field can't be modified">
                        <Iconify icon="material-symbols:info-outline" width={24} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="first_name"
                label={t('user.update_menu.form.field.first_name.label')}
              />
              <RHFTextField
                name="last_name"
                label={t('user.update_menu.form.field.last_name.label')}
              />
              <RHFTextField
                name="email"
                label={t('user.update_menu.form.field.email.label')}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="This field can't be modified">
                        <Iconify icon="material-symbols:info-outline" width={24} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="role"
                label={t('user.update_menu.form.field.role.label')}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="This field can't be modified">
                        <Iconify icon="material-symbols:info-outline" width={24} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFPhoneInput
                name="mobile_number"
                label={t('user.update_menu.form.field.mobile_number.label')}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="This field can't be modified">
                        <Iconify icon="material-symbols:info-outline" width={24} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    format="dd/MM/yyyy"
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('user.update_menu.form.button.save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
