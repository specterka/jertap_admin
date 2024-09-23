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

export default function MenuTypeAddUpdateDialog({
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
      type: Yup.string()
        .trim(t('menuType.form.add.fields.menuType.errors.invalid'))
        .required(t('menuType.form.add.fields.menuType.errors.required'))
        .min(1, t('menuType.form.add.fields.menuType.errors.minLength'))
        .max(50, t('menuType.form.add.fields.menuType.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
          t('menuType.form.add.fields.menuType.errors.regex')
        ),
      type_ru: Yup.string()
        .trim(t('menuType.form.add.fields.menuTypeRu.errors.invalid'))
        .required(t('menuType.form.add.fields.menuTypeRu.errors.required'))
        .min(1, t('menuType.form.add.fields.menuTypeRu.errors.minLength'))
        .max(50, t('menuType.form.add.fields.menuTypeRu.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
          t('menuType.form.add.fields.menuTypeRu.errors.regex')
        ),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      type: isEdit?.type || '',
      type_ru: isEdit?.type_ru || '',
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
    reset({ type: '', type_ru: '' });
    onClose();
  };

  const onSubmit = handleSubmit(async ({ type, type_ru }) => {
    try {
      const payload = new FormData();
      if (type) payload.append('type', type);
      if (type_ru) payload.append('type_ru', type_ru);

      const res = isEdit
        ? await axiosPatch(API_ROUTER.menuType.update(isEdit.id), payload, 'multipart/form-data')
        : await axiosPost(API_ROUTER.menuType.create, payload, 'multipart/form-data');
      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(
          isEdit ? TOAST_ALERTS.MENU_TYPE_UPDATE_SUCCESS : TOAST_ALERTS.MENU_TYPE_CREATE_SUCCESS,
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
          {isEdit ? t('menuType.form.add.heading.update') : t('menuType.form.add.heading.add')}{' '}
          {t('menuType.form.add.heading.menuType')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <RHFTextField
              fullWidth
              name="type"
              label={t('menuType.form.add.fields.menuType.label')}
            />
            <RHFTextField
              fullWidth
              name="type_ru"
              label={t('menuType.form.add.fields.menuType.label')}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('menuType.form.add.button.cancel')}
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {isEdit ? t('menuType.form.add.button.update') : t('menuType.form.add.button.create')}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

MenuTypeAddUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
