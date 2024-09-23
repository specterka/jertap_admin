'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BusinessNewForm from '../business-new-form';

export default function BusinessCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('business.create.heading')}
        links={[
          {
            name: t('business.create.page_name.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('business.create.page_name.business'),
            href: paths.dashboard.business.root,
          },
          { name: t('business.create.page_name.new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BusinessNewForm />
    </Container>
  );
}
