import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

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

import ReportedReviewItem from './reported-review-item';

export default function ReportedReviewDialog({
  isEdit = false,
  open,
  onClose,
  fetchData = () => {},
  ...other
}) {
  // States
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const onCloseDialog = () => {
    onClose();
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axiosPatch(API_ROUTER.reportReview.update(isEdit.id));
      setIsLoading(false);

      if (!res.status)
        return enqueueSnackbar(res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.REPORTED_REVIEW_APPROVED_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
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
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        {t('reportedReview.review.heading')}
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <ReportedReviewItem review={isEdit} />
      </DialogContent>

      <DialogActions>
        <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
          <Button variant="outlined" onClick={onCloseDialog} color="error" disabled={isLoading}>
            {t('reportedReview.button.cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            color="success"
            onClick={() => onSubmit()}
            loading={isLoading}
          >
            {t('reportedReview.button.approve')}
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

ReportedReviewDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};
