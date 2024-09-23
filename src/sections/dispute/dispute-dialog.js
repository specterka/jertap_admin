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
import { axiosPatch } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

import DisputeItem from './dispute-item';

export default function DisputeDialog({
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
      replay: Yup.string()
        .required(t('dispute.form.fields.replay.errors.required'))
        .trim(t('dispute.form.fields.replay.errors.invalid'))
        .min(2, t('dispute.form.fields.replay.errors.minLength'))
        .max(1000, t('dispute.form.fields.replay.errors.maxLength'))
        .matches(/^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/, t('dispute.form.fields.replay.errors.regex')),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      replay: isEdit?.replay || '',
    }),
    [isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // Hooks
  const { enqueueSnackbar } = useSnackbar();

  const onCloseDialog = () => {
    onClose();
  };

  const onSubmit = async ({ replay }) => {
    try {
      const res = await axiosPatch(API_ROUTER.disputes.update(isEdit.id), {
        replay,
        is_resolved: true,
      });

      if (!res.status)
        return enqueueSnackbar(res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.DISPUTE_RESOLVED_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        reset();
        fetchData();
        onCloseDialog();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onCloseDialog} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {t('dispute.form.heading')}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <DisputeItem review={isEdit} />
            <RHFTextField
              name="replay"
              multiline
              rows={6}
              label={t('dispute.form.fields.replay.label')}
              placeholder={t('dispute.form.fields.replay.placeholder')}
              disabled={isEdit.is_resolved}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row">
            <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
              <Button
                variant="outlined"
                onClick={onCloseDialog}
                color="error"
                disabled={isSubmitting}
              >
                {t('dispute.button.close')}
              </Button>
              {isEdit.is_resolved === false ? (
                <LoadingButton
                  variant="contained"
                  color="success"
                  type="submit"
                  loading={isSubmitting}
                >
                  {t('dispute.button.replay')}
                </LoadingButton>
              ) : null}
            </Stack>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

DisputeDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
