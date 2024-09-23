'use client';

import { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useTabs from 'src/hooks/use-tabs';

import { useTranslate } from 'src/locales';
import { AUTH_PROVIDERS } from 'src/constants';

import AdminLoginForm from './admin-login-form';
import AdminOtpVerifyForm from './admin-login-otp-verify';

export default function AdminLoginView() {
  // States
  const [userDetails, setUserDetails] = useState(null);
  // Hooks
  const { currentTab, onChangeTab } = useTabs(1);
  const { t } = useTranslate();

  // Renders
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('auth.login.form.title')}</Typography>
    </Stack>
  );

  const renderCurrentForm = useMemo(() => {
    switch (currentTab) {
      case 1:
        return (
          <AdminLoginForm
            onChangeTab={onChangeTab}
            currentTab={currentTab}
            setUserDetails={setUserDetails}
            userDetails={userDetails}
          />
        );
      case 2:
        return (
          <AdminOtpVerifyForm
            resetTab={() => onChangeTab(AUTH_PROVIDERS.MOBILE_NUMBER)}
            currentTab={currentTab}
            setUserDetails={setUserDetails}
            userDetails={userDetails}
          />
        );
      default:
        return null;
    }
  }, [currentTab, onChangeTab, setUserDetails, userDetails]);

  return (
    <>
      {renderHead}
      {renderCurrentForm}
    </>
  );
}
