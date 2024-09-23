import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { API_ROUTER } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPost, axiosPatch } from 'src/services/axiosHelper';

import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function ServiceAddUpdateDialog({
  isEdit = false,
  open,
  onClose,
  fetchData = () => {},
  ...other
}) {
  const { t } = useTranslate();

  // Form Config
  const serviceSchema = Yup.object()
    .shape({
      service_name: Yup.string()
        .trim(t('service.update_menu.form.field.service_name.errors.invalid'))
        .required(t('service.update_menu.form.field.service_name.errors.required'))
        .min(1, t('service.update_menu.form.field.service_name.errors.minLength'))
        .max(50, t('service.update_menu.form.field.service_name.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
          t('service.update_menu.form.field.service_name.errors.regex')
        ),
      service_name_ru: Yup.string()
        .trim(t('service.update_menu.form.field.service_name_ru.errors.invalid'))
        .required(t('service.update_menu.form.field.service_name_ru.errors.required'))
        .min(1, t('service.update_menu.form.field.service_name_ru.errors.minLength'))
        .max(50, t('service.update_menu.form.field.service_name_ru.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-zА-Яа-яЁё])[A-Za-zА-Яа-яЁё0-9 -]*$/,
          t('service.update_menu.form.field.service_name_ru.errors.regex')
        ),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      service_name: isEdit?.service_name || '',
      service_name_ru: isEdit?.service_name_ru || '',
    }),
    [isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    reset({ ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onCloseDialog = () => {
    reset({ service_name: '', service_name_ru: '' });
    onClose();
  };

  const onSubmit = handleSubmit(async ({ service_name, service_name_ru }) => {
    try {
      const payload = new FormData();
      if (service_name) payload.append('service_name', service_name);
      if (service_name_ru) payload.append('service_name_ru', service_name_ru);

      const res = isEdit
        ? await axiosPatch(API_ROUTER.service.update(isEdit.id), payload, 'multipart/form-data')
        : await axiosPost(API_ROUTER.service.create, payload, 'multipart/form-data');
      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(
          isEdit ? TOAST_ALERTS.SERVICE_UPDATE_SUCCESS : TOAST_ALERTS.SERVICE_CREATE_SUCCESS,
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

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onCloseDialog} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {isEdit ? t('service.update_menu.heading.update') : t('service.update_menu.heading.add')}{' '}
          {t('service.update_menu.heading.service')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <RHFTextField
              fullWidth
              name="service_name"
              label={t('service.update_menu.form.field.service_name.label')}
            />
            <RHFTextField
              fullWidth
              name="service_name_ru"
              label={t('service.update_menu.form.field.service_name_ru.label')}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {isEdit ? 'Update' : 'Create'}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ServiceAddUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
