'use client';

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import i18n from 'src/locales/i18n';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import FormProvider, { RHFPhoneInput } from 'src/components/hook-form';

const AdminLoginPhoneForm = ({ onChangeTab, resetTab }) => {
  // Hook Forms
  const LoginSchema = Yup.object().shape({
    mobile_number: Yup.string()
      .required(i18n.t('auth.login.form.fields.mobile.errors.required'))
      .trim(i18n.t('auth.login.form.fields.mobile.errors.invalid')),
  });

  const defaultValues = {
    mobile_number: '+91',
  };

  // Constants

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const searchParams = useSearchParams();
  const { login } = useAuthContext();
  const router = useRouter();

  // Constants
  const returnTo = searchParams.get('returnTo');

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);
      reset();
      resetTab();
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFPhoneInput
          name="mobile_number"
          label={i18n.t('auth.login.form.fields.mobile.label')}
          placeholder={i18n.t('auth.login.form.fields.mobile.placeholder')}
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

export default AdminLoginPhoneForm;

AdminLoginPhoneForm.propTypes = {
  resetTab: PropTypes.func,
  onChangeTab: PropTypes.func,
};
