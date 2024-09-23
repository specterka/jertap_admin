import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import useTimer from 'src/hooks/use-timer';

import { API_ROUTER } from 'src/utils/axios';
import { formatTimer } from 'src/utils/format-time';

import i18n from 'src/locales/i18n';
import { useAuthContext } from 'src/auth/hooks';
import { EmailInboxIcon } from 'src/assets/icons';
import { axiosPost } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import FormProvider, { RHFCode } from 'src/components/hook-form';

const AdminOtpVerifyForm = ({ userDetails, setUserDetails }) => {
  // States
  const [isResending, setIsResending] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Form Config
  const VerifySchema = Yup.object().shape({
    code: Yup.string()
      .min(6, i18n.t('auth.login.form.fields.code.errors.invalid'))
      .required(i18n.t('auth.login.form.fields.code.errors.required')),
  });

  const defaultValues = {
    code: '',
  };

  // Hooks
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });
  const { verify } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { seconds, resetTimer } = useTimer(60, () => {
    setIsTimerActive(false);
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Handlers
  const onSubmit = handleSubmit(async ({ code }) => {
    try {
      await verify(code);
    } catch (error) {
      console.error(error);
    }
  });

  const onResendCode = async () => {
    try {
      setIsResending(true);
      const res = await axiosPost(API_ROUTER.login(userDetails.provider), {
        email: userDetails.email,
      });
      setIsResending(false);
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.OTP_SENT_SUCCESS, TOAST_TYPES.SUCCESS);
        resetTimer();
        setIsTimerActive(true);
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
    return null;
  };

  // Renders
  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFCode name="code" />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {i18n.t('auth.login.form.button.verify')}
      </LoadingButton>

      {isTimerActive ? (
        <Typography variant="body2" align="right">
          {formatTimer(seconds)}
        </Typography>
      ) : (
        <Typography variant="body2">
          {i18n.t('auth.login.form.fields.code.resendCodeText')}
          <Link
            variant="subtitle2"
            sx={{
              cursor: 'pointer',
            }}
            component={Button}
            onClick={onResendCode}
            disabled={isResending}
          >
            {i18n.t('auth.login.form.button.resend')}
          </Link>
        </Typography>
      )}
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 54 }} />
      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h6" align="center">
          {i18n.t('auth.login.form.fields.code.emailCheckText')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} align="center">
          {i18n.t('auth.login.form.fields.code.codeSentText')}
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
};

export default AdminOtpVerifyForm;

AdminOtpVerifyForm.propTypes = {
  setUserDetails: PropTypes.func,
  userDetails: PropTypes.object,
};
