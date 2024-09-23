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
import { Avatar, Button, Typography } from '@mui/material';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPost, axiosPatch } from 'src/services/axiosHelper';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export default function SubCategoryAddUpdateDialog({
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
      name: Yup.string()
        .trim(t('subCategory.update_menu.form.field.name.errors.invalid'))
        .required(t('subCategory.update_menu.form.field.name.errors.required'))
        .min(1, t('subCategory.update_menu.form.field.name.errors.minLength'))
        .max(50, t('subCategory.update_menu.form.field.name.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 -]*$/,
          t('subCategory.update_menu.form.field.name.errors.regex')
        ),
      name_ru: Yup.string()
        .trim(t('subCategory.update_menu.form.field.name.errors.invalid'))
        .required(t('subCategory.update_menu.form.field.name.errors.required'))
        .min(1, t('subCategory.update_menu.form.field.name.errors.minLength'))
        .max(50, t('subCategory.update_menu.form.field.name.errors.maxLength'))
        .matches(
          /^(?=.*[A-Za-zА-Яа-яЁё])[A-Za-zА-Яа-яЁё0-9 -]*$/,
          t('subCategory.update_menu.form.field.name.errors.regex')
        ),
      category: Yup.object()
        .shape({
          id: Yup.number().required(t('subCategory.update_menu.form.field.category.errors.id')),
          name: Yup.string().required(t('subCategory.update_menu.form.field.category.errors.name')),
        })
        .required(t('subCategory.update_menu.form.field.category.errors.required')),
      icon: Yup.mixed()
        .test(
          'isExist',
          t('subCategory.update_menu.form.field.icon.errors.isExist'),
          (value) => !!value
        )
        .test('fileSize', t('subCategory.update_menu.form.field.icon.errors.fileSize'), (value) =>
          // eslint-disable-next-line no-nested-ternary
          value ? (typeof value !== 'string' ? value.size <= 3 * 1024 * 1024 : true) : false
        )
        .test('fileType', 'Invalid Icon', (value) =>
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
      name: isEdit?.name || '',
      name_ru: isEdit?.name_ru || '',
      icon: isEdit?.icon || '',
      category: isEdit?.category || null,
    }),
    [isEdit]
  );

  const [categories, loading] = useMetaData(API_ROUTER.category.all);

  const methods = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = methods;

  useEffect(() => {
    reset({ ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onCloseDialog = () => {
    reset({ name: '', icon: '', category: null });
    onClose();
  };

  const onSubmit = handleSubmit(async ({ name, name_ru, icon, category }) => {
    try {
      const payload = new FormData();
      if (name) payload.append('name', name);
      if (name_ru) payload.append('name_ru', name_ru);
      if (icon !== isEdit?.icon) {
        payload.append('icon', icon);
      }
      if (category) payload.append('category', category.id);
      const res = isEdit
        ? await axiosPatch(API_ROUTER.subCategory.update(isEdit.id), payload, 'multipart/form-data')
        : await axiosPost(API_ROUTER.subCategory.create, payload, 'multipart/form-data');
      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(
          isEdit
            ? TOAST_ALERTS.SUB_CATEGORY_UPDATE_SUCCESS
            : TOAST_ALERTS.SUB_CATEGORY_CREATE_SUCCESS,
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
      setValue('icon', newFiles[0], { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onCloseDialog} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {isEdit
            ? t('subCategory.update_menu.heading.update')
            : t('subCategory.update_menu.heading.add')}
          {t('subCategory.update_menu.heading.category')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <RHFTextField
              fullWidth
              name="name"
              label={t('subCategory.update_menu.form.field.name.label')}
            />
            <RHFTextField
              fullWidth
              name="name_ru"
              label={t('subCategory.update_menu.form.field.name_ru.label')}
            />

            <RHFAutocomplete
              name="category"
              label={t('subCategory.update_menu.form.field.category.label')}
              placeholder="Select Category"
              options={categories || []}
              loading={loading}
              getOptionLabel={(option) => option?.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Avatar key={option.id} sx={{ mr: 1 }} src={option.icon} />
                  {option.name}
                </li>
              )}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('subCategory.update_menu.form.field.icon.label')}
              </Typography>
              <RHFUpload
                multiple={false}
                thumbnail
                name="icon"
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('subCategory.update_menu.form.button.cancel')}
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {isEdit
                ? t('subCategory.update_menu.form.button.update')
                : t('subCategory.update_menu.form.button.create')}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

SubCategoryAddUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
