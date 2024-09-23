'use client';

import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClaimEditForm from '../claim-edit-form';

export default function ClaimDetailView({ id }) {
  // Hooks
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const [currentClaim, isClaimFetching] = useMetaData(API_ROUTER.claim.read(id));

  if (isClaimFetching) return <LoadingScreen />;

  if (!currentClaim)
    return (
      <EmptyContent
        filled
        title="Details not found!"
        description="Look like claim is not exist."
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.claim.list}
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
        heading={t('claim.detail.heading')}
        links={[
          {
            name: t('claim.page_name.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('claim.page_name.claim'),
            href: paths.dashboard.claim.list,
          },
          { name: currentClaim?.request_for?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClaimEditForm currentClaim={currentClaim} />
    </Container>
  );
}

ClaimDetailView.propTypes = {
  id: PropTypes.string,
};
