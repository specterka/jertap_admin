'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';
import { TOUR_PUBLISH_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import BusinessDetailsUsers from '../business-details-users';
import BusinessDetailsMenus from '../business-details-menus';
import BusinessDetailGallery from '../business-details-gallery';
import BusinessDetailsToolbar from '../business-details-toolbar';
import BusinessDetailsContent from '../business-details-content';

export const BUSINESS_DETAILS_TABS = [
  { value: 'content', label: i18n.t('business.profile.label.content') },
  { value: 'gallery', label: i18n.t('business.profile.label.gallery') },
  { value: 'users', label: i18n.t('business.profile.label.users') },
  { value: 'menus', label: i18n.t('business.profile.label.menus') },
];

export default function BusinessDetailsView({ id }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const [currentBusiness, isUserLoading] = useMetaData(API_ROUTER.business.read(id));

  const [publish, setPublish] = useState(currentBusiness?.is_approved);

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  if (isUserLoading) return <LoadingScreen />;

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {BUSINESS_DETAILS_TABS.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );
  if (!currentBusiness)
    return (
      <EmptyContent
        filled
        title={t('business.profile.title')}
        description={t('business.profile.description')}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.business.list}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            {t('business.profile.button')}
          </Button>
        }
      />
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <BusinessDetailsToolbar
        backLink={paths.dashboard.business.list}
        editLink={paths.dashboard.business.edit(`${currentBusiness?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={TOUR_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {currentTab === 'content' && <BusinessDetailsContent business={currentBusiness} />}

      {currentTab === 'gallery' && <BusinessDetailGallery business={currentBusiness} />}

      {currentTab === 'users' && <BusinessDetailsUsers business={currentBusiness} />}

      {currentTab === 'menus' && <BusinessDetailsMenus business={currentBusiness} />}
    </Container>
  );
}

BusinessDetailsView.propTypes = {
  id: PropTypes.string,
};
