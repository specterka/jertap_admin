import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { API_ROUTER } from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPost, axiosPatch } from 'src/services/axiosHelper';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFPhoneInput,
  RHFUploadAvatar,
} from 'src/components/hook-form';

export default function CollaboratorNewEditForm({ currentCollaborator }) {
  const { t } = useTranslate();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    full_name: Yup.string()
      .trim(t('collaborator.create.form.field.full_name.errors.invalid'))
      .required(t('collaborator.create.form.field.full_name.errors.required'))
      .min(1, t('collaborator.create.form.field.full_name.errors.minLength'))
      .max(100, t('collaborator.create.form.field.full_name.errors.maxLength'))
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
        t('collaborator.create.form.field.full_name.errors.regex')
      ),
    description: Yup.string()
      .trim(t('collaborator.create.form.field.description.errors.invalid'))
      .required(t('collaborator.create.form.field.description.errors.required'))
      .min(1, t('collaborator.create.form.field.description.errors.minLength'))
      .max(1000, t('collaborator.create.form.field.description.errors.maxLength'))
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9 .]*$/,
        t('collaborator.create.form.field.description.errors.regex')
      ),
    youtube_channel_link: Yup.string()
      .required(t('collaborator.create.form.field.youtube_channel_link.errors.required'))
      .url(t('collaborator.create.form.field.youtube_channel_link.errors.url')),
    fb_profile_link: Yup.string()
      .required(t('collaborator.create.form.field.fb_profile_link.errors.required'))
      .url(t('collaborator.create.form.field.fb_profile_link.errors.url')),
    insta_profile_link: Yup.string()
      .required(t('collaborator.create.form.field.insta_profile_link.errors.required'))
      .url(t('collaborator.create.form.field.insta_profile_link.errors.url')),
    twitter_profile_link: Yup.string()
      .required(t('collaborator.create.form.field.twitter_profile_link.errors.required'))
      .url(t('collaborator.create.form.field.twitter_profile_link.errors.url')),
    profile_pic: Yup.mixed()
      .nullable()
      .required(t('collaborator.create.form.field.profile_pic.errors.required')),
    is_active: Yup.boolean(),
    whatsapp: Yup.string()
      .required(t('collaborator.create.form.field.whatsapp.errors.required'))
      .trim(t('collaborator.create.form.field.whatsapp.errors.invalid'))
      .max(15, t('collaborator.create.form.field.whatsapp.errors.invalid'))
      .test('test-number', (value) => matchIsValidTel(value)),
  });

  const defaultValues = useMemo(
    () => ({
      full_name: currentCollaborator?.full_name || '',
      description: currentCollaborator?.description || '',
      youtube_channel_link: currentCollaborator?.youtube_channel_link || '',
      fb_profile_link: currentCollaborator?.fb_profile_link || '',
      insta_profile_link: currentCollaborator?.insta_profile_link || '',
      twitter_profile_link: currentCollaborator?.twitter_profile_link || '',
      profile_pic: currentCollaborator?.profile_pic || null,
      whatsapp: currentCollaborator?.whatsapp || '',
      is_active: currentCollaborator ? currentCollaborator?.is_active : true,
    }),
    [currentCollaborator]
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
  } = methods;

  const onCreateCollaborator = async (formData) => {
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'whatsapp') {
          payload.append(key, formData[key]?.split(' ')?.join(''));
        } else payload.append(key, formData[key]);
      });
      const res = await axiosPost(API_ROUTER.collaborator.create, payload, 'multipart/form-data');
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.COLLABORATOR_CREATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        reset();
        router.push(paths.dashboard.collaborator.list);
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const onUpdateCollaborator = async (formData) => {
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'profile_pic') {
          if (formData[key] !== currentCollaborator?.profile_pic)
            payload.append(key, formData[key]);
          else if (key === 'whatsapp') payload.append(key, formData[key]?.split(' ')?.join(''));
        } else payload.append(key, formData[key]);
      });
      const res = await axiosPatch(
        API_ROUTER.collaborator.update(currentCollaborator.id),
        payload,
        'multipart/form-data'
      );
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.COLLABORATOR_UPDATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        reset();
        router.push(paths.dashboard.collaborator.list);
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCollaborator) return await onUpdateCollaborator(data);
      await onCreateCollaborator(data);
    } catch (error) {
      console.error(error);
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
        setValue('profile_pic', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentCollaborator && (
              <Label
                color={
                  (currentCollaborator?.is_active && 'success') ||
                  (!currentCollaborator?.is_active && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {currentCollaborator?.is_active ? 'Active' : 'Inactive'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="profile_pic"
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

            <RHFSwitch
              name="is_active"
              labelPlacement="start"
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('collaborator.create.form.field.is_active.heading')}
                </Typography>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
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
                name="full_name"
                label={t('collaborator.create.form.field.full_name.label')}
              />
              <RHFPhoneInput
                name="whatsapp"
                label={t('collaborator.create.form.field.whatsapp.label')}
                placeholder={t('collaborator.create.form.field.whatsapp.placeholder')}
              />
            </Box>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <RHFTextField
                name="youtube_channel_link"
                label={t('collaborator.create.form.field.youtube_channel_link.label')}
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify width={24} icon="mdi:youtube" color="#CD201F" />
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="fb_profile_link"
                label={t('collaborator.create.form.field.fb_profile_link.label')}
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify width={24} icon="mdi:facebook" color="#316FF6" />
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="insta_profile_link"
                label={t('collaborator.create.form.field.insta_profile_link.label')}
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
                name="twitter_profile_link"
                label={t('collaborator.create.form.field.twitter_profile_link.label')}
                type="url"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify width={24} icon="pajamas:twitter" color="#000000" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField
                name="description"
                multiline
                rows={4}
                label={t('collaborator.create.form.field.description.label')}
              />
              <Stack direction="row" gap={1}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isSubmitting}
                  onClick={() => router.push(paths.dashboard.collaborator.list)}
                >
                  {t('collaborator.create.form.button.cancel')}
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentCollaborator
                    ? t('collaborator.create.form.button.create')
                    : t('collaborator.create.form.button.save')}
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CollaboratorNewEditForm.propTypes = {
  currentCollaborator: PropTypes.object,
};
