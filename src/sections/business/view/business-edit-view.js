'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Container from '@mui/material/Container';
import { Tab, Tabs, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import useTabs from 'src/hooks/use-tabs';
import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BusinessTiming from '../business-timing';
import BusinessCuisines from '../business-cuisines';
import BusinessBasicDetail from '../business-basic-detail';
import BusinessAddressDetail from '../business-address-detail';
import BusinessPaymentMethods from '../business-payment-methods';
import BusinessAmenitiesService from '../business-amenities-service';

const TABS = [
  {
    value: 'basic-details',
    label: i18n.t('business.edit.label.basic_details'),
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'amenities-services',
    label: i18n.t('business.edit.label.amenities_services'),
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'address-details',
    label: i18n.t('business.edit.label.address_details'),
    icon: <Iconify icon="mdi:address-marker" width={24} />,
  },
  {
    value: 'timings',
    label: i18n.t('business.edit.label.timings'),
    icon: <Iconify icon="mdi:clock-time-five" width={24} />,
  },
  {
    value: 'cuisines',
    label: i18n.t('business.edit.label.cuisines'),
    icon: <Iconify icon="mdi:food" width={24} />,
  },
  {
    value: 'paymentMethods',
    label: i18n.t('business.edit.label.payment_methods'),
    icon: <Iconify icon="streamline:payment-10-solid" width={24} />,
  },
];

export default function BusinessEditView({ id }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { currentTab, setCurrentTab } = useTabs('basic-details');

  const [currentBusiness, isLoading, fetchBusiness] = useMetaData(API_ROUTER.business.read(id));

  const handleChangeTab = useCallback(
    (event, newValue) => {
      setCurrentTab(newValue);
    },
    [setCurrentTab]
  );

  if (isLoading) return <LoadingScreen />;

  if (!currentBusiness)
    return (
      <EmptyContent
        filled
        title={t('business.edit.title')}
        description="Look like business is not exist."
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.business.list}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            {t('business.edit.button')}
          </Button>
        }
      />
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentBusiness?.name}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business', href: paths.dashboard.business.list },
          { name: currentBusiness?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'basic-details' && (
        <BusinessBasicDetail currentBusiness={currentBusiness} fetchBusiness={fetchBusiness} />
      )}

      {currentTab === 'amenities-services' && (
        <BusinessAmenitiesService currentBusiness={currentBusiness} fetchBusiness={fetchBusiness} />
      )}

      {currentTab === 'address-details' && (
        <BusinessAddressDetail currentBusiness={currentBusiness} fetchBusiness={fetchBusiness} />
      )}

      {currentTab === 'timings' && (
        <BusinessTiming currentBusiness={currentBusiness} fetchBusiness={fetchBusiness} />
      )}

      {currentTab === 'cuisines' && (
        <BusinessCuisines currentBusiness={currentBusiness} fetchBusiness={fetchBusiness} />
      )}

      {currentTab === 'paymentMethods' && (
        <BusinessPaymentMethods currentBusiness={currentBusiness} fetchBusiness={fetchBusiness} />
      )}
    </Container>
  );
}

BusinessEditView.propTypes = {
  id: PropTypes.string,
};
