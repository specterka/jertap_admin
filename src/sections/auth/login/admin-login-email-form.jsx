'use client';

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { axiosPost } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

const AdminLoginEmailForm = ({ currentTab, onSuccess, setUserDetails }) => {
  // Hook Forms
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required(i18n.t('auth.login.form.fields.email.errors.required'))
      .email(i18n.t('auth.login.form.fields.email.errors.invalid'))
      .trim(i18n.t('auth.login.form.fields.email.errors.invalid'))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter valid email address'
      ),
  });

  const defaultValues = {
    email: '',
  };

  // Constants

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  // Constants

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // eslint-disable-next-line consistent-return
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await axiosPost(API_ROUTER.login(currentTab), { ...data });
      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.OTP_SENT_SUCCESS, { variant: TOAST_TYPES.SUCCESS });
        reset();
        setUserDetails({ ...data, provider: currentTab });
        onSuccess();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
      console.error(error);
      reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFTextField
          name="email"
          label={i18n.t('auth.login.form.fields.email.label')}
          placeholder={i18n.t('auth.login.form.fields.email.placeholder')}
        />
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {i18n.t('auth.login.form.button.login')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default AdminLoginEmailForm;

AdminLoginEmailForm.propTypes = {
  onSuccess: PropTypes.func,
  currentTab: PropTypes.string,
  setUserDetails: PropTypes.func,
};
