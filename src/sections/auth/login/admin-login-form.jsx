import PropTypes from 'prop-types';
import React, { useMemo, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import useTabs from 'src/hooks/use-tabs';

import i18n from 'src/locales/i18n';
import { AUTH_PROVIDERS } from 'src/constants';

import Iconify from 'src/components/iconify';

import AdminLoginEmailForm from './admin-login-email-form';
import AdminLoginPhoneForm from './admin-login-phone-form';

const TABS = [
  {
    value: AUTH_PROVIDERS.MOBILE_NUMBER,
    icon: <Iconify icon="solar:phone-bold" width={24} />,
    label: i18n.t('auth.login.tabs.phoneNumber'),
  },
  {
    value: AUTH_PROVIDERS.EMAIL,
    icon: <Iconify icon="ic:baseline-email" width={24} />,
    label: i18n.t('auth.login.tabs.email'),
  },
];

const AdminLoginForm = ({ onChangeTab: onChangeStep, setUserDetails, userDetails }) => {
  // Hooks
  const { currentTab, onChangeTab } = useTabs(AUTH_PROVIDERS.MOBILE_NUMBER);

  // Handlers
  const handleChangeTab = useCallback(
    (event, newValue) => {
      onChangeTab(newValue);
    },
    [onChangeTab]
  );

  const onSuccess = useCallback(() => {
    onChangeTab(AUTH_PROVIDERS.MOBILE_NUMBER);
    onChangeStep(2);
  }, [onChangeTab, onChangeStep]);

  const renderCurrentForm = useMemo(() => {
    switch (currentTab) {
      case AUTH_PROVIDERS.MOBILE_NUMBER:
        return (
          <AdminLoginPhoneForm
            onChangeTab={onChangeTab}
            currentTab={currentTab}
            setUserDetails={setUserDetails}
          />
        );
      case AUTH_PROVIDERS.EMAIL:
        return (
          <AdminLoginEmailForm
            currentTab={currentTab}
            onSuccess={onSuccess}
            setUserDetails={setUserDetails}
          />
        );
      default:
        return null;
    }
  }, [currentTab, onChangeTab, onSuccess, setUserDetails]);

  return (
    <>
      <Tabs sx={{ mb: 2.5 }} value={currentTab} onChange={handleChangeTab}>
        {TABS.map((tab) => (
          <Tab key={tab.value} icon={tab.icon} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {renderCurrentForm}
    </>
  );
};

export default AdminLoginForm;

AdminLoginForm.propTypes = {
  onChangeTab: PropTypes.func,
  setUserDetails: PropTypes.func,
  userDetails: PropTypes.object,
};
