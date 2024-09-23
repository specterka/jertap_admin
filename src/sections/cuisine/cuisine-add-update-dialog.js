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

export default function CuisineAddUpdateDialog({
  isEdit = false,
  open,
  onClose,
  fetchData = () => {},
  ...other
}) {
  const { t } = useTranslate();

  // Form Config
  const categorySchema = Yup.object()
    .shape({
      cuisines: Yup.string()
        .trim(t('cuisine.update_menu.form.field.cuisines.errors.invalid'))
        .required(t('cuisine.update_menu.form.field.cuisines.errors.required'))
        .min(1, t('cuisine.update_menu.form.field.cuisines.errors.minLength'))
        .max(50, t('cuisine.update_menu.form.field.cuisines.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 -]*$/,
          t('cuisine.update_menu.form.field.cuisines.errors.regex')
        ),
      cuisines_ru: Yup.string()
        .trim(t('cuisine.update_menu.form.field.cuisines_ru.errors.invalid'))
        .required(t('cuisine.update_menu.form.field.cuisines_ru.errors.required'))
        .min(1, t('cuisine.update_menu.form.field.cuisines_ru.errors.minLength'))
        .max(50, t('cuisine.update_menu.form.field.cuisines_ru.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-zА-Яа-яЁё])[A-Za-zА-Яа-яЁё0-9 -]*$/,
          t('cuisine.update_menu.form.field.cuisines_ru.errors.regex')
        ),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      cuisines: isEdit?.cuisines || '',
      cuisines_ru: isEdit?.cuisines_ru || '',
    }),
    [isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(categorySchema),
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
    reset({ name: '', icon: '' });
    onClose();
  };

  const onSubmit = handleSubmit(async ({ cuisines, cuisines_ru }) => {
    try {
      const payload = new FormData();
      if (cuisines) payload.append('cuisines', cuisines);
      if (cuisines_ru) payload.append('cuisines_ru', cuisines_ru);

      const res = isEdit
        ? await axiosPatch(API_ROUTER.cuisine.update(isEdit.id), payload)
        : await axiosPost(API_ROUTER.cuisine.create, payload);
      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(
          isEdit ? TOAST_ALERTS.CUISINE_UPDATE_SUCCESS : TOAST_ALERTS.CUISINE_CREATE_SUCCESS,
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
          {isEdit ? t('cuisine.update_menu.heading.update') : t('cuisine.update_menu.heading.add')}{' '}
          {t('cuisine.update_menu.heading.cuisine')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <RHFTextField
              fullWidth
              name="cuisines"
              label={t('cuisine.update_menu.form.field.cuisines.label')}
            />
            <RHFTextField
              fullWidth
              name="cuisines_ru"
              label={t('cuisine.update_menu.form.field.cuisines_ru.label')}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('cuisine.update_menu.form.button.cancel')}
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {isEdit
                ? t('cuisine.update_menu.form.button.update')
                : t('cuisine.update_menu.form.button.create')}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

CuisineAddUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
