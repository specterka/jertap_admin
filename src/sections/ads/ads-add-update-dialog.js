import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Button, MenuItem, Typography } from '@mui/material';

import { API_ROUTER } from 'src/utils/axios';
import { generateArray } from 'src/utils/misc';

import { useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPost, axiosPatch } from 'src/services/axiosHelper';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFSwitch, RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function AdsAddUpdateDialog({
  isEdit = false,
  open,
  onClose,
  fetchData = () => {},
  ...other
}) {
  const { t } = useTranslate();

  // Form Config
  const adsSchema = Yup.object()
    .shape({
      description: Yup.string()
        .trim(t('ads.update_menu.form.field.description.errors.invalid'))
        .required(t('ads.update_menu.form.field.description.errors.required'))
        .min(1, t('ads.update_menu.form.field.description.errors.minLength'))
        .max(1000, t('ads.update_menu.form.field.description.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 $&+,:;=?@#|'<>.^*()%!-]*$/,
          t('ads.update_menu.form.field.description.errors.regex')
        ),
      priority: Yup.string(),
      is_active: Yup.bool(),
      cover_img: Yup.mixed()
        .test(
          'isExist',
          t('ads.update_menu.form.field.cover_img.errors.isExist'),
          (value) => !!value
        )
        .test('fileSize', t('ads.update_menu.form.field.cover_img.errors.fileSize'), (value) =>
          // eslint-disable-next-line no-nested-ternary
          value ? (typeof value !== 'string' ? value.size <= 3 * 1024 * 1024 : true) : false
        )
        .test('fileType', t('ads.update_menu.form.field.cover_img.errors.fileType'), (value) =>
          // eslint-disable-next-line no-nested-ternary
          value
            ? typeof value !== 'string'
              ? ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'].includes(value?.type)
              : true
            : false
        ),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      description: isEdit?.description || '',
      priority: isEdit?.priority?.toString() || '',
      is_active: isEdit?.is_active || false,
      cover_img: isEdit?.cover_img || '',
    }),
    [isEdit]
  );

  // Hooks
  const methods = useForm({
    resolver: yupResolver(adsSchema),
    defaultValues,
  });

  const PRIORITY_OPTIONS = useMemo(() => generateArray(5), []);

  const { enqueueSnackbar } = useSnackbar();

  // constants
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = methods;

  // Effects
  useEffect(() => {
    reset({ ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // Handlers
  const onCloseDialog = () => {
    reset({ description: '', cover_img: '', priority: '', is_active: '' });
    onClose();
  };

  const onSubmit = handleSubmit(async ({ cover_img, description, priority, is_active }) => {
    try {
      const payload = new FormData();
      if (description) payload.append('description', description);
      if (priority) payload.append('priority', priority);
      payload.append('is_active', is_active);
      if (cover_img !== isEdit?.cover_img) {
        payload.append('cover_img', cover_img);
      }
      const res = isEdit
        ? await axiosPatch(API_ROUTER.ads.update(isEdit.id), payload, 'multipart/form-data')
        : await axiosPost(API_ROUTER.ads.create, payload, 'multipart/form-data');

      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }

      if (res.status) {
        enqueueSnackbar(
          isEdit ? TOAST_ALERTS.ADS_UPDATE_SUCCESS : TOAST_ALERTS.ADS_CREATE_SUCCESS,
          {
            variant: TOAST_TYPES.SUCCESS,
          }
        );
        onCloseDialog();
        fetchData();
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
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('cover_img', newFiles[0], { shouldValidate: true });
    },
    [setValue]
  );

  // Returns
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onCloseDialog} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {isEdit ? t('ads.update_menu.heading.update') : t('ads.update_menu.heading.add')}{' '}
          {t('ads.update_menu.heading.ads')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('ads.update_menu.form.field.cover_img.name')}
              </Typography>
              <RHFUpload
                multiple={false}
                thumbnail
                name="cover_img"
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </Stack>
            <RHFTextField
              fullWidth
              name="description"
              label={t('ads.update_menu.form.field.description.label')}
              placeholder={t('ads.update_menu.form.field.description.placeholder')}
              multiline
              rows={5}
            />
            <RHFSelect fullWidth name="priority" label="Priority">
              {PRIORITY_OPTIONS?.map((item) => (
                <MenuItem value={item.toString()}>{item}</MenuItem>
              ))}
            </RHFSelect>
            <RHFSwitch name="is_active" label="Is Active?" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('ads.update_menu.form.button.cancel')}
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {isEdit
                ? t('ads.update_menu.form.button.update')
                : t('ads.update_menu.form.button.create')}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AdsAddUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
