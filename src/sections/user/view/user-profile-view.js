'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import useMetaData from 'src/hooks/use-meta-data';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import { API_ROUTER } from 'src/utils/axios';
import { getUserName, getUserRole } from 'src/utils/misc';

import i18n from 'src/locales/i18n';
import { useTranslate } from 'src/locales';
import { USER_TYPES, USER_TYPES_MAPPER } from 'src/constants';
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileGallery from '../profile-gallery';
import ProfileBusiness from '../profile-business';
import ProfileFollowers from '../profile-followers';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: i18n.t('user.profile.tabs.profile'),
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
    roles: [USER_TYPES.BUSINESS_OWNER, USER_TYPES.VISITOR, USER_TYPES.RESTAURANT_MANAGER],
  },
  {
    value: 'businesses',
    label: i18n.t('user.profile.tabs.businesses'),
    icon: <Iconify icon="ion:business" width={24} />,
    roles: [USER_TYPES.BUSINESS_OWNER, USER_TYPES.RESTAURANT_MANAGER],
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const { user } = useMockedUser();

  const [currentUser, isUserLoading] = useMetaData(API_ROUTER.user.read(id));

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  if (isUserLoading) return <LoadingScreen />;

  if (!currentUser)
    return (
      <EmptyContent
        filled
        title="Details not found!"
        description="Look like user is not exist."
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.list}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Back to List
          </Button>
        }
      />
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('user.heading1')}
        links={[
          { name: t('user.page_name.dashboard'), href: paths.dashboard.root },
          { name: t('user.page_name.user'), href: paths.dashboard.user.list },
          { name: t('user.page_name.list') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={USER_TYPES_MAPPER[getUserRole(currentUser)]}
          name={getUserName(currentUser)}
          avatarUrl={currentUser?.profile_image || user?.photoURL}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.filter((tab) => tab.roles.includes(getUserRole(currentUser))).map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && (
        <ProfileHome info={currentUser} posts={_userFeeds} detail={currentUser} />
      )}

      {currentTab === 'd' && <ProfileFollowers followers={_userFollowers} />}

      {currentTab === 'businesses' && (
        <ProfileBusiness
          businesses={currentUser?.restaurants}
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />}
    </Container>
  );
}

UserProfileView.propTypes = {
  id: PropTypes.string,
};
