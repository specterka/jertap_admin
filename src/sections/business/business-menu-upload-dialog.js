import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import { Button, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { API_ROUTER } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { axiosPost } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Iconify from 'src/components/iconify';
import { RHFUpload } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function BusinessMenuUploadDialog({
  open,
  onClose,
  fetchData = () => {},
  businessId = '',
  ...other
}) {
  const { t } = useTranslate();

  // Form Config
  const categorySchema = Yup.object()
    .shape({
      data_file: Yup.mixed()
        .test('isExist', 'File is required', (value) => !!value)
        .test('fileSize', 'File must be less than 10MB', (value) =>
          // eslint-disable-next-line no-nested-ternary
          value ? (typeof value !== 'string' ? value.size <= 10 * 1024 * 1024 : true) : false
        )
        .test('fileType', 'File is invalid', (value) =>
          // eslint-disable-next-line no-nested-ternary
          value ? (typeof value !== 'string' ? ['text/csv'].includes(value?.type) : true) : false
        ),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      data_file: '',
    }),
    []
  );

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

  const onCloseDialog = () => {
    reset();
    onClose();
  };

  const onSubmit = async (formData) => {
    try {
      const { data_file } = formData;

      const payload = new FormData();

      payload.append('data_file', data_file);

      const res = await axiosPost(
        API_ROUTER.uploadBusinessMenu(businessId),
        payload,
        'multipart/form-data'
      );

      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_MENU_UPLOAD_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        onCloseDialog();
        fetchData();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('data_file', newFiles[0], { shouldValidate: true });
    },
    [setValue]
  );

  const onDownloadFormat = () => {
    try {
      const filePath = '/docs/menu_item_formate.csv';
      const link = document.createElement('a');
      link.href = filePath;
      link.download = 'menu_item_formate.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onCloseDialog} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>Upload Menu</DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2">Upload File</Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<Iconify icon="solar:download-bold" />}
                  onClick={() => onDownloadFormat()}
                >
                  Download Format
                </Button>
              </Stack>
              <RHFUpload
                multiple={false}
                thumbnail
                name="data_file"
                maxSize={10485760}
                onDrop={handleDrop}
                accept={{ 'text/*': ['text/csv'] }}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('category.update_menu.form.button.cancel')}
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {t('business.tabs.menus.button.upload')}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

BusinessMenuUploadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  businessId: PropTypes.string.isRequired,
};
